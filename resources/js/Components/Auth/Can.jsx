import { usePage } from '@inertiajs/react';

/**
 * Can Component - Permission-based rendering
 * 
 * Usage:
 * <Can permission="role.view">
 *   <Link href="/admin/roles">Manage Roles</Link>
 * </Can>
 * 
 * <Can role="superadmin">
 *   <div>SuperAdmin Only Content</div>
 * </Can>
 * 
 * <Can permission="user.create" fallback={<div>No access</div>}>
 *   <button>Create User</button>
 * </Can>
 */
export default function Can({ permission, role, children, fallback = null }) {
    const { auth } = usePage().props;
    const admin = auth?.admin;

    // If not authenticated, return fallback
    if (!admin) {
        return fallback;
    }

    // Check permission
    if (permission && !admin.permissions?.includes(permission)) {
        return fallback;
    }

    // Check role
    if (role && !admin.roles?.includes(role)) {
        return fallback;
    }

    // If all checks pass, render children
    return children;
}

