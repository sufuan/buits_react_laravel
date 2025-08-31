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
        Schema::table('committee_assignments', function (Blueprint $table) {
            // Committee tracking fields
            $table->string('committee_number')->after('designation_id'); // e.g., "2024-2025", "2025-2026"
            $table->date('tenure_start')->after('committee_number');
            $table->date('tenure_end')->nullable()->after('tenure_start');
            $table->enum('status', ['current', 'previous'])->default('current')->after('tenure_end');
            $table->integer('member_order')->default(0)->after('status'); // For ordering members in display
            
            // Add indexes for better query performance
            $table->index(['status', 'committee_number']);
            $table->index(['committee_number', 'member_order']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('committee_assignments', function (Blueprint $table) {
            // Drop indexes first
            $table->dropIndex(['status', 'committee_number']);
            $table->dropIndex(['committee_number', 'member_order']);
            $table->dropIndex(['status']);
            
            // Drop columns
            $table->dropColumn([
                'committee_number',
                'tenure_start',
                'tenure_end',
                'status',
                'member_order'
            ]);
        });
    }
};
