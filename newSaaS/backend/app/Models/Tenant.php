<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'owner_id',
        'domain',
        'custom_domain',
        'plan_id',
        'status',
        'subscription_end_date',
        'storage_quota',
        'product_limit',
    ];

    protected $casts = [
        'subscription_end_date' => 'datetime',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function customers(): HasMany
    {
        return $this->hasMany(Customer::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }

    public function isActive()
    {
        return $this->status === 'active' && 
               ($this->subscription_end_date === null || $this->subscription_end_date->isFuture());
    }

    public function storageUsed()
    {
        return $this->products()->sum('image_size') ?? 0;
    }
}
