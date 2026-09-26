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
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->change();
            $table->string('transaction_id')->nullable()->change();
            $table->boolean('is_member')->default(false)->after('status');
            $table->string('member_id')->nullable()->after('is_member');
            $table->decimal('fee_charged', 10, 2)->nullable()->after('member_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_registrations', function (Blueprint $table) {
            $table->string('payment_method')->nullable(false)->change();
            $table->string('transaction_id')->nullable(false)->change();
            $table->dropColumn(['is_member', 'member_id', 'fee_charged']);
        });
    }
};
