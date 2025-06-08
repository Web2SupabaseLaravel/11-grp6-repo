<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TicketController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// راوتات CRUD للـ tickets بدون حماية (تقدر تضيف middleware حسب الحاجة)
Route::apiResource('tickets', TicketController::class);
