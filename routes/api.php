<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaymentController;
use App\Services\CashBillService;

// Simple test endpoint
Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

// Test CashBillService instantiation
Route::get('/payment/cashbill-test', function () {
    try {
        $service = new CashBillService();
        return response()->json([
            'success' => true,
            'message' => 'CashBillService created successfully'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error: ' . $e->getMessage()
        ], 500);
    }
});

// Payment API routes for external applications (Next.js shop)
Route::prefix('payment')->group(function () {
    // Get available payment channels
    Route::get('/channels', [PaymentController::class, 'getPaymentChannels']);
    
    // Create new payment
    Route::post('/create', [PaymentController::class, 'createPayment']);
    
    // Get payment status
    Route::get('/status/{orderId}', [PaymentController::class, 'getPaymentStatus']);
    
    // CashBill notification webhook
    Route::get('/notification', [PaymentController::class, 'handleNotification']);
    Route::post('/notification', [PaymentController::class, 'handleNotification']);
    
    // Get all orders (for admin dashboard)
    Route::get('/orders', [PaymentController::class, 'getOrders']);
});