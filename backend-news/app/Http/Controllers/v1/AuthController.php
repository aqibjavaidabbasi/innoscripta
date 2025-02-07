<?php

namespace App\Http\Controllers\V1;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Exception;

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
     * @response 201 {
     *  "message": "User registered successfully!",
     *  "user": {
     *      "id": 1,
     *      "name": "John Doe",
     *      "email": "johndoe@example.com"
     *  },
     *  "access_token": "1|zXW8y0...",
     *  "token_type": "Bearer"
     * }
     *
     * @response 422 {
     *  "message": "Validation failed",
     *  "errors": {
     *      "email": ["The email has already been taken."]
     *  }
     * }
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully!',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Authenticate and log in a user.
     *
     * @group Authentication
     *
     * @bodyParam email string required The email of the user. Example: johndoe@example.com
     * @bodyParam password string required The password of the user. Example: secret123
     *
     * @response 200 {
     *  "message": "Login successful!",
     *  "user": {
     *      "id": 1,
     *      "name": "John Doe",
     *      "email": "johndoe@example.com"
     *  },
     *  "access_token": "1|zXW8y0...",
     *  "token_type": "Bearer"
     * }
     *
     * @response 401 {
     *  "message": "Invalid credentials."
     * }
     *
     * @response 422 {
     *  "message": "Validation failed",
     *  "errors": {
     *      "email": ["The email field is required."]
     *  }
     * }
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                throw new AuthenticationException('Invalid credentials.');
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful!',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (AuthenticationException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 401);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Log out the authenticated user.
     *
     * @group Authentication
     *
     * @authenticated
     *
     * @header Authorization Bearer {YOUR_ACCESS_TOKEN}
     *
     * @response 200 {
     *  "message": "Logged out successfully."
     * }
     *
     * @response 401 {
     *  "message": "Unauthenticated."
     * }
     *
     * @response 500 {
     *  "message": "Something went wrong",
     *  "error": "Server error message"
     * }
     */

    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if ($user) {
                // Revoke all tokens for security
                $user->tokens()->delete();
            }

            return response()->json([
                'message' => 'Logged out successfully.',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // get user
    /**
     * Get the authenticated user.
     *
     * @group Authentication
     *
     * @authenticated
     *
     * @header Authorization Bearer {YOUR_ACCESS_TOKEN}
     * 
     * @response 200 {
     * "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "johndoe@gmail.com",
     *     "email_verified_at": "2021-08-01T00:00:00.000000Z",
     *     "created_at": "2021-08-01T00:00:00.000000Z",
     *     "updated_at": "2021-08-01T00:00:00.000000Z"
     * }
     * 
     * @response 401 {
     *     "message": "Unauthenticated."
     * }
     * 
     * @response 500 {
     *    "message": "Something went wrong",
     *    "error": "Server error message"
     * }
     */

    public function user(Request $request)
    {
        try {
            $user = $request->user();
            if ($user) {
                return response()->json([
                    'user' => $user,
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Unauthenticated.',
                ], 401);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
