<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->foreignId('owner_id')->constrained('users');
            $table->string('domain')->unique();
            $table->string('custom_domain')->unique()->nullable();
            $table->foreignId('plan_id')->constrained();
            $table->enum('status', ['active', 'suspended', 'inactive'])->default('active');
            $table->dateTime('subscription_end_date')->nullable();
            $table->bigInteger('storage_quota');
            $table->integer('product_limit');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
