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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->decimal('original_price', 8, 2)->nullable();
            $table->string('icon')->nullable();
            $table->string('duration')->nullable();
            $table->text('short_desc')->nullable();
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->json('contents')->nullable();
            $table->string('color')->nullable();
            $table->string('category'); // ranks, keys, bundles
            $table->integer('discount')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('popular')->default(false);
            $table->boolean('best_offer')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
