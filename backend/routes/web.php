<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;
use App\Models\Ticket;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\BuyController;
use App\Http\Controllers\EventCreationController;

Route::get('/', [EventCreationController::class, 'index'])->name('event_creation.index');

Route::get('/event-creation', [EventCreationController::class, 'index'])->name('event_creation.index');
Route::get('/event-creation/create', [EventCreationController::class, 'create'])->name('event_creation.create');
Route::post('/event-creation', [EventCreationController::class, 'store'])->name('event_creation.store');
Route::delete('/event-creation/{event_id}/{user_id}', [EventCreationController::class, 'destroy'])->name('event_creation.destroy');
Route::get('/', function () {
    return view('welcome');
});

Route::get('/buys', [BuyController::class, 'index'])->name('buys.index');
Route::get('/buys/create', [BuyController::class, 'create'])->name('buys.create');
Route::post('/buys', [BuyController::class, 'store'])->name('buys.store');
Route::get('/buys/{user_id}/{ticket_id}/edit', [BuyController::class, 'edit'])->name('buys.edit');
Route::put('/buys/{user_id}/{ticket_id}', [BuyController::class, 'update'])->name('buys.update');
Route::delete('/buys/{user_id}/{ticket_id}', [BuyController::class, 'destroy'])->name('buys.destroy');


Route::get('/', function () {
    return view('welcome');
});


Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
Route::get('/notifications/create', [NotificationController::class, 'create'])->name('notifications.create');
Route::post('/notifications', [NotificationController::class, 'store'])->name('notifications.store');
Route::get('/notifications/{id}/edit', [NotificationController::class, 'edit'])->name('notifications.edit');
Route::put('/notifications/{id}', [NotificationController::class, 'update'])->name('notifications.update');
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');




Route::get('/ticket/create', function () {
    Ticket::create([
        'ticket_id' => 1,
        'event_id' => 101,
        'title' => 'Football Match',
        'type' => 'VIP',
        'price' => 150,
    ]);
    return '✅ Ticket Created!';
});

Route::get('/ticket/all', function () {
    return Ticket::all();
});

Route::get('/ticket/show/{ticket_id}', function ($ticket_id) {
    $ticket = Ticket::find($ticket_id);
    return $ticket ?: '❌ Ticket Not Found!';
});

Route::get('/ticket/update/{ticket_id}', function ($ticket_id) {
    $ticket = Ticket::find($ticket_id);
    if (!$ticket) return '❌ Ticket Not Found!';
    $ticket->update([
        'title' => 'Updated Match',
        'price' => 180
    ]);
    return '✅ Ticket Updated!';
});

Route::get('/ticket/delete/{ticket_id}', function ($ticket_id) {
    $ticket = Ticket::find($ticket_id);
    if (!$ticket) return '❌ Ticket Not Found!';
    $ticket->delete();
    return '🗑️ Ticket Deleted!';
});

Route::get('/', function () {
    return view('welcome');
});



Route::resource('events', EventController::class);

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/admin-only', function () {
    if (auth()->check() && auth()->user()->role === 'admin') {
        return ":white_check_mark: You are an admin. Access granted.";
    } else {
        abort(403, ':no_entry: Access denied. Admins only.');
    }
})->middleware('auth')->name('admin.only');

require __DIR__.'/auth.php';

