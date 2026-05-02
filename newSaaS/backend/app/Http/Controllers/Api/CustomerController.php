<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $customers = Customer::where('tenant_id', $tenant->id)
            ->withCount('orders')
            ->paginate(20);

        return response()->json($customers);
    }

    public function show(Request $request, Customer $customer)
    {
        if ($customer->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($customer->load('orders'));
    }

    public function getCustomerOrders(Request $request, Customer $customer)
    {
        if ($customer->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $orders = $customer->orders()
            ->with('items.product')
            ->paginate(20);

        return response()->json($orders);
    }
}
