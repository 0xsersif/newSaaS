<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'duration_months',
        'storage_quota',
        'product_limit',
        'features',
        'is_active',
    ];

    protected $casts = [
        'features' => 'json',
        'is_active' => 'boolean',
    ];

    public function tenants(): HasMany
    {
        return $this->hasMany(Tenant::class);
    }
}
