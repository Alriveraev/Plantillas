<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID
            $table->string('name')->unique();
            $table->string('label');
            $table->timestamps();
        });
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID
            $table->string('name');
            $table->string('email')->unique();

            $table->timestamp('email_verified_at')->nullable();

            $table->string('password');

            $table->foreignUuid('role_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true);

            // Google 2FA
            $table->text('google2fa_secret')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();

            // Auditoría
            $table->timestamp('last_login_at')->nullable();
            $table->ipAddress('last_ip')->nullable();

            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');

        Schema::dropIfExists('users');
    }
};
