<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BuyController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/buys', [BuyController::class, 'index'])->name('buys.index');
Route::get('/buys/create', [BuyController::class, 'create'])->name('buys.create');
Route::post('/buys', [BuyController::class, 'store'])->name('buys.store');
Route::get('/buys/{user_id}/{ticket_id}/edit', [BuyController::class, 'edit'])->name('buys.edit');
Route::put('/buys/{user_id}/{ticket_id}', [BuyController::class, 'update'])->name('buys.update');
Route::delete('/buys/{user_id}/{ticket_id}', [BuyController::class, 'destroy'])->name('buys.destroy');
