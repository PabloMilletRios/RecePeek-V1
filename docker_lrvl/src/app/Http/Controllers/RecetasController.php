<?php

namespace App\Http\Controllers;

use App\Models\Recetas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Like;

class RecetasController extends Controller
{   
    # Recetas / Index :  Metodo para mostrar todas las recetas, junto a las likes(el voto del usuario estara registrado)
    public function index()
    {   
         # Id del usuario logueado 
        $userId = Auth::id();
         # Se obtienen todas las recetas con el usuario, y todos los likes.
        $items = Recetas::with('user', 'likes')
            ->withCount([
                 # Para esto se usaron los tipos, para contar los tipos 1, de esta forma el contador no podra bajar de 0, pero se contaran los votos positivos 
                'likes as likes_count' => function ($query) {
                    $query->where('tipo', 1);
                }
            ])
            ->get()
            ->map(function ($receta) use ($userId) {
                $votoUsuario = $receta->likes->firstWhere('user_id', $userId);
                $receta->liked_by_user = $votoUsuario?->tipo;

                // Ajuste visual del contador si el usuario vota negativamente 
                if ($votoUsuario && $votoUsuario->tipo === -1) {
                    $receta->likes_count = max(0, $receta->likes_count - 1); // nunca menos de 0
                }

                unset($receta->likes); // no exponemos todos los votos
                return $receta;
            });
         # Se devuelven los datos en formaton Json para el front 
        return response()->json($items);
    }
     # Recetas / Show : Mostrar las recetas 
    public function show(string $id)
    {
        $item = Recetas::with('user')->find($id);
        return response()->json($item);
    }
     # Recetas / Destroy : Eliminar la receta 
    public function destroy($id)
    {   
        # Busca la receta 
        $receta = Recetas::findOrFail($id);
        
        # Si el usuario no esta logueado o no tiene el id necesario para eliminar la receta(sale de la sesion en su perfil) da error 403
        if ($receta->user_id !== auth()->id()) {
            return response()->json(['error' => 'Ha ocurrido un error'], 403);
        }

        # Ejecuta el metodo borrar
        $receta->delete();

        # Mensaje de exito de borrar la receta 
        return response()->json(['message' => 'Receta eliminada correctamente']);
    }
     # Recetas / Store : Crear una receta 
    public function store(Request $request)
    {   
         # Validamos los datos del formulario, con los requirimientos necesarios para ajustar a la base de datos y al front
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'steps' => 'required|string|min:10',
            'category' => 'nullable|string',
        ]);
         # Se crea la receta usando la id del usuario logueado 
        $receta = Recetas::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'steps' => $request->steps,
            'category' => $request->category,
        ]);
         # Devuelve el mensaje con un mensaje exito si se crea bien, status 201 
        return response()->json([
            'status' => true,
            'message' => 'Receta creada correctamente',
            'receta' => $receta
        ], 201);
    }
     # Recetas / Votar :  Dar like o dislike a una receta 
    public function votar(Request $request, $id)
    {   
         # Se recoge el id del usuario logueado 
       $userId = Auth::id();

         # Se valida el tipo que el usuario le de a la receta 
        $request->validate([
            'tipo' => 'required|in:1,-1'
        ]);

         # Se guarda o se actuliza el voto del usuario 
        $like = Like::updateOrCreate(
            ['user_id' => $userId, 'receta_id' => $id],
            ['tipo' => $request->tipo]
        );
        return response()->json(['success' => true]);
    }
     # Recetas / buscarPorTitulo : Buscador para el navbar
    public function buscarPorTitulo(Request $req)
    {   
         # Se recoge el titulo de la receta 
        $titulo = $req->query('titulo');
         # Se buscan las recetas en la base de datos que contengan esa/esas palabra/s, se obtienen sus likes y el usuario y se exponen
        $recetas = Recetas::with('user')
            ->where('title', 'like', "%$titulo%")
            ->withCount('likes')
            ->get();

        return response()->json($recetas);
    }
    /*Como dato: Intelepehnse tiene un problema con los metodos, tienes que quitarlos del paquete sino no sale el error aunque funcionen*/

     # Recetas / toggleFavorito: Añadir una receta a favoritos
    public function toggleFavorito($id)
    {   
         # Se obtiene el usuario que esta logueado 
        $user = Auth::user();

         # Se obtiene la receta y si el usuario la tiene guardada
        $yaFavorito = $user->favoritos()->where('receta_id', $id)->exists();
         
         # Si el usuario la tiene guardada se eliminará de sus favoritos, pero si el usuario no la tiene se guardará 
        if ($yaFavorito) {
            $user->favoritos()->detach($id);
            return response()->json(['status' => 'eliminado']);
        } else {
            $user->favoritos()->attach($id);
            return response()->json(['status' => 'añadido']);
        }
    }
     # Recetas / misFavoritos : Se devuelven las recetas que el usuario tenga guardadas como favoritos
    public function misFavoritos()
    {
         # Recogemos el usuario que esta logueado
        $user = Auth::user();
         # Recogemos todas las recetas que tenga el usuario en favoritos 
        $favoritos = $user->favoritos()->with('user')->get();
         # Se devuelven las recetas en un response 
        return response()->json($favoritos);
    }
     # Recetas / misRecetas : Devuelve las recetas creadas por el usuario 
    public function misRecetas()
    { 
         # Se recoge el usuario logueado
        $userId = auth()->id();
         # Busca las recetas que tengan al id del usuario 
        $recetas = Recetas::where('user_id', $userId)->get();
         # Las devuelve 
        return response()->json($recetas);
    }
     # Recetas / porCategoria: Devuelve las recetas de una categoria con los likes de los usuarios
    public function porCategoria($categoria)
    {   
         # Recoge el usuario logueado 
        $userId = Auth::id();

         # Recibe las recetas de la categoria seleccionanda, recogiendiendo ademas los likes y el user del usuario para evitar problemas con los likes
        $recetas = Recetas::with('user', 'likes')
            ->where('category', $categoria)
            ->withCount([
                'likes as likes_count' => function ($query) {
                    $query->where('tipo', 1);
                }
            ]) 
            ->get()
            # Se aplica un mapeo sobre las recetas para la personalizacion de la información de cada receta. 
            ->map(function ($receta) use ($userId) {
                $votoUsuario = $receta->likes->firstWhere('user_id', $userId);
                $receta->liked_by_user = $votoUsuario?->tipo;
                 # Si el user ha votado dislike, ajustamos el contador de likes para evitar números erróneos
                if ($votoUsuario && $votoUsuario->tipo === -1) {
                    $receta->likes_count = max(0, $receta->likes_count - 1);
                }
                # Se elimina la lista de likes de la receta para que no se incluya en la respuesta final
                unset($receta->likes);
                # Se devuelve la receta 
                return $receta;
            });
           
        return response()->json($recetas);
    }
}
