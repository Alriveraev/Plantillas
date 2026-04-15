<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staff_members', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();

            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('schedules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignUuid('staff_member_id')->nullable()->constrained('staff_members')->cascadeOnDelete();

            $table->tinyInteger('day_of_week'); // 0 = Domingo, 1 = Lunes, etc.
            $table->time('start_time');
            $table->time('end_time');

            $table->timestamps();
        });

        Schema::create('time_offs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('staff_member_id')->constrained('staff_members')->cascadeOnDelete();

            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->string('reason')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_offs');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('staff_members');
    }
};
