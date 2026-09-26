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
        Schema::create('ticketing_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('event_html_content')->nullable();
            $table->json('form_schema')->nullable();
            $table->decimal('fee', 8, 2)->nullable();
            $table->dateTime('deadline')->nullable();
            $table->enum('status', ['active', 'closed'])->default('active');
            $table->foreignId('created_by')->constrained('admins')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticketing_events');
    }
};
