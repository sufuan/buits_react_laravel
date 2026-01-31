import { usePage } from '@inertiajs/react';

/**
 * usePermission Hook - Permission checking utilities
 * 
 * Usage:
 * const { can, hasRole, isSuperAdmin, admin } = usePermission();
 * 
 * if (can('role.create')) {
 *   // Show create button
 * }
 * 
 * if (hasRole('manager')) {
 *   // Show manager content
 * }
 * 
 * if (isSuperAdmin()) {
 *   // Show superadmin content
 * }
 */
export function usePermission() {
    const { auth } = usePage().props;
    const admin = auth?.admin;

    /**
     * Check if admin has a specific permission
     * @param {string} permission - Permission name (e.g., 'role.create')
     * @returns {boolean}
     */
    const can = (permission) => {
        if (!admin) return false;
        return admin.permissions?.includes(permission) || false;
    };

    /**
     * Check if admin has a specific role
     * @param {string} role - Role name (e.g., 'superadmin')
     * @returns {boolean}
     */
    const hasRole = (role) => {
        if (!admin) return false;
        return admin.roles?.includes(role) || false;
    };

    /**
     * Check if admin is superadmin
     * @returns {boolean}
     */
    const isSuperAdmin = () => {
        if (!admin) return false;
        return admin.isSuperAdmin || false;
    };

    /**
     * Check if admin has any of the given permissions
     * @param {string[]} permissions - Array of permission names
     * @returns {boolean}
     */
    const canAny = (permissions) => {
        if (!admin) return false;
        return permissions.some(permission => admin.permissions?.includes(permission));
    };

    /**
     * Check if admin has all of the given permissions
     * @param {string[]} permissions - Array of permission names
     * @returns {boolean}
     */
    const canAll = (permissions) => {
        if (!admin) return false;
        return permissions.every(permission => admin.permissions?.includes(permission));
    };

    /**
     * Check if admin has any of the given roles
     * @param {string[]} roles - Array of role names
     * @returns {boolean}
     */
    const hasAnyRole = (roles) => {
        if (!admin) return false;
        return roles.some(role => admin.roles?.includes(role));
    };

    /**
     * Check if admin has all of the given roles
     * @param {string[]} roles - Array of role names
     * @returns {boolean}
     */
    const hasAllRoles = (roles) => {
        if (!admin) return false;
        return roles.every(role => admin.roles?.includes(role));
    };

    return {
        can,
        hasRole,
        isSuperAdmin,
        canAny,
        canAll,
        hasAnyRole,
        hasAllRoles,
        admin,
    };
}

