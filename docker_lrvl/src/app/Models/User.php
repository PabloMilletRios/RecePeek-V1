<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Recetas;


class User extends Authenticatable
{
    #Funcionalidades 
    use HasApiTokens, HasFactory, Notifiable;
    
    # Campos que se utilizaran para el CRUD 
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar'
    ];
    # Campos ocultos del usuario  
    protected $hidden = [
        'password',
        'remember_token',
    ];

    # Conversion de tipos al usar Eloquent
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    # Relacion 1:M de usuario--->recetas
    public function recetas()
    {
        return $this->hasMany(Recetas::class);
    }
    # Relacion 1:M de usuario--->comentarios
    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
    # Relacion 1:M usuario puede tener muchas recetas favoritas 
    public function favoritos()
    {   
        # Tabla intermedia de favoritos  
        return $this->belongsToMany(Recetas::class, 'favoritos', 'user_id', 'receta_id');
    }
}
