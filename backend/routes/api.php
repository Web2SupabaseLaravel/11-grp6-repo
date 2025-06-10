<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EventApiController;
use App\Http\Controllers\API\EventCreationApiController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\BuyAPIController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// تسجيل مستخدم جديد وتسجيل دخول
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Protected Routes (Authentication Required)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    // رغد حطي هون الاشياء الي لازم يكون مسجل دخول عشان يعملها

    

});

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    
    Route::apiResource('event-creations', EventCreationApiController::class)->parameters([
        'event-creations' => 'event_creation' 
    ]);

    
    Route::apiResource('notifications', NotificationController::class);

    
    Route::apiResource('buys', BuyAPIController::class)->parameters([
        'buys' => 'buy' 
    ]);

    
    Route::apiResource('tickets', TicketController::class);

    
    Route::apiResource('events', EventApiController::class);