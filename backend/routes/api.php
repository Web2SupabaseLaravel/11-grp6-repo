<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\EventApiController;

/*
|--------------------------------------------------------------------------
| Notifications API Routes
|--------------------------------------------------------------------------
|
| Here are the API routes for the notifications feature
|
*/

// Get all notifications
Route::get('/notifications', [NotificationController::class, 'index']);

// Get a specific notification
Route::get('/notifications/{id}', [NotificationController::class, 'show']);

// Create a new notification
Route::post('/notifications', [NotificationController::class, 'store']);

// Update a notification
Route::put('/notifications/{id}', [NotificationController::class, 'update']);

// Delete a notification
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
