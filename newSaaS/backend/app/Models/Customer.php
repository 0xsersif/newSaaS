<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'name',
        'email',
        'phone',
        'address',
        'city',
        'postal_code',
        'country',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
