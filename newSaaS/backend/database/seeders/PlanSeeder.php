<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::create([
            'name' => 'Starter',
            'slug' => 'starter',
            'description' => 'Perfect for beginners',
            'price' => 99,
            'duration_months' => 3,
            'storage_quota' => 5 * 1024 * 1024 * 1024, // 5GB
            'product_limit' => 100,
            'features' => [
                'Basic product management',
                'Order management',
                'Customer management',
                'Basic analytics',
                'SubDomain support',
            ],
            'is_active' => true,
        ]);

        Plan::create([
            'name' => 'Professional',
            'slug' => 'professional',
            'description' => 'For growing businesses',
            'price' => 199,
            'duration_months' => 6,
            'storage_quota' => 50 * 1024 * 1024 * 1024, // 50GB
            'product_limit' => 1000,
            'features' => [
                'Advanced product management',
                'Order management with automation',
                'Customer management',
                'Advanced analytics',
                'Custom domain support',
                'Priority support',
                'WhatsApp integration',
            ],
            'is_active' => true,
        ]);

        Plan::create([
            'name' => 'Enterprise',
            'slug' => 'enterprise',
            'description' => 'For large enterprises',
            'price' => 499,
            'duration_months' => 12,
            'storage_quota' => 500 * 1024 * 1024 * 1024, // 500GB
            'product_limit' => 10000,
            'features' => [
                'Unlimited product management',
                'Advanced order automation',
                'Dedicated customer support',
                'Custom analytics',
                'Multiple custom domains',
                '24/7 Priority support',
                'Custom API access',
                'Team management',
                'API webhooks',
            ],
            'is_active' => true,
        ]);
    }
}
