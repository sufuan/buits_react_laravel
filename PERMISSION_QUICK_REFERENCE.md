# 🚀 Permission System - Quick Reference Guide

## 📋 Available Permissions

### Dashboard
```
dashboard.view
```

### Role Management
```
role.view
role.create
role.edit
role.delete
role.assign-permissions
```

### Permission Management
```
permission.view
permission.create
permission.edit
permission.delete
```

### Admin Management
```
admin.view
admin.create
admin.edit
admin.delete
admin.assign-role
admin.change-status
```

### User Management
```
user.view
user.create
user.edit
user.delete
user.approve
```

### Form Management
```
form.view
form.create
form.edit
form.delete
```

### Event Management
```
event.view
event.create
event.edit
event.delete
```

### Volunteer Management
```
volunteer.view
volunteer.approve
```

### Certificate Management
```
certificate.view
certificate.create
certificate.edit
certificate.delete
```

### Email Management
```
email.view
email.create
```

### Settings
```
settings.view
settings.edit
```

### Audit Logs
```
audit-log.view
audit-log.export
```

---

## 👥 Available Roles

### SuperAdmin
- Has ALL permissions
- Can manage roles and permissions
- Can manage all admins

### Admin
- Has most permissions
- Cannot manage roles/permissions
- Cannot delete admins

### Manager
- Can manage users, events, volunteers
- Can approve users and volunteers
- Can view certificates

### Editor
- Can manage content (events, forms, certificates)
- Can create and edit content
- Cannot delete major resources

### Viewer
- Read-only access
- Can view all resources
- Cannot create, edit, or delete

---

## 💻 Backend Usage

### In Controllers

```php
// Check permission
if (auth('admin')->user()->can('role.create')) {
    // Allow action
}

// Check role
if (auth('admin')->user()->hasRole('superadmin')) {
    // Allow action
}

// Check multiple permissions
if (auth('admin')->user()->hasAnyPermission(['role.create', 'role.edit'])) {
    // Allow action
}

// Check all permissions
if (auth('admin')->user()->hasAllPermissions(['role.create', 'role.edit'])) {
    // Allow action
}
```

### In Routes

```php
// Single permission
Route::middleware(['auth:admin', 'permission:role.view'])
    ->get('/roles', [RoleController::class, 'index']);

// Single role
Route::middleware(['auth:admin', 'role:superadmin'])
    ->get('/settings', [SettingController::class, 'index']);

// Multiple permissions (any)
Route::middleware(['auth:admin', 'permission:role.create|role.edit'])
    ->post('/roles', [RoleController::class, 'store']);

// Group with permission
Route::middleware(['auth:admin'])->group(function () {
    Route::middleware('permission:role.view')->group(function () {
        Route::get('/roles', [RoleController::class, 'index']);
        Route::get('/roles/{role}', [RoleController::class, 'show']);
    });
    
    Route::middleware('permission:role.create')->group(function () {
        Route::post('/roles', [RoleController::class, 'store']);
    });
});
```

### In Blade/Inertia Controllers

```php
// Pass permissions to view
return Inertia::render('Admin/Dashboard', [
    'canCreateRole' => auth('admin')->user()->can('role.create'),
    'isSuperAdmin' => auth('admin')->user()->hasRole('superadmin'),
]);
```

---

## ⚛️ Frontend Usage (React)

### Using Can Component

```jsx
import Can from '@/Components/Auth/Can';

export default function AdminPanel() {
    return (
        <div>
            {/* Check permission */}
            <Can permission="role.view">
                <Link href="/admin/roles">Manage Roles</Link>
            </Can>

            {/* Check role */}
            <Can role="superadmin">
                <div>SuperAdmin Panel</div>
            </Can>

            {/* With fallback */}
            <Can permission="user.create" fallback={<div>No access</div>}>
                <button>Create User</button>
            </Can>
        </div>
    );
}
```

### Using usePermission Hook

