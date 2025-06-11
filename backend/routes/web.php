<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventCreationController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\BuyController;
use App\Models\Ticket;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => view('welcome'))->name('home');

// عرض جميع الأحداث العامة
Route::get('/event-creation', [EventCreationController::class, 'index'])->name('event_creation.index');

// عرض كل التذاكر
Route::get('/ticket/all', fn() => Ticket::all());
Route::get('/ticket/show/{ticket_id}', function ($ticket_id) {
    $ticket = Ticket::find($ticket_id);
    return $ticket ?: '❌ Ticket Not Found!';
});

/*
|--------------------------------------------------------------------------
| Authenticated User Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', fn() => view('dashboard'))->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | Event Creation Routes (requires login)
    |--------------------------------------------------------------------------
    */
    Route::get('/event-creation/create', [EventCreationController::class, 'create'])->name('event_creation.create');
    Route::post('/event-creation', [EventCreationController::class, 'store'])->name('event_creation.store');
    Route::delete('/event-creation/{event_id}/{user_id}', [EventCreationController::class, 'destroy'])->name('event_creation.destroy');

    /*
    |--------------------------------------------------------------------------
    | Notification Routes
    |--------------------------------------------------------------------------
    */
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/create', [NotificationController::class, 'create'])->name('notifications.create');
    Route::post('/notifications', [NotificationController::class, 'store'])->name('notifications.store');
    Route::get('/notifications/{id}/edit', [NotificationController::class, 'edit'])->name('notifications.edit');
    Route::put('/notifications/{id}', [NotificationController::class, 'update'])->name('notifications.update');
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    /*
    |--------------------------------------------------------------------------
    | Buy Routes
    |--------------------------------------------------------------------------
    */
    Route::get('/buys', [BuyController::class, 'index'])->name('buys.index');
    Route::get('/buys/create', [BuyController::class, 'create'])->name('buys.create');
    Route::post('/buys', [BuyController::class, 'store'])->name('buys.store');
    Route::get('/buys/{user_id}/{ticket_id}/edit', [BuyController::class, 'edit'])->name('buys.edit');
    Route::put('/buys/{user_id}/{ticket_id}', [BuyController::class, 'update'])->name('buys.update');
    Route::delete('/buys/{user_id}/{ticket_id}', [BuyController::class, 'destroy'])->name('buys.destroy');

    /*
    |--------------------------------------------------------------------------
    | Ticket Test Routes (You may remove them in production)
    |--------------------------------------------------------------------------
    */
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

    Route::get('/ticket/update/{ticket_id}', function ($ticket_id) {
        $ticket = Ticket::find($ticket_id);
        if (!$ticket) return '❌ Ticket Not Found!';
        $ticket->update(['title' => 'Updated Match', 'price' => 180]);
        return '✅ Ticket Updated!';
    });

    Route::get('/ticket/delete/{ticket_id}', function ($ticket_id) {
        $ticket = Ticket::find($ticket_id);
        if (!$ticket) return '❌ Ticket Not Found!';
        $ticket->delete();
        return '🗑️ Ticket Deleted!';
    });
});

/*
|--------------------------------------------------------------------------
| Admin Only Test Route (optional, replace with middleware if needed)
|--------------------------------------------------------------------------
*/
Route::get('/admin-only', function () {
    if (auth()->check() && auth()->user()->role === 'admin') {
        return "✅ You are an admin. Access granted.";
    } else {
        abort(403, '⛔ Access denied. Admins only.');
    }
})->middleware('auth')->name('admin.only');

/*
|--------------------------------------------------------------------------
| Event Resource Controller (public or protected as needed)
|--------------------------------------------------------------------------
*/
Route::resource('events', EventController::class);
