<?php

use App\Http\Controllers\V1\AuthController;
use App\Http\Controllers\V1\FilterController;
use App\Http\Controllers\V1\NewsController;
use App\Http\Controllers\V1\UserPreferenceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::prefix('v1')->group(function () {
    
    // Authentication Routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected Routes for Logged-in Users
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/personalized-feed', [NewsController::class, 'personalizedFeed']);
        Route::post('/user/preferences', [UserPreferenceController::class, 'updatePreferences']);
        Route::get('/user/preferences', [UserPreferenceController::class, 'getPreferences']);
    });

    // Filter Routes
    Route::prefix('filters')->controller(FilterController::class)->group(function () {
        Route::get('/categories', 'categories');
        Route::get('/sources', 'sources');
        Route::get('/authors', 'authors');
    });

    // News Articles
    Route::get('/articles', [NewsController::class, 'search']);
});
