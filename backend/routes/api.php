<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EventApiController;
use App\Http\Controllers\API\EventCreationApiController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\BuyController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:api')->group(function () {
    Route::middleware('auth:api')->get('/user', function () {
    return response()->json(auth()->user());
});




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

    
    

    Route::prefix('buys')->group(function () {
        Route::get('/', [BuyController::class, 'index']);                      
        Route::post('/', [BuyController::class, 'store']);                    
        Route::get('/{user_id}/{ticket_id}', [BuyController::class, 'show']); 
        Route::delete('/{user_id}/{ticket_id}', [BuyController::class, 'destroy']); 
    });


    
    Route::apiResource('tickets', TicketController::class);

    
    Route::apiResource('events', EventApiController::class);
    