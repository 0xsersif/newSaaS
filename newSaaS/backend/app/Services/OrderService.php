<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Tenant;
use App\Models\Customer;
use App\Models\Product;

class OrderService
{
    public function createOrder(Tenant $tenant, array $data): Order
    {
        $customer = Customer::firstOrCreate(
            [
                'tenant_id' => $tenant->id,
                'phone' => $data['customer_phone'],
            ],
            [
                'name' => $data['customer_name'],
                'email' => $data['customer_email'] ?? null,
                'address' => $data['customer_address'] ?? null,
                'city' => $data['customer_city'] ?? null,
            ]
        );

        $totalAmount = 0;
        $items = $data['items'] ?? [];

        $order = Order::create([
            'tenant_id' => $tenant->id,
            'customer_id' => $customer->id,
            'order_number' => $this->generateOrderNumber(),
            'total_amount' => 0,
            'status' => 'new',
            'payment_method' => $data['payment_method'] ?? 'whatsapp',
            'notes' => $data['notes'] ?? null,
        ]);

        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            $quantity = $item['quantity'];
            $unitPrice = $item['unit_price'] ?? $product->promotional_price ?? $product->price;
            $subtotal = $unitPrice * $quantity;

            $order->items()->create([
                'product_id' => $product->id,
                'variant_id' => $item['variant_id'] ?? null,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $subtotal,
            ]);

            $totalAmount += $subtotal;
        }

        $order->update(['total_amount' => $totalAmount]);

        return $order;
    }

    public function updateOrderStatus(Order $order, string $status): Order
    {
        $statusUpdates = [
            'confirmed' => 'confirmed_at',
            'shipped' => 'shipped_at',
            'delivered' => 'delivered_at',
            'cancelled' => 'cancelled_at',
        ];

        $data = ['status' => $status];

        if (isset($statusUpdates[$status])) {
            $data[$statusUpdates[$status]] = now();
        }

        $order->update($data);

        return $order;
    }

    public function getOrdersByTenant(Tenant $tenant, array $filters = [])
    {
        $query = Order::where('tenant_id', $tenant->id);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (isset($filters['from_date'])) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }

        if (isset($filters['to_date'])) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }

        return $query->with('customer', 'items.product')->paginate(20);
    }

    private function generateOrderNumber(): string
    {
        return 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }
}
