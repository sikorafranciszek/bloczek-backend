# Payment API Documentation

API do obsługi płatności dla sklepu Next.js przez CashBill.

## Base URL
```
https://your-laravel-app.com/api/payment
```

## Endpoints

### 1. Get Payment Channels
Pobiera dostępne kanały płatności.

```http
GET /api/payment/channels?language=PL
```

**Parameters:**
- `language` (optional): Kod języka (PL, EN), domyślnie PL

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "availableCurrencies": ["PLN"],
      "name": "string", 
      "description": "string",
      "logoUrl": "string"
    }
  ]
}
```

### 2. Create Payment
Tworzy nową płatność.

```http
POST /api/payment/create
```

**Request Body:**
```json
{
  "products": [
    {
      "id": 1,
      "quantity": 1
    }
  ],
  "customer_data": {
    "firstName": "Jan",
    "surname": "Kowalski", 
    "email": "jan@example.com",
    "country": "PL",
    "city": "Warszawa",
    "postcode": "00-001",
    "street": "Marszałkowska",
    "house": "1",
    "flat": "1"
  },
  "return_url": "https://your-nextjs-shop.com/payment/success",
  "negative_return_url": "https://your-nextjs-shop.com/payment/failed",
  "payment_channel": "optional_channel_id",
  "language_code": "PL"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "cashbill_order_id": "cb_order_123",
    "redirect_url": "https://pay.cashbill.pl/...",
    "total_amount": 29.99,
    "products": [
      {
        "id": 1,
        "name": "VIP Rank",
        "price": 29.99,
        "quantity": 1,
        "subtotal": 29.99,
        "image_url": "https://..."
      }
    ]
  }
}
```

### 3. Get Payment Status
Sprawdza status płatności.

```http
GET /api/payment/status/{orderId}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": 123,
    "cashbill_order_id": "cb_order_123",
    "status": "PositiveFinish",
    "status_name": "Płatność zakończona pomyślnie",
    "amount": 29.99,
    "currency": "PLN",
    "products": [...],
    "paid_at": "2025-07-24T12:00:00Z",
    "is_paid": true,
    "is_failed": false,
    "is_pending": false
  }
}
```

### 4. Payment Notification Webhook
Endpoint dla powiadomień z CashBill (konfigurować w panelu CashBill).

```http
GET /api/payment/notification?cmd=transactionStatusChanged&args=order_id&sign=signature
```

## Payment Statuses

- `PreStart` - Płatność rozpoczęta, klient nie wybrał jeszcze kanału płatności
- `Start` - Płatność rozpoczęta, klient nie zapłacił jeszcze
- `NegativeAuthorization` - Kanał płatności odrzucił płatność
- `Abort` - Klient anulował płatność
- `Fraud` - Płatność uznana za oszustwo (status końcowy)
- `PositiveAuthorization` - Kanał płatności zaakceptował transakcję do realizacji
- `PositiveFinish` - Płatność potwierdzona (status końcowy)
- `NegativeFinish` - Płatność nieudana (status końcowy)

## Example Usage in Next.js

```typescript
// types/payment.ts
export interface Product {
  id: number;
  quantity: number;
}

export interface CustomerData {
  firstName: string;
  surname: string;
  email: string;
  country?: string;
  city?: string;
  postcode?: string;
  street?: string;
  house?: string;
  flat?: string;
}

export interface CreatePaymentRequest {
  products: Product[];
  customer_data: CustomerData;
  return_url: string;
  negative_return_url?: string;
  payment_channel?: string;
  language_code?: 'PL' | 'EN';
}

// services/paymentService.ts
const API_BASE = 'https://your-laravel-app.com/api/payment';

export const paymentService = {
  async getPaymentChannels(language = 'PL') {
    const response = await fetch(`${API_BASE}/channels?language=${language}`);
    return response.json();
  },

  async createPayment(data: CreatePaymentRequest) {
    const response = await fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async getPaymentStatus(orderId: string) {
    const response = await fetch(`${API_BASE}/status/${orderId}`);
    return response.json();
  },
};

// Example usage in component
export default function CheckoutPage() {
  const handlePayment = async () => {
    try {
      const result = await paymentService.createPayment({
        products: [{ id: 1, quantity: 1 }],
        customer_data: {
          firstName: 'Jan',
          surname: 'Kowalski',
          email: 'jan@example.com',
        },
        return_url: 'https://yoursite.com/payment/success',
        negative_return_url: 'https://yoursite.com/payment/failed',
      });

      if (result.success) {
        // Redirect to CashBill payment page
        window.location.href = result.data.redirect_url;
      }
    } catch (error) {
      console.error('Payment creation failed:', error);
    }
  };

  return (
    <button onClick={handlePayment}>
      Zapłać
    </button>
  );
}
```

## Configuration

W pliku `.env` Laravel dodaj:

```env
CASHBILL_SHOP_ID=your_shop_id
CASHBILL_SECRET_KEY=your_secret_key
CASHBILL_TEST_MODE=true
```

## Webhook Configuration

W panelu CashBill ustaw URL powiadomień na:
```
https://your-laravel-app.com/api/payment/notification
```
