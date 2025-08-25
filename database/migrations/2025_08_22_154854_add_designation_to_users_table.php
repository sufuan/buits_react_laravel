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
        Schema::table('users', function (Blueprint $table) {
            // Modify existing usertype column to enum (if present)
            try {
                $table->enum('usertype', ['member', 'volunteer', 'executive'])->default('member')->change();
            } catch (\Throwable $e) {
                // ignore if change isn't supported in this environment
            }

            if (! Schema::hasColumn('users', 'designation_id')) {
                $table->unsignedBigInteger('designation_id')->nullable()->after('usertype');
                $table->foreign('designation_id')->references('id')->on('designations')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Best-effort rollback: try to remove FK/column but ignore if FK name differs or is missing
        try {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'designation_id')) {
                    try {
                        $table->dropForeign(['designation_id']);
                    } catch (\Throwable $e) {
                        // ignore if FK name doesn't match or doesn't exist
                    }

                    try {
                        $table->dropColumn('designation_id');
                    } catch (\Throwable $e) {
                        // ignore if already dropped or other issue
                    }
                }

                // Revert usertype back to string where possible
                try {
                    $table->string('usertype')->default('user')->change();
                } catch (\Throwable $e) {
                    // ignore change errors during rollback
                }
            });
        } catch (\Throwable $e) {
            // ignore any errors during best-effort rollback
        }
    }
};
