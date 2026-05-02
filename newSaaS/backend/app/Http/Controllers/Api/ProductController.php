<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ProductService;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $products = Product::where('tenant_id', $tenant->id)
            ->with('category', 'variants')
            ->paginate(20);

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $tenant = $request->user()->tenant;

        if (!$tenant) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'required|numeric|min:0',
            'promotional_price' => 'sometimes|numeric|min:0',
            'sku' => 'sometimes|string|unique:products',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'sometimes|json',
        ]);

        $product = $this->productService->createProduct($tenant, $validated);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    public function show(Request $request, Product $product)
    {
        if ($product->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($product->load('category', 'variants'));
    }

    public function update(Request $request, Product $product)
    {
        if ($product->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'promotional_price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $product = $this->productService->updateProduct($product, $validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    public function destroy(Request $request, Product $product)
    {
        if ($product->tenant_id !== $request->user()->tenant_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
