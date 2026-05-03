import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    DollarSign, ShoppingCart, Package, Users,
    TrendingUp, Activity, Inbox, ArrowUpRight
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatMAD, cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

const mockChartData = [
    { name: '10 Mai', revenue: 4000, orders: 24 },
    { name: '11 Mai', revenue: 3000, orders: 18 },
    { name: '12 Mai', revenue: 5000, orders: 35 },
    { name: '13 Mai', revenue: 2780, orders: 15 },
    { name: '14 Mai', revenue: 6890, orders: 48 },
    { name: '15 Mai', revenue: 4390, orders: 28 },
    { name: '16 Mai', revenue: 8490, orders: 55 },
];

export default function DashboardPage() {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const { data: storeInfo, isLoading: storeLoading } = useQuery({
        queryKey: ['store', 'current'],
        queryFn: () => api.getStore().then(res => res.data || res.store || res),
        retry: false,
    });

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['stats', 'tenant'],
        queryFn: () => api.getTenantStats().then(res => res.data || res),
        enabled: !!storeInfo,
    });

    const isLoading = storeLoading || statsLoading;

    // -- Show onboarding if no store --
    if (!storeLoading && !storeInfo) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                    <Package className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 font-space-grotesk">Commencez l'aventure</h2>
                <p className="text-gray-400 mb-8 text-lg">
                    Bienvenue {user?.name}. Créez votre store CODShop en 2 minutes et commencez à vendre sur WhatsApp.
                </p>
                <Link to="/dashboard/settings" className="btn-primary btn-lg shadow-glow-cyan">
                    Créer mon store
                    <ArrowUpRight className="w-5 h-5 ml-1" />
                </Link>
            </div>
        );
    }

    // -- KPI Cards --
    const kpis = [
        { title: 'Chiffre d\'Affaires', value: stats?.total_revenue ? formatMAD(stats.total_revenue) : formatMAD(34500), icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        { title: 'Commandes', value: stats?.total_orders || '248', icon: ShoppingCart, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { title: 'Produits Actifs', value: stats?.total_products || '42', icon: Package, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { title: 'Clients', value: stats?.total_customers || '1,024', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    ];

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="page-title">Tableau de Bord</h1>
                    <p className="page-subtitle">Bienvenue sur l'espace admin de {storeInfo?.name || 'votre store'}.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/dashboard/orders')} className="btn-secondary btn-sm">
                        <Inbox className="w-4 h-4" /> Voir commandes
                    </button>
                    <button className="btn-primary btn-sm" onClick={() => navigate('/dashboard/products')}>
                        + Nouveau produit
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={kpi.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="stat-card group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-medium text-gray-400">{kpi.title}</span>
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center transition-colors", kpi.bg)}>
                                <kpi.icon className={cn("w-4.5 h-4.5", kpi.color)} />
                            </div>
                        </div>
                        {isLoading ? (
                            <div className="h-8 w-1/2 skeleton" />
                        ) : (
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{kpi.value}</h3>
                                <span className="text-xs font-medium text-emerald-400 flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded">
                                    <TrendingUp className="w-3 h-3 mr-1" /> +12%
                                </span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Charts section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-2 glass-card p-5 sm:p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-semibold text-white">Revenus (7 derniers jours)</h3>
                            <p className="text-xs text-gray-400">Évolution du CA sur la semaine.</p>
                        </div>
                        <Activity className="w-5 h-5 text-cyan-400/50" />
                    </div>

                    <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.2)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(22,27,38,0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px',
                                        backdropFilter: 'blur(8px)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#06b6d4', fontWeight: 600 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Orders / Secondary */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="glass-card p-5 sm:p-6 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base font-semibold text-white">Accès Rapide</h3>
                            <p className="text-xs text-gray-400">Actions courantes</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        {[
                            { label: 'Nouvelles commandes', value: '12 à traiter', bg: 'bg-indigo-500/10', color: 'text-indigo-400' },
                            { label: 'Produits en rupture', value: '3 produits', bg: 'bg-rose-500/10', color: 'text-rose-400' },
                            { label: 'Clients VIP', value: '45 clients', bg: 'bg-amber-500/10', color: 'text-amber-400' },
                        ].map(item => (
                            <div key={item.label} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition cursor-pointer flex items-center justify-between group">
                                <div>
                                    <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition">{item.label}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.value}</p>
                                </div>
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", item.bg)}>
                                    <ArrowUpRight className={cn("w-4 h-4", item.color)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
