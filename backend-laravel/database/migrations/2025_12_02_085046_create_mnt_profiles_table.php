<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();

            $table->foreignUuid('gender_id')->nullable()->constrained('ctl_genders')->nullOnDelete();
            $table->string('avatar_path')->nullable()->after('gender_id');

            $table->string('first_name');
            $table->string('second_name')->nullable();
            $table->string('third_name')->nullable(); // Como pediste

            $table->string('first_surname');
            $table->string('second_surname')->nullable();
            $table->string('third_surname')->nullable(); // Como pediste

            $table->string('phone')->nullable()->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
