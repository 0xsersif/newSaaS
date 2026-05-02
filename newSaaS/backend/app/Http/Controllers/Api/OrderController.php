<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\OrderService;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $filters = $request->only(['status', 'customer_id', 'from_date', 'to_date']);

        $orders = $this->orderService->getOrdersByTenant($tenant, $filters);

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'sometimes|email',
            'customer_phone' => 'required|string',
            'customer_address' => 'sometimes|string',
            'customer_city' => 'sometimes|string',
            'payment_method' => 'sometimes|in:whatsapp,form,phone_call',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'sometimes|numeric|min:0',
            'notes' => 'sometimes|string',
        ]);

        $order = $this->orderService->createOrder($tenant, $validated);

        // Generate WhatsApp message if payment method is WhatsApp
        if ($validated['payment_method'] === 'whatsapp' || !isset($validated['payment_method'])) {
            $whatsappMessage = $this->generateWhatsAppMessage($order);
            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items.product'),
                'whatsapp_url' => $whatsappMessage,
            ], 201);
        }

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items.product'),
        ], 201);
    }

    public function show(Request $request, Order $order)
    {
        if ($order->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order->load('customer', 'items.product'));
    }

    public function updateStatus(Request $request, Order $order)
    {
        if ($order->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:confirmed,shipped,delivered,cancelled,returned',
        ]);

        $order = $this->orderService->updateOrderStatus($order, $validated['status']);

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order,
        ]);
    }

    private function generateWhatsAppMessage(Order $order): string
    {
        $message = "Hello, I would like to confirm my order:\n";
        
        foreach ($order->items as $item) {
            $message .= "\n- {$item->product->name}: {$item->quantity} x " . number_format($item->unit_price, 2) . " DH";
        }

        $message .= "\n\nTotal: " . number_format($order->total_amount, 2) . " DH";
        $message .= "\nDelivery to: {$order->customer->city}";

        return "https://wa.me/" . preg_replace('/[^0-9]/', '', $order->customer->phone) . "?text=" . urlencode($message);
    }
}
