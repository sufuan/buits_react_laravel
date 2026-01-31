<?php

namespace App\Http\Controllers;

use App\Models\ExecutiveApplication;
use App\Models\PendingUser;
use App\Models\Setting;
use App\Models\AdminLog;
use Illuminate\Http\Request;
use App\Models\VolunteerApplication;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class VolunteerApplicationController extends Controller
{
    /**
     * Display a listing of applications (for admin)
     */
    public function index()
    {
        $applications = VolunteerApplication::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $pendingUsersCount = PendingUser::count();
        $pendingVolunteerApplications = VolunteerApplication::where('status', 'pending')->count();
        $pendingExecutiveApplications = ExecutiveApplication::where('status', 'pending')->count();

        return Inertia::render('Admin/VolunteerApplications/VolunteerApplicationManagement', [
            'applications' => $applications,
            'pendingUsersCount' => $pendingUsersCount,
            'pendingVolunteerApplications' => $pendingVolunteerApplications,
            'pendingExecutiveApplications' => $pendingExecutiveApplications,
        ]);
    }

    /**
     * Show the form for creating a new application
     */
    public function create()
    {
        $user = Auth::user();
        
        // Check if volunteer applications are enabled
        $setting = Setting::where('key', 'volunteer_applications_enabled')->first();
        if ($setting && $setting->value !== 'true') {
            return redirect()->route('dashboard')->with('error', 'Volunteer applications are currently closed.');
        }

        // Check if user is eligible (must be member and not already applied)
        if ($user->usertype !== 'member') {
            return redirect()->back()->with('error', 'Only members can apply for volunteer role.');
        }

        $existingApplication = $user->volunteerApplication;
        if ($existingApplication) {
            return redirect()->route('dashboard')->with('info', 'You have already submitted a volunteer application.');
        }

        return Inertia::render('Dashboard/VolunteerApplication/Create', [
            'user' => $user
        ]);
    }

    /**
     * Store a newly created application
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if volunteer applications are enabled
        $setting = Setting::where('key', 'volunteer_applications_enabled')->first();
        if ($setting && $setting->value !== 'true') {
            return redirect()->route('dashboard')->with('error', 'Volunteer applications are currently closed.');
        }

        // Validate user eligibility
        if ($user->usertype !== 'member') {
            return redirect()->back()->with('error', 'Only members can apply for volunteer role.');
        }

        // Check for existing application
        if ($user->volunteerApplication) {
            return redirect()->back()->with('error', 'You have already submitted a volunteer application.');
        }

        $validated = $request->validate([
            'reason' => 'nullable|string|max:1000'
        ]);

        VolunteerApplication::create([
            'user_id' => $user->id,
            'reason' => $validated['reason'],
            'status' => 'pending'
        ]);

        return redirect()->route('dashboard')->with('success', 'Your volunteer application has been submitted successfully!');
    }

    /**
     * Display the specified application
     */
    public function show(VolunteerApplication $application)
    {
        $application->load('user');

        return Inertia::render('Admin/VolunteerApplications/Show', [
            'application' => $application
        ]);
    }

    /**
     * Update application status (admin only)
     */
    public function update(Request $request, VolunteerApplication $application)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        $application->update([
            'status' => $validated['status'],
            'admin_notes' => $validated['admin_notes'],
            'approved_at' => $validated['status'] === 'approved' ? now() : null
        ]);

        // If approved, update user type to volunteer
        if ($validated['status'] === 'approved') {
            $application->user->update(['usertype' => 'volunteer']);
        }

        // Log the action
        AdminLog::create([
            'admin_id' => Auth::guard('admin')->id(),
            'target_user_id' => $application->user_id,
            'action' => $validated['status'] === 'approved' ? 'approve_volunteer_application' : 'reject_volunteer_application',
            'details' => [
                'reason' => $validated['status'] === 'rejected' ? $validated['admin_notes'] : null
            ],
            'ip_address' => $request->ip()
        ]);

        return redirect()->route('admin.applications.volunteer.index')->with('success', 'Application status updated successfully!');
    }

    /**
     * Remove the specified application
     */
    public function destroy(VolunteerApplication $application)
    {
        $application->delete();
        return redirect()->back()->with('success', 'Application deleted successfully!');
    }
}
