<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EventApiController;
use App\Http\Controllers\API\EventCreationApiController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\API\BuyAPIController;
use App\Http\Controllers\API\TicketController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
// use App\Http\Controllers\API\CheckInAPIController; // إذا كنت تستخدم هذا المتحكم، تأكد من استيراده


/*
|--------------------------------------------------------------------------
| Public Routes (المسارات العامة التي لا تتطلب مصادقة)
|--------------------------------------------------------------------------
*/

// تسجيل مستخدم جديد وتسجيل دخول
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// المسارات التي يجب أن تكون عامة (إذا كانت كذلك في تصميمك)
// يفضل نقل كل ما يتطلب مصادقة إلى المجموعة المحمية بالـ middleware
Route::get('/users', [UserController::class, 'index']); // لجلب المستخدمين في CheckInPage
Route::get('/users/{id}', [UserController::class, 'show']); // لجلب مستخدم واحد

// مسارات Buys و Tickets بدون حماية (إذا كانت عامة)
Route::apiResource('buys', BuyAPIController::class)->parameters([
    'buys' => 'buy'
]);
// هذا المسار يجب أن يأتي قبل Route::apiResource('tickets') لتجنب التعارض
Route::get('tickets-details', [TicketController::class, 'getAllTicketsDetails']);
Route::apiResource('tickets', TicketController::class);


/*
|--------------------------------------------------------------------------
| Protected Routes (المسارات المحمية التي تتطلب مصادقة)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    // ملفات المستخدم الشخصية
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // إدارة المستخدمين (إذا كانت تتطلب صلاحيات Admin مثلاً)
    // يمكن تكرار المسارات هنا إذا كانت تتطلب حماية إضافية
    // Route::get('/users', [UserController::class, 'index']);
    // Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // إدارة Event Creations
    Route::apiResource('event-creations', EventCreationApiController::class)->parameters([
        'event-creations' => 'event_creation'
    ]);

    // إشعارات
    Route::apiResource('notifications', NotificationController::class);

    // عمليات الشراء (buys) - إذا أردت حمايتها، انقلها هنا
    // Route::apiResource('buys', BuyAPIController::class)->parameters(['buys' => 'buy']);

    // الأحداث (events)
    Route::apiResource('events', EventApiController::class);

    // التذاكر - إذا أردت حمايتها
    // Route::get('tickets-details', [TicketController::class, 'getAllTicketsDetails']);
    // Route::apiResource('tickets', TicketController::class);
});

// إذا كان هناك أي متحكمات أخرى للـ web (مثال: BuyController)
// تأكد أنها معرفة في web.php وليس هنا.
