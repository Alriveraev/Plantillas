<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {


        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('id')->primary(); // UUID
            $table->string('key')->unique();
            $table->string('description');
            $table->timestamps();
        });

        Schema::create('permission_role', function (Blueprint $table) {
            // Claves foráneas UUID
            $table->foreignUuid('role_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('permission_id')->constrained()->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('permissions');
    }
};
