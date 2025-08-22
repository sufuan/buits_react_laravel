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
        Schema::create('role_change_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('admin_id')->constrained('admins')->onDelete('cascade');
            $table->string('old_usertype')->nullable();
            $table->string('new_usertype');
            $table->foreignId('old_designation_id')->nullable()->constrained('designations')->onDelete('set null');
            $table->foreignId('new_designation_id')->nullable()->constrained('designations')->onDelete('set null');
            $table->text('reason')->nullable();
            $table->enum('action_type', ['promotion', 'demotion', 'designation_change', 'manual_change']);
            $table->json('metadata')->nullable(); // Store additional context
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_change_logs');
    }
};
