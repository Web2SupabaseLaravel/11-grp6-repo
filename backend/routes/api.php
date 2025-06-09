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
// ملفات المستخدم
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // إدارة المستخدمين (admin مثلا)
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // إدارة Event Creations
    Route::apiResource('event-creations', EventCreationApiController::class)->parameters([
        'event-creations' => 'event_creation' // لتفادي التعارض في المعرفات إن أردت
    ]);

    // إشعارات
    Route::apiResource('notifications', NotificationController::class);

    // عمليات الشراء (buys)
    Route::apiResource('buys', BuyAPIController::class)->parameters([
        'buys' => 'buy' // ضبط اسم المعرفات حسب الحاجة
    ]);

    // التذاكر
    Route::apiResource('tickets', TicketController::class);

    // الأحداث (events)
    Route::apiResource('events', EventApiController::class);