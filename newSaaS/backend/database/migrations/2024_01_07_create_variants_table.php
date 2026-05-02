<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained();
            $table->string('name');
            $table->string('value');
            $table->decimal('price_modifier', 10, 2)->default(0);
            $table->integer('stock_quantity')->default(0);
            $table->timestamps();

            $table->unique(['product_id', 'name', 'value']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variants');
    }
};
