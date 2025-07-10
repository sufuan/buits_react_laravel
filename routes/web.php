<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Test route for debugging certificate template save
Route::get('/test-template-save', function () {
    try {
        $template = new \App\Models\CertificateTemplate();
        $template->name = 'Test Template ' . now();
        $template->certificate_type_id = 1;
        $template->layout = 1;
        $template->width = '210mm';
        $template->height = '297mm';
        $template->user_photo_style = 1;
        $template->user_image_size = '100';
        $template->qr_image_size = '100';
        $template->content = 'Test content';
        $template->status = 1;
        $template->qr_code = '["admission_no"]';

        $result = $template->save();

        $check = \App\Models\CertificateTemplate::find($template->id);

        return response()->json([
            'save_result' => $result,
            'template_id' => $template->id,
            'exists_in_db' => $check ? true : false,
            'template_data' => $check ? $check->toArray() : null,
            'all_templates_count' => \App\Models\CertificateTemplate::count()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

require __DIR__ . '/auth.php';

Route::prefix('admin')->name('admin.')->group(function () {

    // Admin Guest Routes (e.g. Login)
    Route::middleware('guest:admin')->group(function () {
        Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    // Admin Authenticated Routes
    Route::middleware('admin')->group(function () {

        // Admin Dashboard
        Route::get('dashboard', fn() => Inertia::render('Admin/Dashboard'))->name('dashboard');

        // ================= User Management =================
        Route::prefix('users')->name('users.')->group(function () {
            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::get('create', [UserController::class, 'create'])->name('create');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::get('export', [UserController::class, 'export'])->name('export');
            Route::get('template', [UserController::class, 'template'])->name('template');
            Route::post('import', [UserController::class, 'import'])->name('import');
            Route::get('{user}', [UserController::class, 'show'])->name('show');
            Route::get('{user}/edit', [UserController::class, 'edit'])->name('edit');
            Route::put('{user}', [UserController::class, 'update'])->name('update');
            Route::delete('{user}', [UserController::class, 'destroy'])->name('destroy');

            Route::get('all', [UserApprovalController::class, 'allUsers'])->name('all');
            Route::get('pending', [UserApprovalController::class, 'index'])->name('pending');
            Route::post('{id}/approve', [UserApprovalController::class, 'approve'])->name('approve');
            Route::delete('{id}/reject', [UserApprovalController::class, 'reject'])->name('reject');
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
                Route::get('{template}/design/reset', [CertificateTemplateController::class, 'designReset'])->name('design.reset');

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
                Route::get('generate/staff-certificate', 'staffCertificate')->name('generate-staff-certificate');
                Route::post('generate/staff-certificate', 'staffCertificateSearch')->name('generate-staff-certificate-search');
                Route::get('generate-certificate-staff', 'generateCertificateStaff')->name('generate-certificate-staff');

                Route::get('generate', 'index')->name('generate');
                Route::post('generate', 'getStudentList')->name('generate-get-list');
                Route::get('generate-certificate', 'generateCertificate')->name('generate-certificate');
                Route::post('save-generated-certificate', 'store')->name('certificate-save');
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
