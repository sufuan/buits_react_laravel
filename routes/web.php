<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;

// Admin Controllers
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Admin\UserApprovalController;
use App\Http\Controllers\Admin\UserController;

// Certificate Module Controllers
use App\Http\Controllers\Admin\Certificates\CertificateTypeController;
use App\Http\Controllers\Admin\Certificates\CertificateTemplateController;
use App\Http\Controllers\Admin\Certificates\CertificateSettingController;
use App\Http\Controllers\Admin\Certificates\GenerateCertificateController;
use App\Http\Controllers\Admin\Certificates\CertificateController;
use App\Http\Controllers\MuseumController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Certificate verification route (public)
Route::get('/certificate/verify', function () {
    return Inertia::render('Certificate/Verify');
})->name('certificate.verify');

// Public navigation routes
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/events', [App\Http\Controllers\EventController::class, 'index'])->name('events');
Route::get('/events/{event}', [App\Http\Controllers\EventController::class, 'show'])->name('events.show');

Route::get('/previous-committee', [App\Http\Controllers\PreviousCommitteeController::class, 'index'])->name('previous-committee');
Route::get('/previous-committee/{committee}', [App\Http\Controllers\PreviousCommitteeController::class, 'show'])->name('previous-committee.show');
Route::get('/previous-committee/data/{committee}', [App\Http\Controllers\PreviousCommitteeController::class, 'getCommitteeData'])->name('previous-committee.data');

// Public committee pages
Route::get('/committees', [App\Http\Controllers\PublicCommitteeController::class, 'index'])->name('committees');

// Public Member Profile (Dummy Route for QR Codes)
Route::get('/p/{member_id}', [App\Http\Controllers\PublicProfileController::class, 'show'])->name('public.profile');

// API routes for committee data
Route::get('/api/committees', [App\Http\Controllers\PreviousCommitteeController::class, 'getCommitteeData'])->name('api.committees');
Route::get('/api/committees/{committee}', [App\Http\Controllers\PreviousCommitteeController::class, 'getCommitteeData'])->name('api.committee');

Route::get('/find-member', function () {
    return Inertia::render('FindMember');
})->name('find-member');



Route::get('/museum', [MuseumController::class, 'index'])->name('museum.index');


// Test route for certificate generation
Route::get('/test-certificate-generate', function () {
    $controller = new App\Http\Controllers\Admin\Certificates\GenerateCertificateController();
    return $controller->index();
})->middleware(['auth:admin']);

