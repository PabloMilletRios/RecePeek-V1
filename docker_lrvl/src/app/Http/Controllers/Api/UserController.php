<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;


class UserController extends Controller
{
    /*REGISTRO*/

    public function createUser(Request $request)
    {
        try {
            $validarUser = Validator::make(
                $request->all(),
                [
                    'name' => 'required',
                    'email' => 'required|email|unique:users,email',
                    'password' => 'required|min:6',
                ]
            );

            if ($validarUser->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Validation error',
                    'errors' => $validarUser->errors()
                ], 401);
            }
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
            return response()->json([
                'status' => true,
                'message' => 'Usuario Creado Correctamente',
                'token' => $user->createToken("Api Token")->plainTextToken
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /*LOGIN*/

    public function loginUser(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => 'El email y la contraseña no son válidos',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Credenciales incorrectas'
                ], 401);
            }

            return response()->json([
                'status' => true,
                'message' => 'Usuario logueado correctamente',
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error interno: ' . $th->getMessage()
            ], 500);
        }
    }
    public function perfil(Request $req)
    {
        return response()->json($req->user());
    }

    // Cambia el nombre del usuario si es válido
    public function updateNombre(Request $req)
    {
        $validated = $req->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $usuario = $req->user();
        $usuario->name = $validated['name'];
        $usuario->save();

        return response()->json(['msg' => 'Nombre actualizado con éxito.']);
    }

    // Permite al usuario subir un avatar.
    public function cargarAvatar(Request $req)
    {
        if (!$req->hasFile('avatar')) {
            return response()->json(['error' => 'No se envió ningún archivo.'], 400);
        }

        $req->validate([
            'avatar' => ['image', 'max:2048'],
        ]);

        $u = $req->user();

        if (!empty($u->avatar) && Storage::disk('public')->exists($u->avatar)) {
            Storage::disk('public')->delete($u->avatar);
        }

        $newPath = $req->file('avatar')->store('avatars', 'public');
        $u->avatar = $newPath;
        $u->save();

        return response()->json([
            'url' => url('storage/' . $newPath),
            'status' => 'Avatar subido correctamente.'
        ]);
    }

    // Cambia la contraseña si EL USUARIO LO DESEA use Illuminate\Support\Facades\Hash;

    public function cambiarPassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($data['current_password'], $user->password)) {
            return response()->json(['error' => 'La contraseña actual no es válida'], 422);
        }

        $user->password = Hash::make($data['new_password']);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }



    // Eliminar cuenta si el usuario lo desea 
    public function eliminarCuenta(Request $req)
    {
        $user = $req->user();
        $user->delete();

        return response()->json(['mensaje' => 'Cuenta eliminada correctamente.']);
    }
}
