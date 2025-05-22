<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\BuyAPIController;



Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/buys', [BuyAPIController::class, 'index']);
Route::get('/buys/create', [BuyAPIController::class, 'create']);
Route::post('/buys', [BuyAPIController::class, 'store']);
Route::get('/buys/{user_id}/{ticket_id}/edit', [BuyAPIController::class, 'edit']);
Route::put('/buys/{user_id}/{ticket_id}', [BuyAPIController::class, 'update']);
Route::delete('/buys/{user_id}/{ticket_id}', [BuyAPIController::class, 'destroy']);
