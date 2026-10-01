<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticketing_events', function (Blueprint $table) {
            $table->json('payment_numbers')->nullable()->after('enabled_payment_methods');
        });
    }

    public function down(): void
    {
        Schema::table('ticketing_events', function (Blueprint $table) {
            $table->dropColumn('payment_numbers');
        });
    }
};
