<?php
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    return view('welcome');
});
use App\Http\Controllers\NotificationController;

Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
Route::get('/notifications/create', [NotificationController::class, 'create'])->name('notifications.create');
Route::post('/notifications', [NotificationController::class, 'store'])->name('notifications.store');
Route::get('/notifications/{id}/edit', [NotificationController::class, 'edit'])->name('notifications.edit');
Route::put('/notifications/{id}', [NotificationController::class, 'update'])->name('notifications.update');
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
