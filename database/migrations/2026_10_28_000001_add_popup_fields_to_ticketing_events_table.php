<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticketing_events', function (Blueprint $table) {
            $table->string('popup_image')->nullable()->after('payment_numbers');
            $table->boolean('show_in_popup')->default(false)->after('popup_image');
        });
    }

    public function down(): void
    {
        Schema::table('ticketing_events', function (Blueprint $table) {
            $table->dropColumn(['popup_image', 'show_in_popup']);
        });
    }
};
