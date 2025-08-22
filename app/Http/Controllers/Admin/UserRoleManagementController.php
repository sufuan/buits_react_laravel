<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Designation;
use App\Models\RoleChangeLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UserRoleManagementController extends Controller
{
    /**
     * Display a listing of users with role management capabilities.
     */
    public function index(Request $request)
    {
        $query = User::with(['designation', 'roleChangeLogs.admin']);
        
        // Apply search filters
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('student_id', 'like', '%' . $request->search . '%');
            });
        }
        
        // Filter by user type
        if ($request->usertype && $request->usertype !== 'all') {
            $query->where('usertype', $request->usertype);
        }
        
        // Filter by department
        if ($request->department && $request->department !== 'all') {
            $query->where('department', $request->department);
        }
        
        // Filter by designation
        if ($request->designation_id && $request->designation_id !== 'all') {
            $query->where('designation_id', $request->designation_id);
        }
        
        $users = $query->paginate(20)->withQueryString();
        
        $designations = Designation::orderBy('level')->orderBy('name')->get();
        
        $filters = [
            'search' => $request->search,
            'usertype' => $request->usertype,
            'department' => $request->department,
            'designation_id' => $request->designation_id,
        ];
        
        $departments = User::select('department')
            ->distinct()
            ->whereNotNull('department')
            ->where('department', '!=', '')
            ->orderBy('department')
            ->pluck('department');
        
        $userTypes = User::select('usertype')
            ->distinct()
            ->whereNotNull('usertype')
            ->where('usertype', '!=', '')
            ->orderBy('usertype')
            ->pluck('usertype');
        
        return Inertia::render('Admin/UserRoleManagement/UserRoleManagement', [
            'users' => $users,
            'designations' => $designations,
            'filters' => $filters,
            'departments' => $departments,
            'userTypes' => $userTypes,
        ]);
    }

    /**
     * Update a user's role/designation.
     */
    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'designation_id' => [
                'required',
                'exists:designations,id'
            ],
            'reason' => 'required|string|max:500'
        ]);

        $previousDesignation = $user->designation;
        $newDesignation = Designation::findOrFail($request->designation_id);
        
        // Check if the designation is actually changing
        if ($user->designation_id == $request->designation_id) {
            return back()->with('error', 'User already has this designation.');
        }
        
        // Log the role change
        RoleChangeLog::create([
            'user_id' => $user->id,
            'admin_id' => Auth::id(),
            'previous_designation_id' => $user->designation_id,
            'new_designation_id' => $request->designation_id,
            'reason' => $request->reason,
            'changed_at' => now(),
        ]);
        
        // Update the user's designation
        $user->update([
            'designation_id' => $request->designation_id
        ]);
        
        $message = "Role updated successfully for {$user->name}";
        if ($previousDesignation) {
            $message .= " from {$previousDesignation->name} to {$newDesignation->name}";
        } else {
            $message .= " to {$newDesignation->name}";
        }
        
        return back()->with('success', $message);
    }

    /**
     * Show role change history for a specific user.
     */
    public function showHistory(User $user)
    {
        $history = RoleChangeLog::with(['admin', 'previousDesignation', 'newDesignation'])
            ->where('user_id', $user->id)
            ->orderBy('changed_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('Admin/UserRoleManagement/UserRoleHistory', [
            'user' => $user->load('designation'),
            'history' => $history,
        ]);
    }

    /**
     * Get users for role management with basic info only (for API endpoints).
     */
    public function getUsersForRoleManagement(Request $request)
    {
        $query = User::with('designation')
            ->select(['id', 'name', 'email', 'student_id', 'usertype', 'department', 'designation_id', 'created_at']);
        
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('student_id', 'like', '%' . $request->search . '%');
            });
        }
        
        $users = $query->paginate(50);
        
        return response()->json($users);
    }

    /**
     * Bulk update roles for multiple users.
     */
    public function bulkUpdateRoles(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'designation_id' => 'required|exists:designations,id',
            'reason' => 'required|string|max:500'
        ]);

        $users = User::whereIn('id', $request->user_ids)->get();
        $designation = Designation::findOrFail($request->designation_id);
        $updatedCount = 0;
        
        foreach ($users as $user) {
            // Skip if user already has this designation
            if ($user->designation_id == $request->designation_id) {
                continue;
            }
            
            // Log the role change
            RoleChangeLog::create([
                'user_id' => $user->id,
                'admin_id' => Auth::id(),
                'previous_designation_id' => $user->designation_id,
                'new_designation_id' => $request->designation_id,
                'reason' => $request->reason,
                'changed_at' => now(),
            ]);
            
            // Update the user's designation
            $user->update([
                'designation_id' => $request->designation_id
            ]);
            
            $updatedCount++;
        }
        
        return back()->with('success', "Successfully updated roles for {$updatedCount} users to {$designation->name}.");
    }

    /**
     * Get role change statistics.
     */
    public function getRoleChangeStats()
    {
        $stats = [
            'total_role_changes' => RoleChangeLog::count(),
            'changes_this_month' => RoleChangeLog::whereMonth('changed_at', now()->month)
                ->whereYear('changed_at', now()->year)
                ->count(),
            'most_active_admin' => RoleChangeLog::with('admin')
                ->selectRaw('admin_id, COUNT(*) as changes_count')
                ->groupBy('admin_id')
                ->orderBy('changes_count', 'desc')
                ->first(),
            'most_changed_designation' => RoleChangeLog::with('newDesignation')
                ->selectRaw('new_designation_id, COUNT(*) as changes_count')
                ->groupBy('new_designation_id')
                ->orderBy('changes_count', 'desc')
                ->first(),
        ];
        
        return response()->json($stats);
    }

    /**
     * Export role change history to Excel.
     */
    public function exportRoleChanges(Request $request)
    {
        // You can implement Excel export here if needed
        // This would require maatwebsite/excel package
        
        return back()->with('info', 'Export functionality will be implemented soon.');
    }
}
