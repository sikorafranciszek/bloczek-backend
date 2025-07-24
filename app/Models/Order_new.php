<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $fillable = [
        "cashbill_order_id", 
        "status", 
        "amount", 
        "currency", 
        "title", 
        "description", 
        "products", 
        "customer_data", 
        "payment_channel", 
        "additional_data", 
        "return_url", 
        "negative_return_url", 
        "redirect_url", 
        "paid_at"
    ];
    
    protected $casts = [
        "products" => "array", 
        "customer_data" => "array", 
        "amount" => "decimal:2", 
        "paid_at" => "datetime"
    ];

    public function isPaid(): bool
    {
        return $this->status === "PositiveFinish";
    }

    public function isFailed(): bool
    {
        return in_array($this->status, ["NegativeFinish", "Fraud", "Abort"]);
    }

    public function isPending(): bool
    {
        return in_array($this->status, ["PreStart", "Start", "PositiveAuthorization"]);
    }
}
