import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, MoreHorizontal, MessageCircle, MapPin, Phone, Package, LayoutGrid, List as ListIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { formatDate, formatMAD, getOrderStatusConfig, buildWhatsAppLink, cn } from '../lib/utils';
import { toast } from 'sonner';

// Fallback Mock Data
const MOCK_ORDERS = [
    { id: 'ORD-2026-001', customer: { name: 'Amine Benali', phone: '0612345678', city: 'Casablanca' }, items: [{ name: 'AirPods Pro Max', qty: 1 }], total: 1990, status: 'new', created_at: new Date().toISOString() },
    { id: 'ORD-2026-002', customer: { name: 'Sara Majid', phone: '0688776655', city: 'Rabat' }, items: [{ name: 'Montre Connectée', qty: 2 }], total: 1700, status: 'confirmed', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'ORD-2026-003', customer: { name: 'Youssef Tariq', phone: '0655443322', city: 'Tanger' }, items: [{ name: 'SSD Externe 2TB', qty: 1 }], total: 1350, status: 'shipped', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
    const [view, setView] = useState<'list' | 'kanban'>('list');
    const [search, setSearch] = useState('');

    const { data: qData, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: () => api.getOrders().then(res => res.data).catch(() => MOCK_ORDERS),
    });

    const orders = qData || [];

    const handleUpdateStatus = (id: string, newStatus: string) => {
        toast.success(`Commande ${id} passée en ${newStatus}`);
        // api.updateOrder(id, { status: newStatus }) ...
    };

    const handleContactCustomer = (phone: string, name: string) => {
        const msg = `Bonjour ${name}, nous vous contactons concernant votre commande CODShop.`;
        window.open(buildWhatsAppLink(phone, msg), '_blank');
    };

    const filteredOrders = orders.filter((o: any) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.phone.includes(search)
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="page-title">Commandes</h1>
                    <p className="page-subtitle">Gérez vos expéditions et suivis clients.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn-secondary btn-sm"><Download className="w-4 h-4" /> Exporter</button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Rechercher par ID, nom, tel..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="input pl-9"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button className="btn-secondary px-3 py-2 text-sm w-full sm:w-auto"><Filter className="w-4 h-4 mr-2" /> Filtres</button>

                    <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
                        <button onClick={() => setView('list')} className={cn("p-1.5 rounded transition", view === 'list' ? 'bg-white/10 text-cyan-400' : 'text-gray-500 hover:text-white')}>
                            <ListIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setView('kanban')} className={cn("p-1.5 rounded transition", view === 'kanban' ? 'bg-white/10 text-cyan-400' : 'text-gray-500 hover:text-white')}>
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="h-[400px] skeleton rounded-2xl" />
            ) : view === 'list' ? (
                /* List View */
                <div className="table-wrapper">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr>
                                    <th>Commande</th>
                                    <th>Date</th>
                                    <th>Client</th>
                                    <th>Produits</th>
                                    <th>Total</th>
                                    <th>Statut</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center py-12 text-gray-500">Aucune commande trouvée.</td></tr>
                                ) : filteredOrders.map((order: any) => {
                                    const statusConf = getOrderStatusConfig(order.status);
                                    return (
                                        <tr key={order.id}>
                                            <td className="font-semibold text-white whitespace-nowrap">{order.id}</td>
                                            <td className="text-gray-400 text-sm whitespace-nowrap">{formatDate(order.created_at)}</td>
                                            <td>
                                                <div className="text-white font-medium">{order.customer.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" /> {order.customer.phone}</div>
                                            </td>
                                            <td>
                                                <div className="text-sm">
                                                    {order.items[0].name} {order.items.length > 1 && <span className="text-gray-500 text-xs">(+{order.items.length - 1})</span>}
                                                </div>
                                            </td>
                                            <td className="font-semibold text-cyan-400 whitespace-nowrap">{formatMAD(order.total)}</td>
                                            <td>
                                                <span className={cn("badge", statusConf.badge)}>{statusConf.label}</span>
                                            </td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleContactCustomer(order.customer.phone, order.customer.name)} className="btn-ghost p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-md transition" title="Contacter">
                                                        <MessageCircle className="w-4 h-4" />
                                                    </button>
                                                    <button className="btn-ghost p-1.5 text-gray-400 border border-white/10 rounded-md hover:bg-white/5 transition">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Kanban View */
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                    {STATUSES.map(status => {
                        const statusConf = getOrderStatusConfig(status);
                        const columnOrders = filteredOrders.filter((o: any) => o.status === status);
                        return (
                            <div key={status} className="flex-none w-[320px] snap-center">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("w-2 h-2 rounded-full", statusConf.dot)} />
                                        <h3 className="font-space-grotesk font-bold text-white text-sm">{statusConf.label}</h3>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{columnOrders.length}</span>
                                </div>

                                <div className="space-y-3 min-h-[100px]">
                                    {columnOrders.map((order: any) => (
                                        <motion.div
                                            key={order.id}
                                            layoutId={order.id}
                                            className="glass-card p-4 cursor-pointer hover:border-cyan-500/30"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <span className="text-xs font-bold text-cyan-400">{order.id}</span>
                                                <span className="text-[10px] text-gray-500">{formatDate(order.created_at, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>

                                            <div className="mb-3">
                                                <p className="font-medium text-white text-sm">{order.customer.name}</p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {order.customer.city}</p>
                                            </div>

                                            <div className="flex justify-between items-end border-t border-white/5 pt-3 mt-3">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                    <Package className="w-3.5 h-3.5" />
                                                    <span className="truncate max-w-[120px]">{order.items[0].name}</span>
                                                </div>
                                                <span className="font-semibold text-white text-sm">{formatMAD(order.total)}</span>
                                            </div>

                                            {/* Quick Move actions */}
                                            <div className="flex items-center gap-2 mt-4">
                                                {status === 'new' && <button onClick={() => handleUpdateStatus(order.id, 'confirmed')} className="btn-sm flex-1 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 text-xs">Confirmer</button>}
                                                {status === 'confirmed' && <button onClick={() => handleUpdateStatus(order.id, 'shipped')} className="btn-sm flex-1 bg-white/5 hover:bg-amber-500/20 hover:text-amber-400 text-xs">Expédier</button>}
                                                {status === 'shipped' && <button onClick={() => handleUpdateStatus(order.id, 'delivered')} className="btn-sm flex-1 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-xs">Livrer</button>}
                                                <button onClick={() => handleContactCustomer(order.customer.phone, order.customer.name)} className="btn-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 p-1.5" title="WhatsApp"><Phone className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {columnOrders.length === 0 && (
                                        <div className="h-24 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-xs text-gray-500 bg-white/[0.01]">
                                            Glissez ici
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
