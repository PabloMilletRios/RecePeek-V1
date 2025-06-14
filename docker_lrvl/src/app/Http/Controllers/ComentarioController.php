<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComentarioController extends Controller
{
    # Comentarios / Index: Carga todos los comentarios de una receta gracias a su id
    public function index($id)
    {
        # Buscamos los comentarios de la receta que se pasan, tambien se carga el user del comentario para mantener la relación
        return Comentario::where('receta_id', $id)->with('user')->get();
    }
    # Comentarios / Store: guardar un nuevo comentario
    public function store(Request $request)
    {
        # Se validan los datos de la peticion, el contenido es obligatorio y puede tener max 1000 caracteres; y receta_id tambien es obligatorio pero tiene que exitir en la tabla de recetas
        $request->validate([
            'contenido' => 'required|string|max:1000',
            'receta_id' => 'required|exists:recetas,id',
        ]);
        # Se crea el comentario para añadirlo a la base de datos, el user_id se saca del usuario logueado
        $comentario = Comentario::create([
            'user_id' => $request->user()->id,
            'receta_id' => $request->receta_id,
            'contenido' => $request->contenido,
        ]);
        # Devolvemos el comentario creado junto al usuario con el codigo 201 para verificar que se cargo bien 
        return response()->json([
            'status' => true,
            'comentario' => $comentario->load('user')
        ], 201);
    }
    # Comentario / Destroy: Eliminar un comentario 
    public function destroy($id)
    {   
        # Se busca el comentario por su id, si no lanza error 404(findOrFail muy util)
        $comentario = Comentario::findOrFail($id);
        # Se obtiene el usuario que esta logueado 
        $user = Auth::user();
        # Se comprueba que el usuario este logueado y que es el que escribio el comentario 
        if (!$user || $comentario->user_id !== $user->id) {
            # Si salta error, devuelve el error 403 
            return response()->json(['error' => 'No autorizado'], 403);
        }
        # Eliminamos el comentario 
        $comentario->delete();

        # Se devuelve el mensaje de eliminado 
        return response()->json(['mensaje' => 'Comentario eliminado']);
    }
}
