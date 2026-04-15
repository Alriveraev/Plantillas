<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->string('name');
            $table->string('slug')->unique(); // Para URLs personalizadas, ej: tuapp.com/mg-barbershop
            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            $table->string('timezone')->default('America/El_Salvador');
            $table->string('currency', 3)->default('USD');
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });

        // Modificamos la tabla users que ya tienes
        Schema::table('users', function (Blueprint $table) {
            // Un usuario nulo aquí significa que es un SuperAdmin tuyo
            $table->foreignUuid('business_id')->nullable()->after('id')->constrained('businesses')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['business_id']);
            $table->dropColumn('business_id');
        });

        Schema::dropIfExists('businesses');
    }
};
