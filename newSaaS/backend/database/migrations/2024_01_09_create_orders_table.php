<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained();
            $table->foreignId('customer_id')->constrained();
            $table->string('order_number')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'])->default('new');
            $table->enum('payment_method', ['whatsapp', 'form', 'phone_call'])->default('whatsapp');
            $table->text('notes')->nullable();
            $table->dateTime('shipped_at')->nullable();
            $table->dateTime('delivered_at')->nullable();
            $table->dateTime('cancelled_at')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['customer_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
