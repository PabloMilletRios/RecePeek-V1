<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Recetas;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    # Like / Votar: metodo para votar a la receta 
    public function votar(Request $req, $id)
    {
        # Tipo tiene que ser obligatorio y solo puede contener 1 o -1 para facilitar el recuento de votos 
        $req->validate([
            'tipo' => 'required|in:1,-1'
        ]);

        # Se obtiene el usuario logueado
        $user = $req->user();
        # Se obtiene la receta que se va a votar
        $receta = Recetas::findOrFail($id);
        # Creamos el like o lo actualizamos, depende de la situacion
        $like = Like::updateOrCreate(
            ['user_id' => $user->id, 'receta_id' => $receta->id],
            ['tipo' => $req->tipo]
        );
        # Respuesta para validar si se ha ejecutado correctamente 
        return response()->json(['success' => true, 'tipo' => $like->tipo]);
    }
}
