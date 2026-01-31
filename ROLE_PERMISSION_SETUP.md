# 🚀 Role-Based Permission System Setup Guide

## ✅ What Has Been Created

### 1. **RolePermissionSeeder** (`database/seeders/RolePermissionSeeder.php`)
- ✅ Complete seeder with all permissions
- ✅ Creates 5 roles: superadmin, admin, manager, editor, viewer
- ✅ Consistent permission naming (resource.action)
- ✅ Creates initial superadmin user
- ✅ Includes audit log permissions

### 2. **Updated Admin Model** (`app/Models/Admin.php`)
- ✅ Added Spatie HasRoles trait
- ✅ Added guard_name property
- ✅ Added username and status to fillable

---

## 📋 Installation Steps

### Step 1: Install Spatie Permission Package

```bash
composer require spatie/laravel-permission
```

### Step 2: Publish Configuration and Migrations

```bash
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

This will create:
- `config/permission.php` - Configuration file
- Migration files for roles and permissions tables

### Step 3: Update Permission Configuration

Edit `config/permission.php` and ensure the admin guard is configured:

```php
'guards' => ['web', 'admin'],
```

### Step 4: Create Admin Migration (if not exists)

Create migration for admins table with required fields:

```bash
php artisan make:migration add_username_and_status_to_admins_table
```

Add these fields to the migration:

```php
public function up()
{
    Schema::table('admins', function (Blueprint $table) {
        $table->string('username')->unique()->after('name');
        $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('password');
    });
}

public function down()
{
    Schema::table('admins', function (Blueprint $table) {
        $table->dropColumn(['username', 'status']);
    });
}
```

### Step 5: Run Migrations

```bash
php artisan migrate
```

This will create:
- `roles` table
- `permissions` table
- `model_has_roles` table
- `model_has_permissions` table
- `role_has_permissions` table
- Update `admins` table with username and status

### Step 6: Run the Seeder

```bash
php artisan db:seed --class=RolePermissionSeeder
```

Or add to `DatabaseSeeder.php`:

```php
public function run()
{
    $this->call([
        RolePermissionSeeder::class,
    ]);
}
```

Then run:

```bash
php artisan db:seed
```

### Step 7: Clear Cache

```bash
php artisan cache:clear
php artisan config:clear
php artisan permission:cache-reset
```

---

## 🎯 What You Get

### **5 Roles Created:**

1. **SuperAdmin** - Full access to everything
2. **Admin** - Most access except role/permission management
3. **Manager** - User, event, volunteer management
4. **Editor** - Content management (events, forms, certificates)
5. **Viewer** - Read-only access

### **Initial SuperAdmin User:**

```
Email:    superadmin@buits.com
Username: superadmin
Password: password
Status:   active
```

⚠️ **IMPORTANT:** Change the password in production!

### **All Permissions Created:**

```
Dashboard:
- dashboard.view

Role Management:
- role.view, role.create, role.edit, role.delete, role.assign-permissions

Permission Management:
- permission.view, permission.create, permission.edit, permission.delete

Admin Management:
- admin.view, admin.create, admin.edit, admin.delete
- admin.assign-role, admin.change-status

User Management:
- user.view, user.create, user.edit, user.delete, user.approve

Form Management:
- form.view, form.create, form.edit, form.delete

Event Management:
- event.view, event.create, event.edit, event.delete

Volunteer Management:
- volunteer.view, volunteer.approve

Certificate Management:
- certificate.view, certificate.create, certificate.edit, certificate.delete

Email Management:
- email.view, email.create

Settings:
- settings.view, settings.edit

Audit Logs:
- audit-log.view, audit-log.export
```

---

## 🔧 Next Steps

### 1. Update `config/auth.php`

Add admin guard if not exists:

```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],
    'admin' => [
        'driver' => 'session',
        'provider' => 'admins',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],
    'admins' => [
        'driver' => 'eloquent',
        'model' => App\Models\Admin::class,
    ],
],
```

### 2. Create Middleware

Create `app/Http/Middleware/EnsureAdminHasPermission.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdminHasPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        if (!auth('admin')->check() || !auth('admin')->user()->hasPermissionTo($permission)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
```

Register in `bootstrap/app.php` or `app/Http/Kernel.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'permission' => \App\Http\Middleware\EnsureAdminHasPermission::class,
    ]);
})
```

### 3. Share Permissions with Inertia

Update `app/Http/Middleware/HandleInertiaRequests.php`:

```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'admin' => auth('admin')->check()
                ? [
                    'id' => auth('admin')->id(),
                    'name' => auth('admin')->user()->name,
                    'email' => auth('admin')->user()->email,
                    'username' => auth('admin')->user()->username,
                    'status' => auth('admin')->user()->status,
                    'roles' => auth('admin')->user()->getRoleNames(),
                    'permissions' => auth('admin')->user()->getAllPermissions()->pluck('name'),
                    'isSuperAdmin' => auth('admin')->user()->hasRole('superadmin'),
                ]
                : null,
        ],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
    ]);
}
```

### 4. Create React Permission Components

Create `resources/js/Components/Auth/Can.jsx`:

```jsx
import { usePage } from '@inertiajs/react';

