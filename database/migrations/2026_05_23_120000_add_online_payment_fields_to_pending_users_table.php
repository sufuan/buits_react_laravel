<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Makes transaction_id and to_account nullable (they were NOT NULL in the
     * original migration but online-payment registrations have no TXN ID at
     * submission time).  Raw DB::statement is used to avoid the doctrine/dbal
     * dependency that ->change() requires.
     *
     * Then adds three new payment-tracking columns for online flow.
     */
    public function up(): void
    {
        // ── Make existing NOT NULL columns nullable ────────────────────────
        // Uses raw SQL to avoid requiring doctrine/dbal on XAMPP/MySQL.
        DB::statement('ALTER TABLE pending_users MODIFY transaction_id VARCHAR(255) NULL');
        DB::statement('ALTER TABLE pending_users MODIFY to_account VARCHAR(255) NULL');

        // ── Add new online-payment columns (guarded against re-runs) ──────
        Schema::table('pending_users', function (Blueprint $table) {
            if (! Schema::hasColumn('pending_users', 'pp_id')) {
                $table->string('pp_id')->nullable()->after('payment_method');
            }

            if (! Schema::hasColumn('pending_users', 'payment_type')) {
                // Values: 'online' | 'offline'
                $table->string('payment_type')->nullable()->after('pp_id');
            }

            if (! Schema::hasColumn('pending_users', 'payment_status')) {
                // Values: 'pending_payment' | 'completed' | 'cancelled' | 'failed'
                $table->string('payment_status')->nullable()->default('pending_payment')->after('payment_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Restore NOT NULL constraints (only safe if no NULLs exist in those columns)
        DB::statement('ALTER TABLE pending_users MODIFY transaction_id VARCHAR(255) NOT NULL');
        DB::statement('ALTER TABLE pending_users MODIFY to_account VARCHAR(255) NOT NULL');

        Schema::table('pending_users', function (Blueprint $table) {
            $columnsToRemove = array_filter(
                ['pp_id', 'payment_type', 'payment_status'],
                fn ($col) => Schema::hasColumn('pending_users', $col)
            );

            if (! empty($columnsToRemove)) {
                $table->dropColumn(array_values($columnsToRemove));
            }
        });
    }
};
