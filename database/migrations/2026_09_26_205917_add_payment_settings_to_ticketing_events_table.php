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
        Schema::table('ticketing_events', function (Blueprint $table) {
            $table->boolean('requires_payment')->default(false)->after('status');
            $table->decimal('member_fee', 10, 2)->nullable()->after('requires_payment');
            $table->decimal('non_member_fee', 10, 2)->nullable()->after('member_fee');
            $table->json('enabled_payment_methods')->nullable()->after('non_member_fee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ticketing_events', function (Blueprint $table) {
            $table->dropColumn(['requires_payment', 'member_fee', 'non_member_fee', 'enabled_payment_methods']);
        });
    }
};
