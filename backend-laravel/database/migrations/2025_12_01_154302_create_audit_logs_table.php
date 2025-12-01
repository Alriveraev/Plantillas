<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('user_id')->nullable()->index();

            $table->string('method');
            $table->string('url');
            $table->integer('status_code');

            // Detalles técnicos
            $table->string('ip_address', 45);
            $table->text('user_agent')->nullable();

            $table->json('payload')->nullable();
            $table->float('duration_ms')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
