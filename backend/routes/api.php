<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EventApiController;
use App\Http\Controllers\API\EventCreationApiController;
use App\Http\Controllers\API\NotificationController;

Route::get('/event-creations/{event_id}/{user_id}', [EventCreationApiController::class, 'show']);
Route::put('/event-creations/{event_id}/{user_id}', [EventCreationApiController::class, 'update']);
Route::delete('/event-creations/{event_id}/{user_id}', [EventCreationApiController::class, 'destroy']);
Route::get('/event-creations', [EventCreationApiController::class, 'index']);
Route::post('/event-creations', [EventCreationApiController::class, 'store']);

Route::get('/notifications', [NotificationController::class, 'index']);

// Get a specific notification
Route::get('/notifications/{id}', [NotificationController::class, 'show']);

// Create a new notification
Route::post('/notifications', [NotificationController::class, 'store']);

// Update a notification
Route::put('/notifications/{id}', [NotificationController::class, 'update']);

// Delete a notification
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

Route::apiResource('events', EventApiController::class);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
