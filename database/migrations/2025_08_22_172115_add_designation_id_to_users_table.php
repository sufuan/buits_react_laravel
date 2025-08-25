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
            if (! Schema::hasColumn('users', 'designation_id')) {
                $table->foreignId('designation_id')->nullable()->constrained('designations')->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            Schema::table('users', function (Blueprint $table) {
                if (Schema::hasColumn('users', 'designation_id')) {
                    try { $table->dropForeign(['designation_id']); } catch (\Throwable $e) {}
                    try { $table->dropColumn('designation_id'); } catch (\Throwable $e) {}
                }
            });
        } catch (\Throwable $e) {
            // ignore
        }
    }
};
