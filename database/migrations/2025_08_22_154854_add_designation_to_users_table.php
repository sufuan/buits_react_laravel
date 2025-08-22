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
            // Modify existing usertype column to enum
            $table->enum('usertype', ['member', 'volunteer', 'executive'])->default('member')->change();
            $table->unsignedBigInteger('designation_id')->nullable()->after('usertype');
            $table->foreign('designation_id')->references('id')->on('designations')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['designation_id']);
            $table->dropColumn(['designation_id']);
            // Revert usertype back to string
            $table->string('usertype')->default('user')->change();
        });
    }
};
