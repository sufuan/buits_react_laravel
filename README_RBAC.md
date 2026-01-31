# 🎉 Role-Based Access Control (RBAC) System - Complete Package

## 📦 What's Included

This package provides a **production-ready** Role-Based Access Control system for Laravel + Inertia + React applications.

### ✅ All Files Created

1. **Database Seeder** - `database/seeders/RolePermissionSeeder.php`
2. **Migration** - `database/migrations/2025_11_30_191510_add_username_and_status_to_admins_table.php`
3. **Middleware (2)** - Permission & Role checking
4. **React Component** - `Can.jsx` for permission-based rendering
5. **React Hook** - `usePermission.js` for permission utilities
6. **Documentation (4)** - Complete setup and reference guides

### 📚 Documentation Files

1. **ROLE_PERMISSION_SETUP.md** - Complete installation guide
2. **IMPLEMENTATION_SUMMARY.md** - What was created and why
3. **PERMISSION_QUICK_REFERENCE.md** - Quick usage examples
4. **ARCHITECTURE_OVERVIEW.md** - System architecture diagrams

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Spatie Permission
```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

### Step 2: Update Config
Edit `config/permission.php`:
```php
'guards' => ['web', 'admin'],
```

### Step 3: Run Migrations
```bash
php artisan migrate
```

### Step 4: Run Seeder
```bash
php artisan db:seed --class=RolePermissionSeeder
```

### Step 5: Register Middleware
Edit `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'permission' => \App\Http\Middleware\EnsureAdminHasPermission::class,
        'role' => \App\Http\Middleware\EnsureAdminHasRole::class,
    ]);
})
```

### Step 6: Share Permissions with Inertia
Edit `app/Http/Middleware/HandleInertiaRequests.php`:
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
    ]);
}
```

### Step 7: Login
```
Email: superadmin@buits.com
Password: password
```

**⚠️ Change password in production!**

---

## 🎯 What You Get

### 5 Pre-Configured Roles
- **SuperAdmin** - Full access
- **Admin** - Most access (no role/permission management)
- **Manager** - User, event, volunteer management
- **Editor** - Content management
- **Viewer** - Read-only access

### 40+ Permissions
Organized into 12 groups:
- Dashboard (1)
- Role Management (5)
- Permission Management (4)
- Admin Management (6)
- User Management (5)
- Form Management (4)
- Event Management (4)
- Volunteer Management (2)
- Certificate Management (4)
- Email Management (2)
- Settings (2)
- Audit Logs (2)

### Initial SuperAdmin Account
```
Email:    superadmin@buits.com
Username: superadmin
Password: password
Status:   active
```

---

## 💻 Usage Examples

### Backend (Laravel)

#### In Routes
```php
Route::middleware(['auth:admin', 'permission:role.view'])
    ->get('/roles', [RoleController::class, 'index']);
```

#### In Controllers
```php
if (auth('admin')->user()->can('role.create')) {
    // Allow action
}
```

### Frontend (React)

#### Using Can Component
```jsx
import Can from '@/Components/Auth/Can';

<Can permission="role.view">
    <Link href="/admin/roles">Manage Roles</Link>
</Can>
```

#### Using usePermission Hook
```jsx
import { usePermission } from '@/Hooks/usePermission';

const { can, hasRole, isSuperAdmin } = usePermission();

{can('role.create') && <button>Create Role</button>}
```

---

## 📖 Documentation

### For Setup
👉 **ROLE_PERMISSION_SETUP.md** - Complete installation guide with troubleshooting

### For Development
👉 **PERMISSION_QUICK_REFERENCE.md** - Quick usage examples for backend & frontend

### For Understanding
👉 **ARCHITECTURE_OVERVIEW.md** - System architecture and design principles

### For Summary
👉 **IMPLEMENTATION_SUMMARY.md** - What was created and why

---

## 🔧 Common Tasks

### Add New Permission
```bash
php artisan tinker
Permission::create(['name' => 'new.permission', 'guard_name' => 'admin', 'group_name' => 'Group Name']);
```

### Assign Permission to Role
```php
$role = Role::findByName('admin', 'admin');
$role->givePermissionTo('new.permission');
```

### Assign Role to Admin
```php
$admin = Admin::find(1);
$admin->assignRole('manager');
```

### Clear Permission Cache
```bash
php artisan permission:cache-reset
```

---

## 🐛 Troubleshooting

### Issue: "Class 'Spatie\Permission\Models\Role' not found"
**Solution:** `composer require spatie/laravel-permission`

### Issue: "Table 'roles' doesn't exist"
**Solution:** `php artisan migrate`

### Issue: "Permissions not working"
**Solution:** `php artisan permission:cache-reset`

---

## ✅ Features

- ✅ Multiple roles with hierarchical permissions
- ✅ Consistent permission naming (resource.action)
- ✅ Backend security (middleware)
- ✅ Frontend UX (React components)
- ✅ Initial superadmin creation
- ✅ Permission caching
- ✅ Duplicate prevention
- ✅ Console feedback
- ✅ Complete documentation
- ✅ Production-ready

---

## 🎨 Architecture Highlights

### Defense in Depth
- **Frontend:** Hide UI elements (UX)
- **Backend:** Middleware + controller checks (Security)

### Separation of Concerns
- **Permissions:** What you can do
- **Roles:** Collection of permissions
- **Guards:** Separate auth contexts

### Scalability
- Easy to add new permissions
- Easy to create new roles
- Easy to assign permissions

---

## 📊 Files Created/Modified

### Created (7 files)
1. `database/seeders/RolePermissionSeeder.php`
2. `database/migrations/2025_11_30_191510_add_username_and_status_to_admins_table.php`
3. `app/Http/Middleware/EnsureAdminHasPermission.php`
4. `app/Http/Middleware/EnsureAdminHasRole.php`
5. `resources/js/Components/Auth/Can.jsx`
6. `resources/js/Hooks/usePermission.js`
7. Documentation files (4)

### Modified (1 file)
1. `app/Models/Admin.php` - Added HasRoles trait

---

## 🚀 Next Steps

1. ✅ Follow Quick Start guide above
2. ✅ Test login with superadmin
3. ✅ Create your first role-protected route
4. ✅ Use Can component in React
5. ✅ Build your admin panel

---

## 📞 Support

For detailed information, refer to:
- **Setup:** ROLE_PERMISSION_SETUP.md
- **Usage:** PERMISSION_QUICK_REFERENCE.md
- **Architecture:** ARCHITECTURE_OVERVIEW.md

---

## 🎉 You're Ready!

Everything is set up and ready to use. Just follow the Quick Start guide and you'll have a fully functional RBAC system in 5 minutes!

**Happy Coding! 🚀**

