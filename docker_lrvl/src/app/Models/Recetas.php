<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recetas extends Model
{
    use HasFactory;
    protected $table = 'recetas';

    # Campos que se utilizaran para el CRUD 
    protected $fillable =
    [
        'user_id',
        'title',
        'description',
        'steps',
        'category',
    ];
     # Conversion de tipos al usar Eloquent
    protected $casts = [
        'steps' => 'array'
    ];
    # Relacion N:1 de X(comentarios, recetas, etc) ---> User 
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    # Relacion 1:M de usuario--->comentarios 
    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
    # Relacion 1:1 de usuario--->Like/Dislike
    public function userLike()
    {
        return $this->hasOne(Like::class);
    }
    /* Se necesita una correlacion para ajustar la cantidad de likes */
    public function likes()
    {
        return $this->hasMany(Like::class,'receta_id');
    }
    # Relacion 1:1 de usuario ---> voto
    public function votos()
    {
        return $this->likes()->sum('tipo');
    }
    
}