```jsx
import { usePermission } from '@/Hooks/usePermission';

export default function Dashboard() {
    const { can, hasRole, isSuperAdmin, canAny, canAll } = usePermission();

    return (
        <div>
            {/* Check single permission */}
            {can('role.create') && (
                <button>Create Role</button>
            )}

            {/* Check single role */}
            {hasRole('manager') && (
                <div>Manager Dashboard</div>
            )}

            {/* Check if superadmin */}
            {isSuperAdmin() && (
                <div>SuperAdmin Controls</div>
            )}

            {/* Check any permission */}
            {canAny(['role.create', 'role.edit']) && (
                <button>Manage Roles</button>
            )}

            {/* Check all permissions */}
            {canAll(['role.view', 'role.create']) && (
                <button>Full Role Access</button>
            )}
        </div>
    );
}
```

### Conditional Rendering

```jsx
const { can, hasRole } = usePermission();

// Show/hide buttons
const showCreateButton = can('user.create');
const showDeleteButton = can('user.delete') && hasRole('superadmin');

// Disable buttons
<button disabled={!can('user.edit')}>Edit User</button>

// Conditional classes
<div className={can('role.view') ? 'visible' : 'hidden'}>
    Role Management
</div>
```

---

## 🔍 Common Patterns

### CRUD Operations

```php
// Backend Routes
Route::middleware(['auth:admin'])->group(function () {
    // List - requires view permission
    Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:user.view');
    
    // Create - requires create permission
    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:user.create');
    
    // Update - requires edit permission
    Route::put('/users/{user}', [UserController::class, 'update'])
        ->middleware('permission:user.edit');
    
    // Delete - requires delete permission
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->middleware('permission:user.delete');
});
```

```jsx
// Frontend Component
import Can from '@/Components/Auth/Can';

export default function UserList({ users }) {
    return (
        <div>
            <Can permission="user.create">
                <button>Create User</button>
            </Can>

            {users.map(user => (
                <div key={user.id}>
                    <span>{user.name}</span>
                    
                    <Can permission="user.edit">
                        <button>Edit</button>
                    </Can>
                    
                    <Can permission="user.delete">
                        <button>Delete</button>
                    </Can>
                </div>
            ))}
        </div>
    );
}
```

---

## 🎯 Best Practices

1. **Always check permissions on both backend and frontend**
   - Backend: Security
   - Frontend: UX

2. **Use specific permissions, not roles**
   ```php
   // ✅ Good
   if (auth('admin')->user()->can('user.create'))
   
   // ❌ Bad
   if (auth('admin')->user()->hasRole('admin'))
   ```

3. **Group related permissions**
   ```php
   Route::middleware(['auth:admin', 'permission:user.view'])->group(function () {
       // All user-related routes
   });
   ```

4. **Use descriptive permission names**
   ```
   ✅ user.approve
   ❌ approve
   ```

5. **Cache permission checks in loops**
   ```jsx
   const canEdit = can('user.edit');
   
   users.map(user => (
       canEdit && <button>Edit</button>
   ))
   ```

---

## 🐛 Debugging

### Check admin permissions in tinker

```php
php artisan tinker

$admin = App\Models\Admin::find(1);
$admin->getAllPermissions()->pluck('name'); // All permissions
$admin->getRoleNames(); // All roles
$admin->hasPermissionTo('role.create'); // true/false
$admin->hasRole('superadmin'); // true/false
```

### Clear permission cache

```bash
php artisan permission:cache-reset
```

### Check shared data in React

```jsx
import { usePage } from '@inertiajs/react';

const { auth } = usePage().props;
console.log(auth.admin.permissions); // Array of permissions
console.log(auth.admin.roles); // Array of roles
```

---

## 📞 Quick Commands

```bash
# Clear permission cache
php artisan permission:cache-reset

# Run seeder
php artisan db:seed --class=RolePermissionSeeder

# Create new permission
php artisan tinker
Permission::create(['name' => 'new.permission', 'guard_name' => 'admin']);

# Assign permission to role
$role = Role::findByName('admin', 'admin');
$role->givePermissionTo('new.permission');

# Assign role to admin
$admin = Admin::find(1);
$admin->assignRole('manager');
```

