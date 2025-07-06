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
        Schema::create('pending_users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone');
            $table->string('department');
            $table->string('session'); // Format: YYYY-YYYY
            $table->string('usertype')->default('user');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('date_of_birth')->nullable();
            $table->string('blood_group')->nullable();
            $table->string('class_roll');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->text('current_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->string('transaction_id');
            $table->string('to_account');
            $table->string('image')->nullable();
            $table->text('skills')->nullable();
            $table->text('custom-form')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pending_users');
    }
};
