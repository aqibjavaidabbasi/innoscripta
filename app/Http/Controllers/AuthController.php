<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
  
    /**
     * Register a new user.
     *
     * @group Authentication
     *
     * @bodyParam name string required The full name of the user. Example: John Doe
     * @bodyParam email string required The email address of the user. Must be unique. Example: johndoe@example.com
     * @bodyParam password string required The user's password. Minimum 8 characters. Example: secret123
     * @bodyParam password_confirmation string required Must match the password. Example: secret123
     *
     * @response {
     *  "message": "User registered successfully!",
     *  "user": {
     *      "id": 1,
     *      "name": "John Doe",
     *      "email": "johndoe@example.com"
     *  },
     *  "access_token": "1|zXW8y0...",
     *  "token_type": "Bearer"
     * }
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully!',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful!',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
    
}
