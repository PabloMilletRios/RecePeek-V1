<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{   # Campos que se utilizaran para el CRUD 
    protected $fillable = ['user_id', 'receta_id', 'tipo'];

    // Relación N:1 → Un like/dislike pertenece a una receta específica
    public function receta() {
        return $this->belongsTo(Recetas::class, 'receta_id');
    }

    # Relacion N:1 de like a un usuario
    public function user() {
        return $this->belongsTo(User::class);
    }
}
