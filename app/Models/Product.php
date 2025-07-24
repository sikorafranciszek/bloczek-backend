<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'original_price',
        'image_url',
        'duration',
        'short_desc',
        'description',
        'features',
        'contents',
        'color',
        'category',
        'discount',
        'featured',
        'popular',
        'best_offer',
    ];

    protected $casts = [
        'features' => 'array',
        'contents' => 'array',
        'price' => 'decimal:2',
        'original_price' => 'decimal:2',
        'featured' => 'boolean',
        'popular' => 'boolean',
        'best_offer' => 'boolean',
    ];
}
