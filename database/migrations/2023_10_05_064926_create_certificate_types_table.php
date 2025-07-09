<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\CertificateType;

class CreateCertificateTypesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('certificate_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('usertype'); // student or staff
            $table->longText('short_code'); // for variable fields
            $table->timestamps();
        });

        // Initial certificate types data
        $types = [
            [
                'name' => 'Student Character Certificate',
                'usertype' => 'student',
                'short_code' => '["name","dob","present_address","guardian","admission_no","roll_no","gender","admission_date","father_name","mother_name","religion","email","phone"]'
            ],
            [
                'name' => 'Staff Character Certificate',
                'usertype' => 'staff',
                'short_code' => '["name","gender","staff_id","joining_date","designation","department","qualification","total_experience","religion","email","mobileno","present_address"]'
            ],
            [
                'name' => 'Transfer Certificate',
                'usertype' => 'student',
                'short_code' => '["name","dob","present_address","guardian","admission_no","roll_no","gender","admission_date","category","cast","father_name","mother_name","religion","email","phone","class","section","exam"]'
            ],
            [
                'name' => 'NOC',
                'usertype' => 'staff',
                'short_code' => '["name","staff_id","joining_date","designation","department","qualification","total_experience"]'
            ],
            [
                'name' => 'Experience Certificate',
                'usertype' => 'staff',
                'short_code' => '["name","staff_id","joining_date","designation","department","qualification","total_experience"]'
            ],
            [
                'name' => 'Extra Curricular Activities Certificate',
                'usertype' => 'student',
                'short_code' => '["name","dob","present_address","guardian","admission_no","roll_no","gender","admission_date","category","cast","father_name","mother_name","religion","email","phone"]'
            ],
        ];

        foreach ($types as $type) {
            CertificateType::create($type);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certificate_types');
    }
}
