<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Remove school_id from certificate_templates table
        Schema::table('certificate_templates', function (Blueprint $table) {
            $table->dropColumn('school_id');
        });

        // Remove school_id from certificate_settings table
        Schema::table('certificate_settings', function (Blueprint $table) {
            $table->dropColumn('school_id');
        });

        // Remove school_id from certificate_records table
        Schema::table('certificate_records', function (Blueprint $table) {
            $table->dropColumn('school_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Add school_id back to certificate_templates table
        Schema::table('certificate_templates', function (Blueprint $table) {
            $table->integer('school_id')->nullable()->default(1);
        });

        // Add school_id back to certificate_settings table
        Schema::table('certificate_settings', function (Blueprint $table) {
            $table->integer('school_id')->nullable()->default(1);
        });

        // Add school_id back to certificate_records table
        Schema::table('certificate_records', function (Blueprint $table) {
            $table->integer('school_id')->nullable()->default(1);
        });
    }
};
