<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCertificateRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('certificate_records', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->string('certificate_path');
            $table->integer('user_id');
            $table->integer('template_id')->nullable();
            $table->integer('class_id')->nullable();
            $table->integer('section_id')->nullable();
            $table->integer('exam_id')->nullable();
            $table->integer('academic_id')->nullable()->default(1);
            $table->integer('school_id')->nullable()->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('certificate_records');
    }
}
