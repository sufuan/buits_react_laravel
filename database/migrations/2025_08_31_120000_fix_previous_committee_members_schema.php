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
            // Ensure committee_number can hold strings like '2025-2026'
            if (Schema::hasColumn('previous_committee_members', 'committee_number')) {
                // Attempt to change to string if current type is integer
                try {
                    $table->string('committee_number')->change();
                } catch (\Exception $e) {
                    // ignore if change is not supported on this driver
                }
            } else {
                $table->string('committee_number')->after('photo');
            }

            if (! Schema::hasColumn('previous_committee_members', 'tenure_start')) {
                $table->timestamp('tenure_start')->nullable()->after('member_order');
            }

            if (! Schema::hasColumn('previous_committee_members', 'tenure_end')) {
                $table->timestamp('tenure_end')->nullable()->after('tenure_start');
            }

            if (! Schema::hasColumn('previous_committee_members', 'user_id')) {
                $table->unsignedBigInteger('user_id')->nullable()->after('id');
            }

            if (! Schema::hasColumn('previous_committee_members', 'designation_title')) {
                $table->string('designation_title')->nullable()->after('designation');
            }

            if (! Schema::hasColumn('previous_committee_members', 'designation_id_snapshot')) {
                $table->unsignedBigInteger('designation_id_snapshot')->nullable()->after('designation_title');
            }

            if (! Schema::hasColumn('previous_committee_members', 'email')) {
                $table->string('email')->nullable()->after('name');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('previous_committee_members', function (Blueprint $table) {
            if (Schema::hasColumn('previous_committee_members', 'tenure_start')) {
                $table->dropColumn('tenure_start');
            }
            if (Schema::hasColumn('previous_committee_members', 'tenure_end')) {
                $table->dropColumn('tenure_end');
            }
            if (Schema::hasColumn('previous_committee_members', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }
            if (Schema::hasColumn('previous_committee_members', 'designation_title')) {
                $table->dropColumn('designation_title');
            }
            if (Schema::hasColumn('previous_committee_members', 'designation_id_snapshot')) {
                $table->dropColumn('designation_id_snapshot');
            }
            if (Schema::hasColumn('previous_committee_members', 'email')) {
                $table->dropColumn('email');
            }
        });
    }
};
