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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('pp_id')->unique();
            $table->string('customer_name');
            $table->string('customer_email_mobile');
            $table->string('payment_method')->nullable();
            $table->string('amount');
            $table->string('fee')->default('0');
            $table->string('refund_amount')->default('0');
            $table->decimal('total', 10, 2)->default(0);
            $table->string('currency')->default('BDT');
            $table->string('transaction_id')->nullable();
            $table->string('sender_number')->nullable();
            $table->json('metadata')->nullable();
            $table->string('status')->default('pending'); // pending | completed | refunded
            $table->string('paid_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
