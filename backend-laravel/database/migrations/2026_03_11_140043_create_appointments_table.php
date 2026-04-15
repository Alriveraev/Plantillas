<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignUuid('customer_id')->constrained('customers')->cascadeOnDelete();
            $table->foreignUuid('staff_member_id')->constrained('staff_members')->cascadeOnDelete();
            $table->foreignUuid('service_id')->constrained('services')->cascadeOnDelete();

            $table->dateTime('start_at');
            $table->dateTime('end_at');

            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed

            $table->decimal('total_price', 10, 2);
            $table->text('notes')->nullable();

            $table->timestamps();

            // Índices para optimizar las vistas de calendario mensual/semanal
            $table->index(['business_id', 'start_at', 'end_at']);
            $table->index(['staff_member_id', 'start_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
