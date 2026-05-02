<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\StatisticsController;

// Public Auth Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/resend-otp', [AuthController::class, 'resendOtp']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

// Public Store Routes
Route::get('/stores/plans', [StoreController::class, 'getPlans']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Store Management
    Route::post('/stores', [StoreController::class, 'createStore']);
    Route::get('/stores/current', [StoreController::class, 'getStore']);
    Route::put('/stores/current', [StoreController::class, 'updateStore']);
    Route::post('/stores/current/custom-domain', [StoreController::class, 'connectCustomDomain']);
    Route::post('/stores/current/renew-subscription', [StoreController::class, 'renewSubscription']);

    // Products
    Route::apiResource('products', ProductController::class);

    // Orders
    Route::apiResource('orders', OrderController::class);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    // Customers
    Route::apiResource('customers', CustomerController::class, ['only' => ['index', 'show']]);
    Route::get('/customers/{customer}/orders', [CustomerController::class, 'getCustomerOrders']);

    // Statistics
    Route::get('/statistics/tenant', [StatisticsController::class, 'tenantStats']);
    Route::get('/statistics/admin', [StatisticsController::class, 'superAdminStats']);
});
