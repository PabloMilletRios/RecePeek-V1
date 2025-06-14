<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('comentarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('receta_id')->constrained('recetas')->onDelete('cascade');
            $table->text('contenido');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('comentarios');
    }
};
