<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class AdminManagementController extends Controller
{
    /**
     * Display a listing of admins
     */
    public function index()
    {
        $admins = Admin::with('roles:id,name')
            ->select('id', 'name', 'username', 'email', 'status', 'created_at')
            ->get();

        $roles = Role::where('guard_name', 'admin')
            ->select('id', 'name')
            ->get();

        // Get all approved users who are not already admins
        $users = User::where('is_approved', true)
            ->select('id', 'name', 'email', 'member_id', 'department', 'usertype')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/AdminManagement/Index', [
            'admins' => $admins,
            'roles' => $roles,
            'users' => $users,
        ]);
    }

    /**
     * Assign admin role to an existing user
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|exists:roles,name',
        ]);

        // Get the user
        $user = User::findOrFail($validated['user_id']);

        // Check if user already has admin access
        $existingAdmin = Admin::where('email', $user->email)->first();
        if ($existingAdmin) {
            return redirect()->back()->with('error', 'This user already has admin access!');
        }

        // Create admin account from user data
        $admin = Admin::create([
            'name' => $user->name,
            'username' => $user->email, // Use email as username
            'email' => $user->email,
            'password' => $user->password, // Use existing password hash
            'status' => 'active',
        ]);

        // Assign role
        $admin->assignRole($validated['role']);

        return redirect()->back()->with('success', 'User assigned as admin successfully!');
    }

    /**
     * Update the specified admin
     */
    public function update(Request $request, Admin $admin)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:admins,username,' . $admin->id,
            'email' => 'required|email|unique:admins,email,' . $admin->id,
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $admin->update($validated);

        return redirect()->back()->with('success', 'Admin updated successfully!');
    }

    /**
     * Assign role to admin
     */
    public function assignRole(Request $request, Admin $admin)
    {
        $validated = $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        // Prevent changing superadmin role if it's the last superadmin
        if ($admin->hasRole('superadmin')) {
            $superAdminCount = Admin::role('superadmin')->count();
            if ($superAdminCount <= 1 && $validated['role'] !== 'superadmin') {
                return redirect()->back()->with('error', 'Cannot change role of the last superadmin!');
            }
        }

        $admin->syncRoles([$validated['role']]);

        return redirect()->back()->with('success', 'Role assigned successfully!');
    }

    /**
     * Change admin status
     */
    public function changeStatus(Request $request, Admin $admin)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive,suspended',
        ]);

        // Prevent deactivating the last superadmin
        if ($admin->hasRole('superadmin') && $validated['status'] !== 'active') {
            $activeSuperAdmins = Admin::role('superadmin')
                ->where('status', 'active')
                ->count();
            
            if ($activeSuperAdmins <= 1) {
                return redirect()->back()->with('error', 'Cannot deactivate the last active superadmin!');
            }
        }

        $admin->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Admin status updated successfully!');
    }

    /**
     * Remove the specified admin
     */
    public function destroy(Admin $admin)
    {
        // Prevent deletion of superadmin if it's the last one
        if ($admin->hasRole('superadmin')) {
            $superAdminCount = Admin::role('superadmin')->count();
            if ($superAdminCount <= 1) {
                return redirect()->back()->with('error', 'Cannot delete the last superadmin!');
            }
        }

        // Prevent self-deletion
        if ($admin->id === auth('admin')->id()) {
            return redirect()->back()->with('error', 'Cannot delete your own account!');
        }

        $admin->delete();

        return redirect()->back()->with('success', 'Admin deleted successfully!');
    }
}

