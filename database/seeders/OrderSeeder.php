<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing orders first
        Order::truncate();

        // Create orders from the last 30 days
        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::now()->subDays($i);
            $ordersCount = rand(0, 5); // Random number of orders per day
            
            for ($j = 0; $j < $ordersCount; $j++) {
                Order::create([
                    'cashbill_order_id' => 'CB_' . time() . '_' . $i . '_' . $j,
                    'status' => 'PositiveFinish',
                    'amount' => rand(20, 200),
                    'currency' => 'PLN',
                    'title' => 'Test Order #' . uniqid(),
                    'description' => 'Test order for analytics',
                    'products' => json_encode([
                        ['id' => 1, 'name' => 'Test Product', 'price' => rand(20, 200), 'quantity' => 1]
                    ]),
                    'customer_data' => json_encode([
                        'firstName' => 'Test',
                        'surname' => 'User',
                        'email' => 'test@example.com'
                    ]),
                    'return_url' => 'https://example.com/return',
                    'paid_at' => $date,
                    'created_at' => $date,
                    'updated_at' => $date
                ]);
            }
        }

        // Create some monthly data for the last 12 months
        for ($i = 1; $i <= 12; $i++) {
            $date = Carbon::now()->subMonths($i)->startOfMonth();
            $ordersCount = rand(10, 50); // Random number of orders per month
            
            for ($j = 0; $j < $ordersCount; $j++) {
                $orderDate = $date->copy()->addDays(rand(0, 28));
                Order::create([
                    'cashbill_order_id' => 'CB_HIST_' . time() . '_' . $i . '_' . $j,
                    'status' => 'PositiveFinish',
                    'amount' => rand(20, 300),
                    'currency' => 'PLN',
                    'title' => 'Historical Order #' . uniqid(),
                    'description' => 'Historical order for analytics',
                    'products' => json_encode([
                        ['id' => 1, 'name' => 'Historical Product', 'price' => rand(20, 300), 'quantity' => 1]
                    ]),
                    'customer_data' => json_encode([
                        'firstName' => 'Historical',
                        'surname' => 'User',
                        'email' => 'historical@example.com'
                    ]),
                    'return_url' => 'https://example.com/return',
                    'paid_at' => $orderDate,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate
                ]);
            }
        }

        echo "Created sample orders for analytics testing\n";
    }
}
