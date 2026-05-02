import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
    BarChart3,
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Package,
    Users,
    ArrowUpRight,
} from 'lucide-react';

const StatsPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await api.getTenantStats();
            setStats(res.data || res);
        } catch {
            setStats(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No statistics available</h3>
                <p className="text-sm text-gray-500 mt-1">Create a store and start selling to see your stats</p>
            </div>
        );
    }

    const metrics = [
        { label: 'Total Revenue', value: `${(stats.total_revenue || 0).toLocaleString()} DH`, icon: DollarSign, color: 'from-emerald-500 to-teal-600' },
        { label: 'Total Orders', value: stats.total_orders || 0, icon: ShoppingCart, color: 'from-blue-500 to-indigo-600' },
        { label: 'Total Products', value: stats.total_products || 0, icon: Package, color: 'from-violet-500 to-purple-600' },
        { label: 'Total Customers', value: stats.total_customers || 0, icon: Users, color: 'from-amber-500 to-orange-600' },
        { label: 'Orders Today', value: stats.orders_today || 0, icon: TrendingUp, color: 'from-cyan-500 to-blue-600' },
        { label: 'Pending Orders', value: stats.pending_orders || 0, icon: ArrowUpRight, color: 'from-rose-500 to-pink-600' },
        { label: 'Avg. Order Value', value: `${(stats.average_order_value || 0).toFixed(0)} DH`, icon: BarChart3, color: 'from-lime-500 to-green-600' },
        { label: 'Conversion Rate', value: `${(stats.conversion_rate || 0).toFixed(1)}%`, icon: TrendingUp, color: 'from-fuchsia-500 to-purple-600' },
    ];

    const ordersByStatus = stats.orders_by_status || {};
    const topProducts = stats.top_products || [];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
                <p className="text-gray-500 text-sm mt-1">Your store performance at a glance</p>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {metrics.map((m) => {
                    const Icon = m.icon;
                    return (
                        <div key={m.label} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition">
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${m.color} flex items-center justify-center mb-3`}>
                                <Icon className="w-[18px] h-[18px] text-white" />
                            </div>
                            <p className="text-xl font-bold text-gray-900">{m.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders by status */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
                    {Object.keys(ordersByStatus).length === 0 ? (
                        <p className="text-sm text-gray-500">No data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(ordersByStatus).map(([status, count]) => {
                                const total = Object.values(ordersByStatus).reduce(
                                    (a: number, b: any) => a + Number(b),
                                    0
                                );
                                const pct = total ? ((Number(count) / total) * 100).toFixed(0) : 0;
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium text-gray-700 capitalize">{status}</span>
                                            <span className="text-gray-500">{String(count)} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-indigo-500 rounded-full h-2 transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Top products */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                    {topProducts.length === 0 ? (
                        <p className="text-sm text-gray-500">No data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {topProducts.slice(0, 5).map((p: any, i: number) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600">{p.total_sold || p.count || 0} sold</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
