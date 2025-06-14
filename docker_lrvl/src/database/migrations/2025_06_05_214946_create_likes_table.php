<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('receta_id')->constrained('recetas')->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'receta_id']); // Un solo like/dislike por usuario en la receta
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