export default function Can({ permission, role, children, fallback = null }) {
    const { auth } = usePage().props;
    const admin = auth?.admin;

    if (!admin) return fallback;

    // Check permission
    if (permission && !admin.permissions?.includes(permission)) {
        return fallback;
    }

    // Check role
    if (role && !admin.roles?.includes(role)) {
        return fallback;
    }

    return children;
}
```

Create `resources/js/Hooks/usePermission.js`:

```javascript
import { usePage } from '@inertiajs/react';

export function usePermission() {
    const { auth } = usePage().props;
    const admin = auth?.admin;

    const can = (permission) => {
        return admin?.permissions?.includes(permission) || false;
    };

    const hasRole = (role) => {
        return admin?.roles?.includes(role) || false;
    };

    const isSuperAdmin = () => {
        return admin?.isSuperAdmin || false;
    };

    return { can, hasRole, isSuperAdmin, admin };
}
```

---

## 🎨 Usage Examples

### Backend (Controllers)

```php
// Check permission
if (auth('admin')->user()->can('role.create')) {
    // Allow action
}

// Check role
if (auth('admin')->user()->hasRole('superadmin')) {
    // Allow action
}

// Using middleware in routes
Route::middleware(['auth:admin', 'permission:role.view'])->group(function () {
    Route::get('/roles', [RoleController::class, 'index']);
});
```

### Frontend (React)

```jsx
import Can from '@/Components/Auth/Can';
import { usePermission } from '@/Hooks/usePermission';

export default function AdminDashboard() {
    const { can, hasRole, isSuperAdmin } = usePermission();

    return (
        <div>
            {/* Using Can component */}
            <Can permission="role.view">
                <Link href="/admin/roles">Manage Roles</Link>
            </Can>

            {/* Using hook */}
            {can('user.create') && (
                <button>Create User</button>
            )}

            {/* Check role */}
            {hasRole('superadmin') && (
                <div>SuperAdmin Panel</div>
            )}

            {/* Check if superadmin */}
            {isSuperAdmin() && (
                <div>Only SuperAdmin sees this</div>
            )}
        </div>
    );
}
```

---

## 🧪 Testing

### Test Login

```bash
# Login as superadmin
Email: superadmin@buits.com
Password: password
```

### Test Permissions

```php
// In tinker
php artisan tinker

$admin = App\Models\Admin::first();
$admin->getAllPermissions(); // See all permissions
$admin->getRoleNames(); // See all roles
$admin->hasPermissionTo('role.create'); // true
$admin->hasRole('superadmin'); // true
```

---

## 📊 Database Structure

After running migrations and seeder, you'll have:

```
admins
├── id
├── name
├── username (NEW)
├── email
├── password
├── status (NEW: active/inactive/suspended)
└── timestamps

roles
├── id
├── name
├── guard_name
└── timestamps

permissions
├── id
├── name
├── group_name
├── guard_name
└── timestamps

model_has_roles (pivot)
├── role_id
├── model_type
└── model_id

model_has_permissions (pivot)
├── permission_id
├── model_type
└── model_id

role_has_permissions (pivot)
├── permission_id
└── role_id
```

---

## ✅ Verification Checklist

- [ ] Spatie Permission package installed
- [ ] Migrations run successfully
- [ ] Seeder run successfully
- [ ] SuperAdmin user created
- [ ] Can login as superadmin
- [ ] Admin guard configured
- [ ] Middleware registered
- [ ] Inertia sharing permissions
- [ ] React components created
- [ ] Permissions working in backend
- [ ] Permissions working in frontend

---

## 🔒 Security Notes

1. **Change default password** in production
2. **Use HTTPS** in production
3. **Enable rate limiting** on login routes
4. **Log all admin actions** (implement audit logging)
5. **Regular permission audits**
6. **Two-factor authentication** (optional but recommended)

---

## 🐛 Troubleshooting

### Issue: "Class 'Spatie\Permission\Models\Role' not found"
**Solution:** Run `composer require spatie/laravel-permission`

### Issue: "Table 'roles' doesn't exist"
**Solution:** Run `php artisan migrate`

### Issue: "Permissions not working"
**Solution:** Run `php artisan permission:cache-reset`

### Issue: "Admin model doesn't have username field"
**Solution:** Create and run the migration to add username and status fields

---

## 📚 Resources

- [Spatie Permission Documentation](https://spatie.be/docs/laravel-permission)
- [Laravel Authentication](https://laravel.com/docs/authentication)
- [Inertia.js Documentation](https://inertiajs.com/)

---

## 🎉 You're All Set!

Your role-based permission system is now ready to use. You have:

✅ 5 pre-configured roles
✅ 40+ permissions across 12 resource groups
✅ Initial superadmin account
✅ Backend and frontend protection
✅ Clean, maintainable architecture

**Next:** Start building your admin controllers and pages! 🚀

