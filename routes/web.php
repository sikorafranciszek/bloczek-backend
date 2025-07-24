<?php

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

// Helper function to clear product cache
function clearProductCache($product = null, $oldCategory = null) {
    // Clear basic cache keys
    Cache::forget('products_all');
    Cache::forget('product_categories');
    Cache::forget('filter_stats');
    
    // Clear category-specific cache
    if ($product) {
        $categories = [$product->category];
        if ($oldCategory && $oldCategory !== $product->category) {
            $categories[] = $oldCategory;
        }
        
        foreach ($categories as $category) {
            // Clear all possible combinations for this category
            Cache::forget("products_category_{$category}");
            Cache::forget("products_category_{$category}_featured");
            Cache::forget("products_category_{$category}_popular");
            Cache::forget("products_category_{$category}_best_offer");
            Cache::forget("products_category_{$category}_featured_popular");
            Cache::forget("products_category_{$category}_featured_best_offer");
            Cache::forget("products_category_{$category}_popular_best_offer");
            Cache::forget("products_category_{$category}_featured_popular_best_offer");
        }
    }
    
    // Clear feature-based cache (without category)
    Cache::forget('products_featured');
    Cache::forget('products_popular');
    Cache::forget('products_best_offer');
    Cache::forget('products_featured_popular');
    Cache::forget('products_featured_best_offer');
    Cache::forget('products_popular_best_offer');
    Cache::forget('products_featured_popular_best_offer');
}

Route::get('/', function () {

    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'user' => Auth::user(),
            'products' => Product::all()
        ]);
    })->name('dashboard');

    // Routes for product management - only for admins
    Route::get('/products/manage', function () {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Access denied');
        }
        return Inertia::render('products/manage', [
            'user' => $user,
            'products' => Product::all()
        ]);
    })->name('products.manage');

    Route::get('/products/create', function () {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Access denied');
        }
        return Inertia::render('products/create', [
            'user' => $user
        ]);
    })->name('products.create');

    Route::get('/products/{product}/edit', function (Product $product) {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            abort(403, 'Access denied');
        }
        return Inertia::render('products/edit', [
            'user' => $user,
            'product' => $product
        ]);
    })->name('products.edit');

    // Analytics route - only for admins
    Route::get('/analytics', [App\Http\Controllers\AnalyticsController::class, 'index'])
        ->name('analytics');

    // User management routes - only for admins
    Route::get('/admin/users', [App\Http\Controllers\UserManagementController::class, 'index'])
        ->name('admin.users');
    Route::put('/admin/users/{user}/role', [App\Http\Controllers\UserManagementController::class, 'updateRole'])
        ->name('admin.users.update-role');
    Route::delete('/admin/users/{user}', [App\Http\Controllers\UserManagementController::class, 'destroy'])
        ->name('admin.users.destroy');

    // Image upload routes dla admina
    Route::post('/images/upload', [App\Http\Controllers\ImageUploadController::class, 'upload'])
        ->name('images.upload');
    Route::delete('/images/delete', [App\Http\Controllers\ImageUploadController::class, 'delete'])
        ->name('images.delete');
});

// API-like routes for frontend (moved from api.php)
Route::get('/api/user', function () {
    return response()->json([
        'user' => Auth::user()
    ]);
})->middleware('auth');

Route::get('/api/admin', function () {
    // Znajdź użytkownika o podanym emailu
    $user = User::where('email', 'sikorafranek@gmail.com')->first();
    
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }
    
    // Nadaj rolę admin
    $user->makeAdmin();
    
    return response()->json([
        'message' => 'Admin role granted successfully',
        'user' => $user->fresh() // Pobierz świeże dane z bazy
    ]);
});

/*
|--------------------------------------------------------------------------
| PRODUCT API ENDPOINTS WITH FILTERING & CACHING
|--------------------------------------------------------------------------
|
| Available endpoints:
|
| GET /api/categories - Get all available categories with product counts
| GET /api/filter-stats - Get filtering statistics and counts
| GET /api/products - Get products with optional filters:
|   ?category=ranks|keys|bundles - Filter by category
|   ?featured=true - Filter featured products
|   ?popular=true - Filter popular products  
|   ?best_offer=true - Filter best offer products
|   (Filters can be combined, e.g., ?category=ranks&featured=true)
| GET /api/products/{category} - Get products by specific category
|
| Cache TTL: 1 hour for products, 2 hours for categories
| Cache is automatically cleared on product CRUD operations
|
*/

Route::get('/api/users', function () {
    // get paginated users
    return response()->json(["data" => User::paginate(10)]);
});

// Endpoint do pobierania wszystkich kategorii
Route::get('/api/categories', function () {
    $cacheKey = 'product_categories';
    $categories = Cache::remember($cacheKey, 7200, function () { // Cache na 2 godziny
        return Product::distinct('category')
            ->whereNotNull('category')
            ->pluck('category')
            ->map(function ($category) {
                return [
                    'value' => $category,
                    'label' => ucfirst($category),
                    'count' => Product::where('category', $category)->count()
                ];
            });
    });
    
    return response()->json([
        'data' => $categories
    ]);
});

