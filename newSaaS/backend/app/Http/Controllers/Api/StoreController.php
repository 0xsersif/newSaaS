<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TenantService;
use App\Models\Plan;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    protected $tenantService;

    public function __construct(TenantService $tenantService)
    {
        $this->tenantService = $tenantService;
    }

    public function getPlans()
    {
        $plans = Plan::where('is_active', true)->get();

        return response()->json($plans);
    }

    public function createStore(Request $request)
    {
        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'plan_id' => 'required|exists:plans,id',
        ]);

        $tenant = $this->tenantService->createStore($request->user(), $validated);

        return response()->json([
            'message' => 'Store created successfully',
            'store' => $tenant,
        ], 201);
    }

    public function getStore(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        return response()->json($tenant);
    }

    public function updateStore(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'custom_domain' => 'sometimes|string|unique:tenants,custom_domain,' . $tenant->id,
        ]);

        $tenant = $this->tenantService->updateStore($tenant, $validated);

        return response()->json([
            'message' => 'Store updated successfully',
            'store' => $tenant,
        ]);
    }

    public function connectCustomDomain(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $validated = $request->validate([
            'custom_domain' => 'required|string|unique:tenants,custom_domain',
        ]);

        // In production, verify domain ownership via DNS or HTTP verification
        $tenant = $this->tenantService->connectCustomDomain($tenant, $validated['custom_domain']);

        return response()->json([
            'message' => 'Custom domain connected successfully',
            'store' => $tenant,
        ]);
    }

    public function renewSubscription(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Store not found'], 404);
        }

        $validated = $request->validate([
            'months' => 'required|integer|in:3,6,12',
        ]);

        // In production, process payment here
        $tenant = $this->tenantService->renewSubscription($tenant, $validated['months']);

        return response()->json([
            'message' => 'Subscription renewed successfully',
            'store' => $tenant,
        ]);
    }
}
