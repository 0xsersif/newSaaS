<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Tenant;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    public function createProduct(Tenant $tenant, array $data): Product
    {
        $product = Product::create([
            'tenant_id' => $tenant->id,
            'category_id' => $data['category_id'],
            'name' => $data['name'],
            'slug' => str_slug($data['name']),
            'description' => $data['description'] ?? null,
            'price' => $data['price'],
            'promotional_price' => $data['promotional_price'] ?? null,
            'sku' => $data['sku'] ?? null,
            'stock_quantity' => $data['stock_quantity'] ?? 0,
            'images' => $data['images'] ?? [],
            'is_active' => $data['is_active'] ?? true,
        ]);

        return $product;
    }

    public function updateProduct(Product $product, array $data): Product
    {
        $product->update($data);

        return $product;
    }

    public function getProductsByTenant(Tenant $tenant): Collection
    {
        return Product::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->get();
    }

    public function updateStock(Product $product, int $quantity): Product
    {
        $product->update(['stock_quantity' => $quantity]);

        return $product;
    }

    public function decreaseStock(Product $product, int $quantity): bool
    {
        if ($product->stock_quantity < $quantity) {
            return false;
        }

        $product->update([
            'stock_quantity' => $product->stock_quantity - $quantity,
        ]);

        return true;
    }
}
