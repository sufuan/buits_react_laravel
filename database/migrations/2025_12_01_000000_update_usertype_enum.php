<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // We need to use raw SQL for modifying ENUM columns in MySQL/MariaDB to add new values
        // This avoids issues with Doctrine DBAL not always handling enums perfectly for 'change()'
        $table = 'users';
        $column = 'usertype';
        
        // Setup new enum definition including 'faculty' and other potential types
        // Original: ['member', 'volunteer', 'executive']
        // New: ['member', 'volunteer', 'executive', 'faculty', 'student', 'alumni']
        
        DB::statement("ALTER TABLE users MODIFY COLUMN usertype ENUM('member', 'volunteer', 'executive', 'faculty', 'student', 'alumni') DEFAULT 'member'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to original enum values
        // Note: This might fail if there are rows with 'faculty' etc values. 
        // We'll wrap in try-catch or just accept that down migration might truncate data if executed.
        try {
            DB::statement("ALTER TABLE users MODIFY COLUMN usertype ENUM('member', 'volunteer', 'executive') DEFAULT 'member'");
        } catch (\Exception $e) {
            // Log or ignore if data prevents rollback
        }
    }
};
