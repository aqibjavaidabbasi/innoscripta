<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FilterController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\UserPreferenceController;

// Authentication Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Protected Routes for Logged-in Users
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

   
    Route::post('/user/preferences', [UserPreferenceController::class, 'updatePreferences']);
    Route::get('/user/preferences', [UserPreferenceController::class, 'getPreferences']);

});
Route::get('/filters/categories', [FilterController::class, 'categories']);
Route::get('/filters/sources', [FilterController::class, 'sources']);
Route::get('/filters/authors', [FilterController::class, 'authors']);
Route::get('/articles', [NewsController::class, 'search']);
Route::middleware('auth:sanctum')->get('/personalized-feed', [NewsController::class, 'personalizedFeed']);
