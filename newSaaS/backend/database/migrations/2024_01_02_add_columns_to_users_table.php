<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->enum('role', ['SUPER_ADMIN', 'STORE_OWNER', 'STORE_MANAGER'])->default('STORE_MANAGER');
            $table->foreignId('tenant_id')->nullable()->constrained();
            $table->boolean('is_active')->default(true);
            $table->string('otp_code')->nullable();
            $table->dateTime('otp_expires_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'role', 'tenant_id', 'is_active', 'otp_code', 'otp_expires_at']);
        });
    }
};
