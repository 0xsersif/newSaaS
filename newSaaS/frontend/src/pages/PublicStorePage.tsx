import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  promotional_price?: number;
  images: string[];
  stock_quantity: number;
  description: string;
}

export const PublicStorePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ productId: number; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load products from public API (not authenticated)
    // This would be a public endpoint
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // In production, this would be a public endpoint
      setLoading(false);
    } catch (error) {
      console.error('Failed to load products:', error);
      setLoading(false);
    }
  };

  const addToCart = (productId: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        const price = product.promotional_price || product.price;
        return total + price * item.quantity;
      }
      return total;
    }, 0);
  };

  const handleCheckout = async () => {
    // Generate WhatsApp link with order details
    const message = cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return `${product?.name} x${item.quantity}`;
      })
      .join('\n');

    const total = calculateTotal();
    const whatsappLink = `https://wa.me/?text=I want to order:%0A${encodeURIComponent(
      message
    )}%0ATotal: ${total} DH`;

    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Store</h1>
          <div className="text-sm text-gray-600">
            Cart ({cart.length} items)
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-6">Featured Products</h2>
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="bg-gray-200 h-40 rounded-t-lg" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        {product.promotional_price ? (
                          <>
                            <span className="text-2xl font-bold text-green-600">
                              {product.promotional_price} DH
                            </span>
                            <span className="text-sm text-gray-500 line-through ml-2">
                              {product.price} DH
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold">
                            {product.price} DH
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.stock_quantity} in stock
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={product.stock_quantity === 0}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const price = product.promotional_price || product.price;

                    return (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center pb-3 border-b"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x {price} DH
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {(price * item.quantity).toFixed(2)} DH
                          </p>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {calculateTotal().toFixed(2)} DH
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition"
                >
                  Order via WhatsApp
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicStorePage;
