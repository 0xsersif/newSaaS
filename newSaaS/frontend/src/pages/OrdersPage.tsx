import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShoppingCart, Eye, Search, Filter } from 'lucide-react';

interface Order {
    id: number;
    customer_name: string;
    customer_phone: string;
    status: string;
    total_amount: number;
    created_at: string;
    items?: any[];
}

const statusColors: Record<string, string> = {
    new: 'bg-blue-50 text-blue-700',
    confirmed: 'bg-indigo-50 text-indigo-700',
    shipped: 'bg-purple-50 text-purple-700',
    delivered: 'bg-emerald-50 text-emerald-700',
    cancelled: 'bg-red-50 text-red-700',
    returned: 'bg-gray-100 text-gray-700',
};

const statusOptions = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'];

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrders();
    }, [filterStatus]);

    const loadOrders = async () => {
        try {
            const filters: any = {};
            if (filterStatus) filters.status = filterStatus;
            const res = await api.getOrders(filters);
            const data = res.data || res.orders || res;
            setOrders(Array.isArray(data) ? data : data?.data || []);
        } catch {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: number, status: string) => {
        try {
            await api.updateOrderStatus(orderId, status);
            await loadOrders();
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update status');
        }
    };

    const filtered = orders.filter((o) =>
        (o.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
        String(o.id).includes(search)
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or order #..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                    >
                        <option value="">All statuses</option>
                        {statusOptions.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders table */}
            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">No orders</h3>
                    <p className="text-sm text-gray-500 mt-1">Orders will appear here when customers place them</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-5 py-4 text-sm font-medium text-gray-900">#{o.id}</td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-gray-900">{o.customer_name}</p>
                                            <p className="text-xs text-gray-500">{o.customer_phone}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateStatus(o.id, e.target.value)}
                                                className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 ${statusColors[o.status] || 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {statusOptions.map((s) => (
                                                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                                            {o.total_amount} DH
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {new Date(o.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(o)}
                                                className="text-gray-400 hover:text-indigo-600 p-1.5 rounded transition"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order detail drawer */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Order #{selectedOrder.id}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Customer</p>
                                <p className="text-sm font-medium">{selectedOrder.customer_name}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.customer_phone}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status] || 'bg-gray-100'}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Total</p>
                                <p className="text-xl font-bold text-emerald-600">{selectedOrder.total_amount} DH</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Date</p>
                                <p className="text-sm">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
