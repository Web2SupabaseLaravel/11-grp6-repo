<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EventApiController;
use App\Http\Controllers\API\EventCreationApiController;

Route::get('/event-creations/{event_id}/{user_id}', [EventCreationApiController::class, 'show']);
Route::put('/event-creations/{event_id}/{user_id}', [EventCreationApiController::class, 'update']);
Route::delete('/event-creations/{event_id}/{user_id}', [EventCreationApiController::class, 'destroy']);
Route::get('/event-creations', [EventCreationApiController::class, 'index']);
Route::post('/event-creations', [EventCreationApiController::class, 'store']);



Route::apiResource('events', EventApiController::class);
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