Route::get('/dashboard', function () {
    return Inertia::render('User/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Volunteer Application Routes
    Route::get('/volunteer-application/create', [App\Http\Controllers\VolunteerApplicationController::class, 'create'])->name('volunteer-application.create');
    Route::post('/volunteer-application', [App\Http\Controllers\VolunteerApplicationController::class, 'store'])->name('volunteer-application.store');
    
    // Executive Application Routes
    Route::get('/executive-application/create', [App\Http\Controllers\ExecutiveApplicationController::class, 'create'])->name('executive-application.create');
    Route::post('/executive-application', [App\Http\Controllers\ExecutiveApplicationController::class, 'store'])->name('executive-application.store');
});



require __DIR__ . '/auth.php';

use App\Models\ExecutiveApplication;
use App\Models\PendingUser;
use App\Models\VolunteerApplication;

Route::prefix('admin')->name('admin.')->group(function () {

    // Admin Guest Routes (e.g. Login)
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    // Admin Authenticated Routes
    Route::middleware('admin')->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard', [
                'pendingUsersCount' => PendingUser::count(),
                'pendingVolunteerApplications' => VolunteerApplication::where('status', 'pending')->count(),
                'pendingExecutiveApplications' => ExecutiveApplication::where('status', 'pending')->count(),
                'upcomingEventsCount' => \App\Models\Event::upcoming()->count(),
            ]);
        })->name('dashboard');

        // ================= User Management =================
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('export', [UserController::class, 'export'])->name('export');
            Route::get('template', [UserController::class, 'template'])->name('template');
            Route::post('import', [UserController::class, 'import'])->name('import');

            // Advanced Import Routes
            Route::post('import/preview', [UserController::class, 'preview'])->name('import.preview');
            Route::post('import/validate-row', [UserController::class, 'validateRow'])->name('import.validate-row');
            Route::post('import/batch', [UserController::class, 'importBatch'])->name('import.batch');
            Route::get('import/status', [UserController::class, 'getImportSession'])->name('import.status');
            Route::post('import/clear-session', [UserController::class, 'clearImportSession'])->name('import.clear-session');
            Route::get('import/validation-metadata', [UserController::class, 'getValidationMetadata'])->name('import.validation-metadata');

            // Import Wizard Page
            Route::get('import-wizard', [UserController::class, 'showImport'])->name('import-wizard');

            // User Approval Routes (must come before {user} routes)
            Route::get('all', [UserApprovalController::class, 'allUsers'])->name('all');
            Route::get('pending', [UserApprovalController::class, 'index'])->name('pending');
            Route::post('{id}/approve', [UserApprovalController::class, 'approve'])->name('approve');
            Route::delete('{id}/reject', [UserApprovalController::class, 'reject'])->name('reject');
            Route::post('bulk-approve', [UserApprovalController::class, 'bulkApprove'])->name('bulk-approve');
            Route::post('bulk-reject', [UserApprovalController::class, 'bulkReject'])->name('bulk-reject');

            // User CRUD Routes (must come after specific routes)
            Route::get('{user}', [UserController::class, 'show'])->name('show');
            Route::get('{user}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('{user}', [UserController::class, 'update'])->name('update');
        });

        // ================= Application Management =================
        Route::prefix('applications')->name('applications.')->group(function () {
            // Volunteer Applications
            Route::prefix('volunteer')->name('volunteer.')->group(function () {
                Route::get('/', [App\Http\Controllers\VolunteerApplicationController::class, 'index'])->name('index');
                Route::get('{application}', [App\Http\Controllers\VolunteerApplicationController::class, 'show'])->name('show');
                Route::patch('{application}', [App\Http\Controllers\VolunteerApplicationController::class, 'update'])->name('update');
                Route::delete('{application}', [App\Http\Controllers\VolunteerApplicationController::class, 'destroy'])->name('destroy');
            });
            
            // Executive Applications
            Route::prefix('executive')->name('executive.')->group(function () {
                Route::get('/', [App\Http\Controllers\ExecutiveApplicationController::class, 'index'])->name('index');
                Route::get('{application}', [App\Http\Controllers\ExecutiveApplicationController::class, 'show'])->name('show');
                Route::patch('{application}', [App\Http\Controllers\ExecutiveApplicationController::class, 'update'])->name('update');
                Route::delete('{application}', [App\Http\Controllers\ExecutiveApplicationController::class, 'destroy'])->name('destroy');
            });
        });

        // ================= User Role Management =================
        Route::prefix('user-role-management')->name('user-role-management.')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\UserRoleManagementController::class, 'index'])->name('index');
            Route::put('{user}/update-role', [App\Http\Controllers\Admin\UserRoleManagementController::class, 'updateRole'])->name('update-role');
            Route::get('{user}/history', [App\Http\Controllers\Admin\UserRoleManagementController::class, 'showHistory'])->name('history');
            Route::get('export/excel', [App\Http\Controllers\Admin\UserRoleManagementController::class, 'exportExcel'])->name('export.excel');
            Route::get('export/csv', [App\Http\Controllers\Admin\UserRoleManagementController::class, 'exportCsv'])->name('export.csv');
        });

        // ================= Settings Management =================
        Route::prefix('settings')->name('settings.')->group(function () {
             Route::get('volunteer', [App\Http\Controllers\Admin\Settings\VolunteerSettingsController::class, 'index'])->name('volunteer');
             Route::post('volunteer', [App\Http\Controllers\Admin\Settings\VolunteerSettingsController::class, 'update'])->name('volunteer.update');
        });

        // ================= Designations Management =================
        Route::resource('designations', App\Http\Controllers\Admin\DesignationController::class, [
            'as' => 'admin'
        ]);

        // ================= Roles & Permissions Management =================
        Route::prefix('roles')->name('roles.')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\RoleController::class, 'index'])->name('index');
            Route::post('/', [App\Http\Controllers\Admin\RoleController::class, 'store'])->name('store');
            Route::put('{role}', [App\Http\Controllers\Admin\RoleController::class, 'update'])->name('update');
            Route::delete('{role}', [App\Http\Controllers\Admin\RoleController::class, 'destroy'])->name('destroy');
            Route::put('{role}/assign-permissions', [App\Http\Controllers\Admin\RoleController::class, 'assignPermissions'])->name('assign-permissions');
        });

        // ================= Admin Management =================
        Route::prefix('admin-management')->name('admin-management.')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\AdminManagementController::class, 'index'])->name('index');
            Route::post('/', [App\Http\Controllers\Admin\AdminManagementController::class, 'store'])->name('store');
            Route::put('{admin}', [App\Http\Controllers\Admin\AdminManagementController::class, 'update'])->name('update');
            Route::delete('{admin}', [App\Http\Controllers\Admin\AdminManagementController::class, 'destroy'])->name('destroy');
            Route::put('{admin}/assign-role', [App\Http\Controllers\Admin\AdminManagementController::class, 'assignRole'])->name('assign-role');
            Route::put('{admin}/change-status', [App\Http\Controllers\Admin\AdminManagementController::class, 'changeStatus'])->name('change-status');
        });

        // ================= Committee Management =================
        // Phase 4 – Routes (Exact Specification)
        
        // Current Committee
        Route::get('/committee/current', [App\Http\Controllers\Admin\CommitteeController::class, 'currentCommittee'])->name('committee.current');
        Route::post('/committee/current/add', [App\Http\Controllers\Admin\CommitteeController::class, 'addMember'])->name('committee.add');
        Route::post('/committee/end-tenure', [App\Http\Controllers\Admin\CommitteeController::class, 'endTenure'])->name('committee.end-tenure');

        // Previous Committees
        Route::get('/committee/previous', [App\Http\Controllers\Admin\CommitteeController::class, 'previous']);
        Route::get('/committee/previous/{number}', [App\Http\Controllers\Admin\CommitteeController::class, 'previousByCommittee']);

        // Additional Helper Routes (for enhanced functionality)
        Route::prefix('committee')->name('committee.')->group(function () {
            Route::delete('current/remove-member/{assignment}', [App\Http\Controllers\Admin\CommitteeController::class, 'removeMember'])->name('current.remove-member');
            Route::patch('current/update-order', [App\Http\Controllers\Admin\CommitteeController::class, 'updateMemberOrder'])->name('current.update-order');
            Route::post('approve-executive', [App\Http\Controllers\Admin\CommitteeController::class, 'approveExecutiveApplication'])->name('approve-executive');
            Route::post('publish', [App\Http\Controllers\Admin\CommitteeController::class, 'publishCommittee'])->name('publish');
            Route::get('stats', [App\Http\Controllers\Admin\CommitteeController::class, 'getCommitteeStats'])->name('stats');
        });

        // ================= Notifications =================
        Route::prefix('notifications')->name('notifications.')->group(function () {
            Route::get('check', [\App\Http\Controllers\Admin\NotificationController::class, 'check'])->name('check');
            Route::post('mark-seen', [\App\Http\Controllers\Admin\NotificationController::class, 'markAsSeen'])->name('mark-seen');
        });

        // ================= Event Management =================
        Route::prefix('events')->name('events.')->group(function () {
            Route::get('/', [App\Http\Controllers\Admin\EventController::class, 'index'])->name('index');
            Route::get('/api', [App\Http\Controllers\Admin\EventController::class, 'getEvents'])->name('api');
            Route::get('/statistics', [App\Http\Controllers\Admin\EventController::class, 'statistics'])->name('statistics');
            Route::post('/', [App\Http\Controllers\Admin\EventController::class, 'store'])->name('store');
            Route::get('/{event}', [App\Http\Controllers\Admin\EventController::class, 'show'])->name('show');
            Route::put('/{event}', [App\Http\Controllers\Admin\EventController::class, 'update'])->name('update');
            Route::delete('/{event}', [App\Http\Controllers\Admin\EventController::class, 'destroy'])->name('destroy');
            Route::patch('/{event}/dates', [App\Http\Controllers\Admin\EventController::class, 'updateDates'])->name('update-dates');
        });

        // ================= Certificate Module =================
        Route::prefix('certificate')->name('certificate.')->group(function () {
            // ----- Certificate Types -----
            Route::prefix('types')->name('types.')->group(function () {
                Route::get('/', [CertificateTypeController::class, 'index'])->name('index');
                Route::get('create', [CertificateTypeController::class, 'create'])->name('create');
                Route::post('/', [CertificateTypeController::class, 'storeOrUpdate'])->name('store');
                Route::get('edit/{id}', [CertificateTypeController::class, 'edit'])->name('edit');
                Route::delete('delete/{id}', [CertificateTypeController::class, 'delete'])->name('delete');
            });

            // ----- Certificate Templates -----
            Route::group(['prefix' => 'templates', 'as' => 'templates.'], function () {
                // List all templates
                Route::get('/', [CertificateTemplateController::class, 'index'])->name('index');

                // Show form to create a new template
                Route::get('create', [CertificateTemplateController::class, 'create'])->name('create');

                // Store or update a template
                Route::post('/', [CertificateTemplateController::class, 'storeOrUpdate'])->name('store');

                // Show form to edit a template
                Route::get('{template}/edit', [CertificateTemplateController::class, 'edit'])->name('edit');

                // Show design page for a template
                Route::get('{template}/design', [CertificateTemplateController::class, 'design'])->name('design');

                // Update design POST
                Route::post('design/update', [CertificateTemplateController::class, 'updateDesign'])->name('design.update');

                // Reset design for a template
               Route::post('{template}/design/reset', [CertificateTemplateController::class, 'designReset'])->name('design.reset');

                // Delete a template
                Route::delete('{template}', [CertificateTemplateController::class, 'delete'])->name('destroy');

                // Fetch template type details (AJAX)
                Route::post('type', [CertificateTemplateController::class, 'templateType'])->name('type');

                // Preview template (AJAX)
                Route::post('preview', [CertificateTemplateController::class, 'preview'])->name('preview');
            });



            
            // ----- Certificate Settings -----
            Route::controller(CertificateSettingController::class)->group(function () {
                Route::get('settings', 'index')->name('settings');
                Route::post('settings', 'storeOrUpdate')->name('settings-store');
            });

            // ----- Certificate Generation -----
            Route::controller(GenerateCertificateController::class)->group(function () {
                Route::get('generate', 'index')->name('generate');
                Route::get('generate/users', 'getUsersList')->name('generate.users');
                Route::post('generate/certificates', 'generateCertificates')->name('generate.certificates');
                // Fallback for refresh/GET access to certificates result
                Route::get('generate/certificates', function() {
                    return redirect()->route('admin.certificate.generate');
                });
                Route::post('generate/save', 'saveCertificates')->name('generate.save');
            });

            // ----- Certificate Records -----
            Route::controller(CertificateController::class)->group(function () {
                Route::get('records', 'certificates')->name('records');
                Route::post('records', 'searchCertificates')->name('searchCertificates');
                Route::get('record/{record_id}', 'show')->name('record_show');
                Route::get('record-delete/{record_id}', 'delete')->name('record_delete');
                Route::get('record-delete-multiple', 'deleteMultiple')->name('record_delete_multiple');
                Route::get('record-download', 'download')->name('record_download');
                Route::get('record-print/{record_id}', 'print')->name('record_print');
            });
        });

        // Logout
        Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    });
});
