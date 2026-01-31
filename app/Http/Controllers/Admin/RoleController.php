<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    /**
     * Display a listing of roles
     */
    public function index()
    {
        $roles = Role::where('guard_name', 'admin')
            ->withCount('permissions')
            ->with('permissions:id,name')
            ->get();

        // Get all permissions and group them by resource prefix
        $permissions = Permission::where('guard_name', 'admin')
            ->select('id', 'name')
            ->get()
            ->groupBy(function ($permission) {
                // Group by the prefix before the dot (e.g., 'role' from 'role.view')
                $parts = explode('.', $permission->name);
                return ucfirst($parts[0]) . ' Management';
            });

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'permissionGroups' => $permissions,
        ]);
    }

    /**
     * Store a newly created role
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'admin',
        ]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role created successfully!');
    }

    /**
     * Update the specified role
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->update([
            'name' => $validated['name'],
        ]);

        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->back()->with('success', 'Role updated successfully!');
    }

    /**
     * Remove the specified role
     */
    public function destroy(Role $role)
    {
        // Prevent deletion of superadmin role
        if ($role->name === 'superadmin') {
            return redirect()->back()->with('error', 'Cannot delete superadmin role!');
        }

        // Check if role is assigned to any admins
        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete role that is assigned to admins!');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully!');
    }

    /**
     * Assign permissions to role
     */
    public function assignPermissions(Request $request, Role $role)
    {
        $validated = $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $role->syncPermissions($validated['permissions']);

        return redirect()->back()->with('success', 'Permissions assigned successfully!');
    }
}

