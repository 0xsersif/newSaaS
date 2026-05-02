import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Package, Plus, Pencil, Trash2, X, Search } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    promotional_price?: number;
    stock_quantity: number;
    category_id?: number;
    is_active: boolean;
}

const ProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        promotional_price: '',
        stock_quantity: '',
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await api.getProducts();
            const data = res.data || res.products || res;
            setProducts(Array.isArray(data) ? data : data?.data || []);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({ name: '', description: '', price: '', promotional_price: '', stock_quantity: '' });
        setShowForm(true);
    };

    const openEdit = (p: Product) => {
        setEditing(p);
        setFormData({
            name: p.name,
            description: p.description || '',
            price: String(p.price),
            promotional_price: p.promotional_price ? String(p.promotional_price) : '',
            stock_quantity: String(p.stock_quantity),
        });
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                promotional_price: formData.promotional_price ? parseFloat(formData.promotional_price) : null,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
            };

            if (editing) {
                await api.updateProduct(editing.id, payload);
            } else {
                await api.createProduct(payload);
            }
            setShowForm(false);
            await loadProducts();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            await api.deleteProduct(id);
            await loadProducts();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete');
        }
    };

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
                </div>
                <button
                    onClick={openCreate}
                    className="mt-3 sm:mt-0 inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
            </div>

            {/* Product table */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">No products yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Add your first product to get started</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{p.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            {p.promotional_price ? (
                                                <div>
                                                    <span className="text-sm font-semibold text-emerald-600">{p.promotional_price} DH</span>
                                                    <span className="text-xs text-gray-400 line-through ml-2">{p.price} DH</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm font-semibold text-gray-900">{p.price} DH</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.stock_quantity > 10
                                                        ? 'bg-emerald-50 text-emerald-700'
                                                        : p.stock_quantity > 0
                                                            ? 'bg-amber-50 text-amber-700'
                                                            : 'bg-red-50 text-red-700'
                                                    }`}
                                            >
                                                {p.stock_quantity} in stock
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => openEdit(p)}
                                                className="text-gray-400 hover:text-indigo-600 p-1.5 rounded transition"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="text-gray-400 hover:text-red-600 p-1.5 rounded transition ml-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editing ? 'Edit Product' : 'New Product'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (DH)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Promo Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.promotional_price}
                                        onChange={(e) => setFormData({ ...formData, promotional_price: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        placeholder="Optional"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    value={formData.stock_quantity}
                                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition"
                                >
                                    {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
