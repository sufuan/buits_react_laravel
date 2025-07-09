<?php

use Illuminate\Database\Migrations\Migration;

class AddCertificatePermissions extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $certificate = [
            'module' => 'Certificate',
            'name' => 'Certificate',
            'route' => 'certificate',
            'icon' => 'fas fa-book-open',
            'position' => 19,
            'is_menu' => 1,
            'status' => 1,
            'child' => [
                'types' => [
                    'name' => 'Types',
                    'route' => 'certificate.types',
                    'position' => 1,
                    'is_menu' => 1,
                    'child' => [
                        'type_store' => ['name' => 'Add', 'route' => 'certificate.type_store'],
                        'type_edit' => ['name' => 'Edit', 'route' => 'certificate.type_edit'],
                        'type_delete' => ['name' => 'Delete', 'route' => 'certificate.type_delete'],
                    ],
                ],
                'template' => [
                    'name' => 'Templates',
                    'route' => 'certificate.templates',
                    'position' => 2,
                    'is_menu' => 1,
                    'child' => [
                        'template_store' => ['name' => 'Add', 'route' => 'certificate.template_store'],
                        'template_edit' => ['name' => 'Edit', 'route' => 'certificate.template_edit'],
                        'template_design' => ['name' => 'Design', 'route' => 'certificate.template_design'],
                        'template_delete' => ['name' => 'Delete', 'route' => 'certificate.template_delete'],
                    ],
                ],
                'student_certificate' => [
                    'name' => 'Student Certificate',
                    'route' => 'certificate.generate',
                    'position' => 3,
                    'is_menu' => 1,
                ],
                'staff_certificate' => [
                    'name' => 'Staff Certificate',
                    'route' => 'certificate.generate-staff-certificate',
                    'position' => 4,
                    'is_menu' => 1,
                ],
                'certificate_records' => [
                    'name' => 'Certificate Records',
                    'route' => 'certificate.records',
                    'position' => 5,
                    'is_menu' => 1,
                    'child' => [
                        'record_delete' => ['name' => 'Record Delete', 'route' => 'certificate.record_delete'],
                    ],
                ],
                'settings' => [
                    'name' => 'Settings',
                    'route' => 'certificate.settings',
                    'position' => 6,
                    'is_menu' => 1,
                    'child' => [
                        'update_settings' => ['name' => 'Update', 'route' => 'certificate.settings-store'],
                    ],
                ],
            ],
        ];

        // storePermissionData($certificate); // Commented out - function not available
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Implement rollback if needed (e.g., deletePermissionsByModule('Certificate'))
    }
}
