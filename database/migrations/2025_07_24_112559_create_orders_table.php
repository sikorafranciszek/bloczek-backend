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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('cashbill_order_id')->unique(); // CashBill order ID
            $table->string('status')->default('PreStart'); // CashBill payment status
            $table->decimal('amount', 10, 2); // Order amount
            $table->string('currency', 3)->default('PLN'); // Currency code
            $table->string('title'); // Payment title
            $table->text('description')->nullable(); // Payment description
            $table->json('products'); // Array of ordered products
            $table->json('customer_data')->nullable(); // Customer personal data
            $table->string('payment_channel')->nullable(); // Selected payment channel
            $table->text('additional_data')->nullable(); // Additional order data
            $table->string('return_url')->nullable(); // Success return URL
            $table->string('negative_return_url')->nullable(); // Failure return URL
            $table->string('redirect_url')->nullable(); // CashBill payment URL
            $table->timestamp('paid_at')->nullable(); // When payment was completed
            $table->timestamps();
            
            $table->index(['status']);
            $table->index(['cashbill_order_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
