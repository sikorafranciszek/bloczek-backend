<?php

// Test script for Redis cache functionality

require_once 'vendor/autoload.php';

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

// Load Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== TESTING REDIS CACHE FUNCTIONALITY ===\n\n";

// 1. Check current cache keys
echo "1. Current cache keys before operations:\n";
Redis::connection('cache')->select(1);
$keys = Redis::connection('cache')->keys('*');
print_r($keys);
echo "\n";

// 2. Test cache remember for products_all
echo "2. Testing cache remember for products_all:\n";
$products = Cache::remember('products_all', 3600, function () {
    echo "   → Cache MISS - fetching from database\n";
    return \App\Models\Product::all();
});
echo "   → Fetched " . count($products) . " products\n\n";

// 3. Test cache remember for products_category_ranks
echo "3. Testing cache remember for products_category_ranks:\n";
$ranksProducts = Cache::remember('products_category_ranks', 3600, function () {
    echo "   → Cache MISS - fetching ranks from database\n";
    return \App\Models\Product::where('category', 'ranks')->get();
});
echo "   → Fetched " . count($ranksProducts) . " rank products\n\n";

// 4. Check cache keys after operations
echo "4. Cache keys after cache operations:\n";
$keys = Redis::connection('cache')->keys('*');
print_r($keys);
echo "\n";

// 5. Test cache retrieval (should be cache HIT)
echo "5. Testing cache retrieval (should be cache HIT):\n";
$cachedProducts = Cache::remember('products_all', 3600, function () {
    echo "   → This should NOT appear (cache should hit)\n";
    return \App\Models\Product::all();
});
echo "   → Retrieved " . count($cachedProducts) . " products from cache\n\n";

// 6. Test cache clearing
echo "6. Testing cache clearing:\n";
Cache::forget('products_all');
Cache::forget('products_category_ranks');
echo "   → Cache cleared\n\n";

// 7. Check cache keys after clearing
echo "7. Cache keys after clearing:\n";
$keys = Redis::connection('cache')->keys('*');
if (empty($keys)) {
    echo "   → Cache is empty (SUCCESS)\n";
} else {
    print_r($keys);
}

echo "\n=== TEST COMPLETED ===\n";
