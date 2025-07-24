<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CashBillService
{
    private string $shopId;
    private string $secretKey;
    private string $baseUrl;
    private bool $testMode;

    public function __construct()
    {
        $this->shopId = config('services.cashbill.shop_id');
        $this->secretKey = config('services.cashbill.secret_key');
        $this->testMode = config('services.cashbill.test_mode', false);
        $this->baseUrl = $this->testMode 
            ? 'https://pay.cashbill.pl/testws/rest'
            : 'https://pay.cashbill.pl/ws/rest';
    }

    /**
     * Create new payment transaction
     */
    public function createPayment(array $paymentData): array
    {
        // Generate signature for payment creation
        $signature = $this->generatePaymentSignature($paymentData);
        $paymentData['sign'] = $signature;

        $url = "{$this->baseUrl}/payment/{$this->shopId}";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json'
            ])->post($url, $paymentData);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            } else {
                return [
                    'success' => false,
                    'error' => $response->json()['errorMessage'] ?? 'Unknown error',
                    'status_code' => $response->status()
                ];
            }
        } catch (\Exception $e) {
            Log::error('CashBill payment creation failed', [
                'error' => $e->getMessage(),
                'payment_data' => $paymentData
            ]);

            return [
                'success' => false,
                'error' => 'Payment service unavailable'
            ];
        }
    }

    /**
     * Get payment details
     */
    public function getPaymentDetails(string $orderId): array
    {
        $signature = sha1($orderId . $this->secretKey);
        $url = "{$this->baseUrl}/payment/{$this->shopId}/{$orderId}?sign={$signature}";

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json'
            ])->get($url);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            } else {
                return [
                    'success' => false,
                    'error' => $response->json()['errorMessage'] ?? 'Unknown error',
                    'status_code' => $response->status()
                ];
            }
        } catch (\Exception $e) {
            Log::error('CashBill payment details fetch failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId
            ]);

            return [
                'success' => false,
                'error' => 'Payment service unavailable'
            ];
        }
    }

    /**
     * Update payment return URLs
     */
    public function updatePaymentUrls(string $orderId, string $returnUrl, ?string $negativeReturnUrl = null): array
    {
        $signature = sha1($orderId . $returnUrl . ($negativeReturnUrl ?? '') . $this->secretKey);
        
        $data = [
            'returnUrl' => $returnUrl,
            'sign' => $signature
        ];

        if ($negativeReturnUrl) {
            $data['negativeReturnUrl'] = $negativeReturnUrl;
        }

        $url = "{$this->baseUrl}/payment/{$this->shopId}/{$orderId}";

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json'
            ])->put($url, $data);

            if ($response->status() === 204) {
                return ['success' => true];
            } else {
                return [
                    'success' => false,
                    'error' => $response->json()['errorMessage'] ?? 'Unknown error',
                    'status_code' => $response->status()
                ];
            }
        } catch (\Exception $e) {
            Log::error('CashBill payment URL update failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId
            ]);

            return [
                'success' => false,
                'error' => 'Payment service unavailable'
            ];
        }
    }

    /**
     * Get available payment channels
     */
    public function getPaymentChannels(string $languageCode = 'PL'): array
    {
        $url = "{$this->baseUrl}/paymentchannels/{$this->shopId}/{$languageCode}";

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json'
            ])->get($url);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'data' => $response->json()
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Failed to fetch payment channels',
                    'status_code' => $response->status()
                ];
            }
        } catch (\Exception $e) {
            Log::error('CashBill payment channels fetch failed', [
                'error' => $e->getMessage(),
                'language' => $languageCode
            ]);

            return [
                'success' => false,
                'error' => 'Payment service unavailable'
            ];
        }
    }

    /**
     * Verify notification signature
     */
    public function verifyNotification(string $cmd, string $args, string $signature): bool
    {
        $expectedSignature = md5($cmd . $args . $this->secretKey);
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Generate signature for payment creation
     */
    private function generatePaymentSignature(array $paymentData): string
    {
        $signatureString = '';
        
        // Required fields for signature generation (in specific order)
        $signatureString .= $paymentData['title'] ?? '';
        $signatureString .= $paymentData['amount']['value'] ?? '';
        $signatureString .= $paymentData['amount']['currencyCode'] ?? '';
        $signatureString .= $paymentData['returnUrl'] ?? '';
        $signatureString .= $paymentData['description'] ?? '';
        $signatureString .= $paymentData['negativeReturnUrl'] ?? '';
        $signatureString .= $paymentData['additionalData'] ?? '';
        $signatureString .= $paymentData['paymentChannel'] ?? '';
        $signatureString .= $paymentData['languageCode'] ?? '';
        $signatureString .= $paymentData['referer'] ?? '';
        
        // Personal data fields
        if (isset($paymentData['personalData'])) {
            $personalData = $paymentData['personalData'];
            $signatureString .= $personalData['firstName'] ?? '';
            $signatureString .= $personalData['surname'] ?? '';
            $signatureString .= $personalData['email'] ?? '';
            $signatureString .= $personalData['country'] ?? '';
            $signatureString .= $personalData['city'] ?? '';
            $signatureString .= $personalData['postcode'] ?? '';
            $signatureString .= $personalData['street'] ?? '';
            $signatureString .= $personalData['house'] ?? '';
            $signatureString .= $personalData['flat'] ?? '';
            $signatureString .= $personalData['ip'] ?? '';
        }
        
        // Options key-value pairs
        if (isset($paymentData['options']) && is_array($paymentData['options'])) {
            foreach ($paymentData['options'] as $option) {
                $signatureString .= $option['name'] ?? '';
                $signatureString .= $option['value'] ?? '';
            }
        }
        
        // Add secret key at the end
        $signatureString .= $this->secretKey;
        
        return sha1($signatureString);
    }
}