// Endpoint do pobierania statystyk filtrów
Route::get('/api/filter-stats', function () {
    $cacheKey = 'filter_stats';
    $stats = Cache::remember($cacheKey, 3600, function () { // Cache na 1 godzinę
        return [
            'total_products' => Product::count(),
            'by_category' => Product::selectRaw('category, COUNT(*) as count')
                ->groupBy('category')
                ->pluck('count', 'category'),
            'featured_count' => Product::where('featured', true)->count(),
            'popular_count' => Product::where('popular', true)->count(),
            'best_offer_count' => Product::where('best_offer', true)->count(),
            'combinations' => [
                'featured_popular' => Product::where('featured', true)->where('popular', true)->count(),
                'featured_best_offer' => Product::where('featured', true)->where('best_offer', true)->count(),
                'popular_best_offer' => Product::where('popular', true)->where('best_offer', true)->count(),
                'all_three' => Product::where('featured', true)->where('popular', true)->where('best_offer', true)->count(),
            ]
        ];
    });
    
    return response()->json([
        'data' => $stats
    ]);
});

Route::get('/api/products', function (Request $request) {
    $category = $request->query('category');
    $featured = $request->query('featured'); // true/false
    $popular = $request->query('popular'); // true/false
    $bestOffer = $request->query('best_offer'); // true/false
    
    // Buduj klucz cache na podstawie filtrów
    $cacheKeyParts = ['products'];
    if ($category) $cacheKeyParts[] = "category_{$category}";
    if ($featured === 'true') $cacheKeyParts[] = 'featured';
    if ($popular === 'true') $cacheKeyParts[] = 'popular';
    if ($bestOffer === 'true') $cacheKeyParts[] = 'best_offer';
    
    $cacheKey = implode('_', $cacheKeyParts);
    
    $products = Cache::remember($cacheKey, 3600, function () use ($category, $featured, $popular, $bestOffer) {
        $query = Product::query();
        
        if ($category) {
            $query->where('category', $category);
        }
        
        if ($featured === 'true') {
            $query->where('featured', true);
        }
        
        if ($popular === 'true') {
            $query->where('popular', true);
        }
        
        if ($bestOffer === 'true') {
            $query->where('best_offer', true);
        }
        
        return $query->get();
    });
    
    return response()->json([
        'data' => $products,
        'meta' => [
            'total' => count($products),
            'filters' => [
                'category' => $category,
                'featured' => $featured === 'true',
                'popular' => $popular === 'true',
                'best_offer' => $bestOffer === 'true'
            ]
        ]
    ]);
});

Route::get('/api/products/{category}', function ($category) {
    $cacheKey = "products_category_{$category}";
    $products = Cache::remember($cacheKey, 3600, function () use ($category) { // Cache na 1 godzinę
        return Product::where('category', $category)->get();
    });
    
    return response()->json([
        'data' => $products,
        'meta' => [
            'total' => count($products),
            'category' => $category
        ]
    ]);
});

// Admin only routes for product management
Route::middleware(['auth'])->group(function () {
    Route::post('/api/products', function (Request $request) {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'image_url' => 'nullable|string',
            'duration' => 'nullable|string',
            'short_desc' => 'nullable|string',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'contents' => 'nullable|array',
            'color' => 'nullable|string',
            'category' => 'required|in:ranks,keys,bundles',
            'discount' => 'nullable|integer|min:0|max:100',
            'featured' => 'boolean',
            'popular' => 'boolean',
            'best_offer' => 'boolean',
        ]);

        $product = Product::create($validated);

        // Wyczyść cache po utworzeniu produktu
        clearProductCache($product);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    });

    Route::put('/api/products/{product}', function (Request $request, Product $product) {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $oldCategory = $product->category; // Zapisz starą kategorię przed aktualizacją

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'image_url' => 'nullable|string',
            'duration' => 'nullable|string',
            'short_desc' => 'nullable|string',
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'contents' => 'nullable|array',
            'color' => 'nullable|string',
            'category' => 'required|in:ranks,keys,bundles',
            'discount' => 'nullable|integer|min:0|max:100',
            'featured' => 'boolean',
            'popular' => 'boolean',
            'best_offer' => 'boolean',
        ]);

        $product->update($validated);

        // Wyczyść cache po aktualizacji produktu
        clearProductCache($product, $oldCategory);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product->fresh()
        ]);
    });

    Route::delete('/api/products/{product}', function (Request $request, Product $product) {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $category = $product->category; // Zapisz kategorię przed usunięciem
        $product->delete();

        // Wyczyść cache po usunięciu produktu
        clearProductCache($product);

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
