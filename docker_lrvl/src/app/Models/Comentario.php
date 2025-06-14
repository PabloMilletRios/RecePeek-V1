<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comentario extends Model {
    use HasFactory;
    # Campos que se utilizaran para el CRUD 
    protected $fillable = [
        'user_id',
        'receta_id',
        'contenido',
    ];

    #Relacion 1:1 Un comentario pertenece a un user
    public function user() {
        return $this->belongsTo(User::class);
    }
    # Relacion 1:1 Un comentario pertenece a una receta 
    public function receta() {
        return $this->belongsTo(Recetas::class);
    }
}

