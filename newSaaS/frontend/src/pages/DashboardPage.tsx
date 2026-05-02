import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Store,
} from 'lucide-react';

interface Stats {
    total_orders: number;
    total_products: number;
    total_customers: number;
    total_revenue: number;
    orders_today: number;
    pending_orders: number;
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [store, setStore] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasStore, setHasStore] = useState(true);
    const [creating, setCreating] = useState(false);
    const [plans, setPlans] = useState<any[]>([]);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const storeRes = await api.getStore();
            setStore(storeRes.store || storeRes.data || storeRes);
            setHasStore(true);

            try {
                const statsRes = await api.getTenantStats();
                setStats(statsRes.data || statsRes);
            } catch {
                // Stats not available yet
                setStats({
                    total_orders: 0,
                    total_products: 0,
                    total_customers: 0,
                    total_revenue: 0,
                    orders_today: 0,
                    pending_orders: 0,
                });
            }
        } catch {
            setHasStore(false);
            try {
                const plansRes = await api.getPlans();
                setPlans(Array.isArray(plansRes) ? plansRes : plansRes.data || []);
            } catch {
                setPlans([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStore = async (planId: number) => {
        setCreating(true);
        try {
            await api.createStore('My Store', planId);
            await loadData();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to create store');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    // No store — show create store flow
    if (!hasStore) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
                <p className="text-gray-500 mb-8">Create your first store to get started.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan: any) => (
                        <div
                            key={plan.id}
                            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
                        >
                            <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-3xl font-extrabold text-indigo-600 mt-2">
                                {plan.price} <span className="text-sm font-normal text-gray-500">MAD</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{plan.duration_months} months</p>
                            <ul className="mt-4 space-y-2 text-sm text-gray-600">
                                <li>✓ Up to {plan.max_products} products</li>
                                <li>✓ {plan.storage_limit_mb}MB storage</li>
                            </ul>
                            <button
                                onClick={() => handleCreateStore(plan.id)}
                                disabled={creating}
                                className="w-full mt-6 bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 transition"
                            >
                                {creating ? 'Creating...' : 'Select Plan'}
                            </button>
                        </div>
                    ))}
                    {plans.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-gray-500">
                            No plans available. Seed the database first.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Has store — show dashboard
    const statCards = [
        {
            label: 'Total Revenue',
            value: `${(stats?.total_revenue || 0).toLocaleString()} DH`,
            icon: DollarSign,
            color: 'from-emerald-500 to-teal-600',
            shadowColor: 'shadow-emerald-500/20',
        },
        {
            label: 'Total Orders',
            value: stats?.total_orders || 0,
            icon: ShoppingCart,
            color: 'from-blue-500 to-indigo-600',
            shadowColor: 'shadow-blue-500/20',
        },
        {
            label: 'Products',
            value: stats?.total_products || 0,
            icon: Package,
            color: 'from-violet-500 to-purple-600',
            shadowColor: 'shadow-violet-500/20',
        },
        {
            label: 'Customers',
            value: stats?.total_customers || 0,
            icon: Users,
            color: 'from-amber-500 to-orange-600',
            shadowColor: 'shadow-amber-500/20',
        },
    ];

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Here's what's happening with your store today.
                    </p>
                </div>
                {store && (
                    <div className="mt-3 sm:mt-0 flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
                        <Store className="w-4 h-4" />
                        {store.name || store.store_name || 'My Store'}
                    </div>
                )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.label}
                            className={`bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg ${card.shadowColor} transition-all duration-200`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                                <div
                                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}
                                >
                                    <Icon className="w-[18px] h-[18px] text-white" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Quick info cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Orders Today</p>
                                    <p className="text-xs text-gray-500">New orders received</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{stats?.orders_today || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Pending Orders</p>
                                    <p className="text-xs text-gray-500">Awaiting confirmation</p>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-gray-900">{stats?.pending_orders || 0}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate('/dashboard/products')}
                            className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition text-sm font-medium"
                        >
                            <Package className="w-4 h-4" />
                            Add Product
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/orders')}
                            className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition text-sm font-medium"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            View Orders
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/customers')}
                            className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition text-sm font-medium"
                        >
                            <Users className="w-4 h-4" />
                            Customers
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/stats')}
                            className="flex items-center gap-2 p-3 bg-violet-50 text-violet-700 rounded-lg hover:bg-violet-100 transition text-sm font-medium"
                        >
                            <TrendingUp className="w-4 h-4" />
                            Statistics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
