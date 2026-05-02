<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\Plan;
use App\Models\User;

class TenantService
{
    public function createStore(User $owner, array $data): Tenant
    {
        $plan = Plan::find($data['plan_id']);

        $tenant = Tenant::create([
            'name' => $data['store_name'],
            'slug' => str_slug($data['store_name']),
            'owner_id' => $owner->id,
            'domain' => 'store-' . uniqid() . '.saas.local',
            'plan_id' => $plan->id,
            'status' => 'active',
            'subscription_end_date' => now()->addMonths($plan->duration_months),
            'storage_quota' => $plan->storage_quota,
            'product_limit' => $plan->product_limit,
        ]);

        $owner->update([
            'tenant_id' => $tenant->id,
            'role' => 'STORE_OWNER',
        ]);

        return $tenant;
    }

    public function updateStore(Tenant $tenant, array $data): Tenant
    {
        $tenant->update($data);

        return $tenant;
    }

    public function connectCustomDomain(Tenant $tenant, string $domain): Tenant
    {
        $tenant->update(['custom_domain' => $domain]);

        return $tenant;
    }

    public function canAddProduct(Tenant $tenant): bool
    {
        $productCount = $tenant->products()->count();

        return $productCount < $tenant->product_limit;
    }

    public function isSubscriptionActive(Tenant $tenant): bool
    {
        return $tenant->isActive();
    }

    public function renewSubscription(Tenant $tenant, int $months): Tenant
    {
        $currentEndDate = $tenant->subscription_end_date ?? now();
        
        $tenant->update([
            'subscription_end_date' => $currentEndDate->addMonths($months),
            'status' => 'active',
        ]);

        return $tenant;
    }
}
