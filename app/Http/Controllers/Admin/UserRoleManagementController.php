<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Designation;
use App\Models\RoleChangeLog;
use App\Exports\UserRoleManagementExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Validation\Rule;

class UserRoleManagementController extends Controller
{
        /**
     * Display the user role management page.
     */
    public function index(Request $request)
    {
        $query = User::with('designation')
            ->where('usertype', 'executive'); // Only show executive users
        
        // Apply search filter
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('member_id', 'like', '%' . $request->search . '%');
            });
        }
        
        // Apply usertype filter (only executives, but allow filtering by specific executive roles)
        if ($request->usertype && $request->usertype !== 'all') {
            $query->where('usertype', $request->usertype);
        }
        
        // Apply designation filter
        if ($request->designation_id && $request->designation_id !== 'all') {
            $query->where('designation_id', $request->designation_id);
        }
        
        $users = $query->paginate(15)->withQueryString();
        
        $designations = Designation::orderBy('name')->get();
        
        $filters = [
            'search' => $request->search,
            'usertype' => $request->usertype,
            'designation_id' => $request->designation_id,
        ];
        
        $userTypes = User::select('usertype')
            ->distinct()
            ->where('usertype', 'executive')
            ->whereNotNull('usertype')
            ->where('usertype', '!=', '')
            ->orderBy('usertype')
            ->pluck('usertype');;

        // Get statistics for executives only
        $statistics = [
            'total_executives' => User::where('usertype', 'executive')->count(),
            'with_designations' => User::where('usertype', 'executive')->whereNotNull('designation_id')->count(),
            'without_designations' => User::where('usertype', 'executive')->whereNull('designation_id')->count(),
            'recent_changes' => RoleChangeLog::where('created_at', '>=', now()->subDays(30))->count(),
        ];
        
        return Inertia::render('Admin/UserRoleManagement/UserRoleManagement', [
            'users' => $users,
            'designations' => $designations,
            'filters' => $filters,
            'userTypes' => $userTypes,
            'statistics' => $statistics,
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
            'admin_id' => Auth::guard('admin')->id(),
            'old_usertype' => $user->usertype,
            'new_usertype' => 'executive', // Since we're only managing executive designations
            'old_designation_id' => $user->designation_id,
            'new_designation_id' => $request->designation_id,
            'reason' => $request->reason,
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
                  ->orWhere('member_id', 'like', '%' . $request->search . '%');
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
                'admin_id' => Auth::guard('admin')->id(),
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
     * Export users to Excel.
     */
    public function exportExcel(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'usertype' => $request->usertype,
            'designation_id' => $request->designation_id,
        ];

        $filename = 'user-roles-' . now()->format('Y-m-d-H-i-s') . '.xlsx';
        
        return Excel::download(new UserRoleManagementExport($filters), $filename);
    }

    /**
     * Export users to CSV.
     */
    public function exportCsv(Request $request)
    {
        $filters = [
            'search' => $request->search,
            'usertype' => $request->usertype,
            'designation_id' => $request->designation_id,
        ];

        $filename = 'user-roles-' . now()->format('Y-m-d-H-i-s') . '.csv';
        
        return Excel::download(new UserRoleManagementExport($filters), $filename, \Maatwebsite\Excel\Excel::CSV);
    }
}
