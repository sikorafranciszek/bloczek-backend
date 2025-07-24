<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\CashBillService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Get available payment channels
     */
    public function getPaymentChannels(Request $request)
    {
        try {
            // For testing purposes, return mock data instead of calling CashBill
            return response()->json([
                'success' => true,
                'data' => [
                    [
                        'id' => 'blik',
                        'name' => 'BLIK',
                        'description' => 'Płatność BLIK',
                        'availableCurrencies' => ['PLN'],
                        'logoUrl' => 'https://example.com/blik.png'
                    ],
                    [
                        'id' => 'card',
                        'name' => 'Karta płatnicza', 
                        'description' => 'Płatność kartą',
                        'availableCurrencies' => ['PLN'],
                        'logoUrl' => 'https://example.com/card.png'
                    ],
                    [
                        'id' => 'transfer',
                        'name' => 'Przelew bankowy',
                        'description' => 'Szybki przelew',
                        'availableCurrencies' => ['PLN'],
                        'logoUrl' => 'https://example.com/transfer.png'
                    ]
                ]
            ]);
            
            /* Real CashBill implementation:
            $cashBillService = new CashBillService();
            $languageCode = $request->query('language', 'PL');
            
            $result = $cashBillService->getPaymentChannels($languageCode);
            
            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'data' => $result['data']
                ]);
            }
            
            return response()->json([
                'success' => false,
                'message' => $result['error']
            ], 500);
            */
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Service error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new payment
     */
    public function createPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'products' => 'required|array|min:1',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'customer_data' => 'required|array',
            'customer_data.firstName' => 'required|string|max:255',
            'customer_data.surname' => 'required|string|max:255',
            'customer_data.email' => 'required|email',
            'customer_data.country' => 'nullable|string|max:100',
            'customer_data.city' => 'nullable|string|max:100',
            'customer_data.postcode' => 'nullable|string|max:20',
            'customer_data.street' => 'nullable|string|max:255',
            'customer_data.house' => 'nullable|string|max:50',
            'customer_data.flat' => 'nullable|string|max:50',
            'return_url' => 'required|url',
            'negative_return_url' => 'nullable|url',
            'payment_channel' => 'nullable|string',
            'language_code' => 'nullable|string|in:PL,EN'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Calculate total amount and prepare order data
            $productIds = collect($request->products)->pluck('id');
            $products = Product::whereIn('id', $productIds)->get();
            
            $totalAmount = 0;
            $orderProducts = [];
            
            foreach ($request->products as $requestProduct) {
                $product = $products->where('id', $requestProduct['id'])->first();
                $quantity = $requestProduct['quantity'];
                $subtotal = $product->price * $quantity;
                $totalAmount += $subtotal;
                
                $orderProducts[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                    'image_url' => $product->image_url
                ];
            }

            // Create order in database first
            $order = new Order();
            $order->status = 'PreStart';
            $order->amount = $totalAmount;
            $order->currency = 'PLN';
            $order->title = 'Zamówienie #' . time();
            $order->description = 'Zakup produktów: ' . collect($orderProducts)->pluck('name')->join(', ');
            $order->products = $orderProducts;
            $order->customer_data = $request->customer_data;
            $order->return_url = $request->return_url;
            $order->negative_return_url = $request->negative_return_url;
            $order->payment_channel = $request->payment_channel;
            $order->additional_data = json_encode(['order_id' => time()]);
            $order->save();

            // Prepare CashBill payment data
            $paymentData = [
                'title' => $order->title,
                'amount' => [
                    'value' => $totalAmount,
                    'currencyCode' => 'PLN'
                ],
                'description' => $order->description,
                'returnUrl' => $request->return_url,
                'negativeReturnUrl' => $request->negative_return_url ?? $request->return_url,
                'personalData' => [
                    'firstName' => $request->customer_data['firstName'],
                    'surname' => $request->customer_data['surname'],
                    'email' => $request->customer_data['email'],
                    'country' => $request->customer_data['country'] ?? '',
                    'city' => $request->customer_data['city'] ?? '',
                    'postcode' => $request->customer_data['postcode'] ?? '',
                    'street' => $request->customer_data['street'] ?? '',
                    'house' => $request->customer_data['house'] ?? '',
                    'flat' => $request->customer_data['flat'] ?? '',
                    'ip' => $request->ip()
                ],
                'additionalData' => $order->additional_data,
                'languageCode' => $request->language_code ?? 'PL',
                'referer' => 'Laravel-Shop'
            ];

            if ($request->payment_channel) {
                $paymentData['paymentChannel'] = $request->payment_channel;
            }

            // Create payment in CashBill
            $cashBillService = new CashBillService();
            $result = $cashBillService->createPayment($paymentData);

            if ($result['success']) {
                // Update order with CashBill data
                $order->cashbill_order_id = $result['data']['id'];
                $order->redirect_url = $result['data']['redirectUrl'];
                $order->save();

                return response()->json([
                    'success' => true,
                    'data' => [
                        'order_id' => $order->id,
                        'cashbill_order_id' => $result['data']['id'],
                        'redirect_url' => $result['data']['redirectUrl'],
                        'total_amount' => $totalAmount,
                        'products' => $orderProducts
                    ]
                ]);
            } else {
                // Delete the order if payment creation failed
                $order->delete();
                
                return response()->json([
                    'success' => false,
                    'message' => 'Payment creation failed: ' . $result['error']
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Payment creation error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get payment status
     */
    public function getPaymentStatus(Request $request, $orderId)
    {
        $order = Order::where('id', $orderId)->orWhere('cashbill_order_id', $orderId)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Get fresh status from CashBill if we have cashbill_order_id
        if ($order->cashbill_order_id) {
            $cashBillService = new CashBillService();
            $result = $cashBillService->getPaymentDetails($order->cashbill_order_id);
            
            if ($result['success']) {
                // Update local order status
                $order->status = $result['data']['status'];
                if ($result['data']['status'] === 'PositiveFinish') {
                    $order->paid_at = now();
                }
                $order->save();
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'order_id' => $order->id,
                'cashbill_order_id' => $order->cashbill_order_id,
                'status' => $order->status,
                'status_name' => $order->status_name,
                'amount' => $order->amount,
                'currency' => $order->currency,
                'products' => $order->products,
                'paid_at' => $order->paid_at,
                'is_paid' => $order->isPaid(),
                'is_failed' => $order->isFailed(),
                'is_pending' => $order->isPending()
            ]
        ]);
    }

    /**
     * Handle CashBill notification
     */
    public function handleNotification(Request $request)
    {
        $cmd = $request->query('cmd');
        $args = $request->query('args');
        $signature = $request->query('sign');

        if (!$cmd || !$args || !$signature) {
            return response('Missing parameters', 400);
        }

        // Verify signature
        $cashBillService = new CashBillService();
        if (!$cashBillService->verifyNotification($cmd, $args, $signature)) {
            return response('Invalid signature', 401);
        }

        if ($cmd === 'transactionStatusChanged') {
            $cashbillOrderId = $args;
            
            // Find order by CashBill order ID
            $order = Order::where('cashbill_order_id', $cashbillOrderId)->first();
            
            if ($order) {
                // Get updated payment details
                $result = $cashBillService->getPaymentDetails($cashbillOrderId);
                
                if ($result['success']) {
                    $order->status = $result['data']['status'];
                    
                    if ($result['data']['status'] === 'PositiveFinish') {
                        $order->paid_at = now();
                    }
                    
                    $order->save();

                    Log::info('Order status updated', [
                        'order_id' => $order->id,
                        'cashbill_order_id' => $cashbillOrderId,
                        'new_status' => $result['data']['status']
                    ]);
                }
            }
        }

        return response('OK', 200);
    }

    /**
     * Get all orders (for admin)
     */
    public function getOrders(Request $request)
    {
        $orders = Order::orderBy('created_at', 'desc')
            ->paginate($request->query('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }
}
