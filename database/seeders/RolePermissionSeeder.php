<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * Class RolePermissionSeeder
 *
 * Seeds roles, permissions, and initial superadmin for admin guard
 *
 * ✅ Features:
 * - Creates all permissions with consistent naming (resource.action)
 * - Creates multiple roles (superadmin, admin, manager, editor, viewer)
 * - Assigns appropriate permissions to each role
 * - Creates initial superadmin user
 * - Clears permission cache
 * - Prevents duplicate entries
 *
 * @see https://spatie.be/docs/laravel-permission/v5/basic-usage/multiple-guards
 */
class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all permissions grouped by resource
        $permissions = [
            [
                'group_name' => 'Dashboard',
                'permissions' => [
                    'dashboard.view',
                ]
            ],
            [
                'group_name' => 'Role Management',
                'permissions' => [
                    'role.view',
                    'role.create',
                    'role.edit',
                    'role.delete',
                    'role.assign-permissions',
                ]
            ],
            [
                'group_name' => 'Permission Management',
                'permissions' => [
                    'permission.view',
                    'permission.create',
                    'permission.edit',
                    'permission.delete',
                ]
            ],
            [
                'group_name' => 'Admin Management',
                'permissions' => [
                    'admin.view',
                    'admin.create',
                    'admin.edit',
                    'admin.delete',
                    'admin.assign-role',
                    'admin.change-status',
                ]
            ],
            [
                'group_name' => 'User Management',
                'permissions' => [
                    'user.view',
                    'user.create',
                    'user.edit',
                    'user.delete',
                    'user.approve',
                ]
            ],
            [
                'group_name' => 'Form Management',
                'permissions' => [
                    'form.view',
                    'form.create',
                    'form.edit',
                    'form.delete',
                ]
            ],
            [
                'group_name' => 'Event Management',
                'permissions' => [
                    'event.view',
                    'event.create',
                    'event.edit',
                    'event.delete',
                ]
            ],
            [
                'group_name' => 'Volunteer Management',
                'permissions' => [
                    'volunteer.view',
                    'volunteer.approve',
                ]
            ],
            [
                'group_name' => 'Certificate Management',
                'permissions' => [
                    'certificate.view',
                    'certificate.create',
                    'certificate.edit',
                    'certificate.delete',
                ]
            ],
            [
                'group_name' => 'Email Management',
                'permissions' => [
                    'email.view',
                    'email.create',
                ]
            ],
            [
                'group_name' => 'Settings',
                'permissions' => [
                    'settings.view',
                    'settings.edit',
                ]
            ],
            [
                'group_name' => 'Audit Logs',
                'permissions' => [
                    'audit-log.view',
                    'audit-log.export',
                ]
            ],
        ];

        // Create all permissions
        $this->createPermissions($permissions);

        // Create roles with specific permissions
        $this->createRoles($permissions);

        // Create initial superadmin user
        $this->createSuperAdmin();
    }

    /**
     * Create all permissions for admin guard
     *
     * @param array $permissions
     * @return void
     */
    private function createPermissions(array $permissions): void
    {
        $this->command->info('Creating permissions...');

        foreach ($permissions as $group) {
            foreach ($group['permissions'] as $permissionName) {
                Permission::firstOrCreate([
                    'name' => $permissionName,
                    'guard_name' => 'admin',
                ]);
            }
        }

        $this->command->info('✓ Permissions created successfully');
    }

    /**
     * Create roles and assign permissions
     *
     * @param array $permissions
     * @return void
     */
    private function createRoles(array $permissions): void
    {
        $this->command->info('Creating roles...');

        // 1. SuperAdmin - Has ALL permissions
        $superAdmin = Role::firstOrCreate(
            ['name' => 'superadmin', 'guard_name' => 'admin']
        );
        $superAdmin->syncPermissions(Permission::where('guard_name', 'admin')->get());
        $this->command->info('✓ SuperAdmin role created with all permissions');

        // 2. Admin - Has most permissions except role/permission management
        $admin = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'admin']
        );
        $adminPermissions = Permission::where('guard_name', 'admin')
            ->where('name', 'not like', 'role.%')
            ->where('name', 'not like', 'permission.%')
            ->where('name', '!=', 'admin.delete')
            ->get();
        $admin->syncPermissions($adminPermissions);
        $this->command->info('✓ Admin role created');

        // 3. Manager - Can manage users, events, volunteers
        $manager = Role::firstOrCreate(
            ['name' => 'manager', 'guard_name' => 'admin']
        );
        $managerPermissions = [
            'dashboard.view',
            'user.view', 'user.edit', 'user.approve',
            'event.view', 'event.create', 'event.edit', 'event.delete',
            'volunteer.view', 'volunteer.approve',
            'form.view', 'form.create', 'form.edit',
            'certificate.view',
        ];
        $manager->syncPermissions($managerPermissions);
        $this->command->info('✓ Manager role created');

        // 4. Editor - Can manage content (events, forms, certificates)
        $editor = Role::firstOrCreate(
            ['name' => 'editor', 'guard_name' => 'admin']
        );
        $editorPermissions = [
            'dashboard.view',
            'event.view', 'event.create', 'event.edit',
            'form.view', 'form.create', 'form.edit',
            'certificate.view', 'certificate.create', 'certificate.edit',
            'email.view', 'email.create',
        ];
        $editor->syncPermissions($editorPermissions);
        $this->command->info('✓ Editor role created');

        // 5. Viewer - Read-only access
        $viewer = Role::firstOrCreate(
            ['name' => 'viewer', 'guard_name' => 'admin']
        );
        $viewerPermissions = Permission::where('guard_name', 'admin')
            ->where('name', 'like', '%.view')
            ->pluck('name')
            ->toArray();
        $viewer->syncPermissions($viewerPermissions);
        $this->command->info('✓ Viewer role created');
    }

    /**
     * Create initial superadmin user
     *
     * @return void
     */
    private function createSuperAdmin(): void
    {
        $this->command->info('Creating superadmin user...');

        $superAdmin = Admin::firstOrCreate(
            ['email' => 'superadmin@buits.com'],
            [
                'name' => 'Super Admin',
                'username' => 'superadmin',
                'password' => Hash::make('password'), // Change in production!
                'status' => 'active',
            ]
        );

        // Assign superadmin role
        if (!$superAdmin->hasRole('superadmin')) {
            $superAdmin->assignRole('superadmin');
        }

        $this->command->info('✓ SuperAdmin user created');
        $this->command->line('');
        $this->command->line('===========================================');
        $this->command->line('  SuperAdmin Credentials');
        $this->command->line('===========================================');
        $this->command->line('  Email:    superadmin@buits.com');
        $this->command->line('  Username: superadmin');
        $this->command->line('  Password: password');
        $this->command->line('===========================================');
        $this->command->warn('⚠  CHANGE PASSWORD IN PRODUCTION!');
        $this->command->line('');
    }
}

