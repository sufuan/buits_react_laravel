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
            $table->string('phone')->nullable();
            $table->string('department')->nullable();
            $table->string('session')->nullable(); // Format: YYYY-YYYY
            $table->string('usertype')->default('user');
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('blood_group')->nullable();
            $table->string('class_roll')->nullable();
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->text('current_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->boolean('is_approved')->default(true); // Users in this table are approved
            $table->string('member_id')->nullable()->unique();
            $table->string('transaction_id')->nullable();
            $table->string('to_account')->nullable();
            $table->string('image')->nullable();
            $table->text('skills')->nullable();
            $table->text('custom-form')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'department',
                'session',
                'usertype',
                'gender',
                'date_of_birth',
                'blood_group',
                'class_roll',
                'father_name',
                'mother_name',
                'current_address',
                'permanent_address',
                'is_approved',
                'member_id',
                'transaction_id',
                'to_account',
                'image',
                'skills',
                'custom-form',
            ]);
        });
    }
};
