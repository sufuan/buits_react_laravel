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
        Schema::table('previous_committee_members', function (Blueprint $table) {
            if (! Schema::hasColumn('previous_committee_members', 'tenure_start')) {
                $table->date('tenure_start')->nullable()->after('member_order');
            }
            if (! Schema::hasColumn('previous_committee_members', 'tenure_end')) {
                $table->date('tenure_end')->nullable()->after('tenure_start');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('previous_committee_members', function (Blueprint $table) {
            if (Schema::hasColumn('previous_committee_members', 'tenure_end')) {
                $table->dropColumn('tenure_end');
            }
            if (Schema::hasColumn('previous_committee_members', 'tenure_start')) {
                $table->dropColumn('tenure_start');
            }
        });
    }
};
