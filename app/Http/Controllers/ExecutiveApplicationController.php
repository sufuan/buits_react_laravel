<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExecutiveApplication;
use App\Models\Designation;
use App\Models\RoleChangeLog;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ExecutiveApplicationController extends Controller
{
    /**
     * Display a listing of applications (for admin)
     */
    public function index()
    {
        $applications = ExecutiveApplication::with(['user', 'designation'])
            ->orderBy('created_at', 'desc')
            ->get();

        $designations = Designation::orderBy('level')->orderBy('name')->get();

        return Inertia::render('Admin/ExecutiveApplications/ExecutiveApplicationManagement', [
            'applications' => $applications,
            'designations' => $designations
        ]);
    }

    /**
     * Show the form for creating a new application
     */
    public function create()
    {
        $user = Auth::user();
        
        // Check if user is eligible (must be volunteer)
        if ($user->usertype !== 'volunteer') {
            return redirect()->back()->with('error', 'Only volunteers can apply for executive positions.');
        }

                // Get available designations
        $designations = Designation::orderBy('sort_order')->get();

        return Inertia::render('Dashboard/ExecutiveApplication/Create', [
            'user' => $user,
            'designations' => $designations
        ]);
    }

    /**
     * Store a newly created application
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Validate user eligibility
        if ($user->usertype !== 'volunteer') {
            return redirect()->back()->with('error', 'Only volunteers can apply for executive positions.');
        }

        $validated = $request->validate([
            'designation_id' => 'required|exists:designations,id',
            'reason' => 'nullable|string|max:1000'
        ]);

        // Check if user already applied for this designation
        $existingApplication = ExecutiveApplication::where('user_id', $user->id)
            ->where('designation_id', $validated['designation_id'])
            ->where('status', 'pending')
            ->first();

        if ($existingApplication) {
            return redirect()->back()->with('error', 'You have already applied for this position.');
        }

        ExecutiveApplication::create([
            'user_id' => $user->id,
            'designation_id' => $validated['designation_id'],
            'reason' => $validated['reason'],
            'status' => 'pending'
        ]);

        return redirect()->route('dashboard')->with('success', 'Your executive application has been submitted successfully!');
    }

    /**
     * Display the specified application
     */
    public function show(ExecutiveApplication $application)
    {
        $application->load(['user', 'designation']);

        return Inertia::render('Admin/ExecutiveApplications/Show', [
            'application' => $application
        ]);
    }

    /**
     * Update application status (admin only)
     */
    public function update(Request $request, ExecutiveApplication $application)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_comment' => 'nullable|string|max:500',
            'designation_id' => 'nullable|exists:designations,id',
        ]);

        DB::transaction(function () use ($request, $application) {
            // Update application
            $application->update([
                'status' => $request->status,
                'admin_comment' => $request->admin_comment,
                'processed_at' => now(),
                'processed_by_admin_id' => Auth::guard('admin')->id(),
            ]);

            // If approved, update user role and designation
            if ($request->status === 'approved') {
                $user = $application->user;
                $previousUsertype = $user->usertype;
                $previousDesignationId = $user->designation_id;
                
                // Use the designation from request if provided, otherwise use application designation
                $newDesignationId = $request->designation_id ?? $application->designation_id;

                $user->update([
                    'usertype' => 'executive',
                    'designation_id' => $newDesignationId,
                ]);

                // Log the role change
                RoleChangeLog::create([
                    'user_id' => $user->id,
                    'old_usertype' => $previousUsertype,
                    'new_usertype' => 'executive',
                    'old_designation_id' => $previousDesignationId,
                    'new_designation_id' => $newDesignationId,
                    'admin_id' => Auth::guard('admin')->id(),
                    'reason' => 'Executive application approved: ' . ($request->admin_comment ?? 'No comment provided'),
                ]);
            }
        });

        return redirect()->back()->with('success', 'Application ' . $request->status . ' successfully.');
    }

    /**
     * Remove the specified application
     */
    public function destroy(ExecutiveApplication $application)
    {
        $application->delete();
        return redirect()->back()->with('success', 'Application deleted successfully!');
    }
}
