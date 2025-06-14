<?php

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\RecetasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ComentarioController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/* Login-Registro */
Route::post('/auth/register', [UserController::class, 'createUser']);
Route::post('/auth/login', [UserController::class, 'loginUser']);

/* Perfil*/
Route::middleware('auth:sanctum')->get('/profile', function (Request $request) {
    return response()->json($request->user());
});
/* Recetas Post-Get-Delete */
Route::get('/recetas', [RecetasController::class, 'index']);
Route::get('/recetas/{id}', [RecetasController::class, 'show']);
Route::delete('/recetas/{id}', [RecetasController::class, 'destroy']);
Route::get('/recetas/categoria/{categoria}', [RecetasController::class, 'porCategoria']);


/* Publicacion Recestas*/
Route::middleware('auth:sanctum')->post('/recetas', [RecetasController::class, 'store']);
//Route::post('/recetas', [RecetasController::class, 'store']); // sin auth:sanctum

/* Perfil Personal*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/perfil', [UserController::class, 'perfil']);
    Route::put('/perfil', [UserController::class, 'actualizarPerfil']);
    Route::post('/perfil/password', [UserController::class, 'cambiarPassword']);
    Route::put('/perfil/nombre', [UserController::class, 'updateNombre']);
    Route::get('/mis-recetas', [RecetasController::class, 'misRecetas']);
    Route::delete('/perfil', [UserController::class, 'eliminarCuenta']);
    Route::delete('/recetas/{id}', [RecetasController::class, 'destroy']);
 });

/* Seccion de Comentario*/
Route::get('/recetas/{id}/comentarios', [ComentarioController::class, 'index']);
Route::post('/comentarios', [ComentarioController::class, 'store'])->middleware('auth:sanctum');
Route::delete('/comentarios/{id}', [ComentarioController::class, 'destroy'])->middleware('auth:sanctum');

/* Me gustas- Valoracion*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recetas/{id}/votar', [LikeController::class, 'votar']);
});
/* Busqueda de Recetas*/
Route::get('/recetas/buscar', [RecetasController::class, 'buscarPorTitulo']);

/* Favoritos */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/recetas/{id}/favoritos', [RecetasController::class, 'toggleFavorito']);
    Route::get('/favoritos', [RecetasController::class, 'misFavoritos']);
});
