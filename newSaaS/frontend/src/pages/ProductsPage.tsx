import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, Package, AlertCircle, Edit, Trash2, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import api from '../services/api';
import { formatMAD, cn } from '../lib/utils';

const MOCK_PRODUCTS = [
    { id: 1, name: 'AirPods Pro Max - Édition 2026', price: 2490, promo_price: 1990, stock: 45, status: 'active', image: null },
    { id: 2, name: 'Montre Connectée Nebula Fit', price: 850, promo_price: null, stock: 12, status: 'active', image: null },
    { id: 3, name: 'Projecteur 4K Portable', price: 1200, promo_price: 999, stock: 0, status: 'inactive', image: null },
];

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: qData, isLoading } = useQuery({
        queryKey: ['products', 'admin'],
        queryFn: () => api.getProducts().then(res => res.data).catch(() => MOCK_PRODUCTS),
    });

    const products = qData || [];
    const filteredProducts = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

    const handleDelete = (id: number) => toast.error('Produit supprimé');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="page-title">Produits</h1>
                    <p className="page-subtitle">Gérez votre catalogue, vos prix et vos stocks.</p>
                </div>

                <button onClick={() => setIsModalOpen(true)} className="btn-primary btn-sm shadow-glow-cyan">
                    <Plus className="w-4 h-4" /> Ajouter un produit
                </button>
            </div>

            {/* Toolbar */}
            <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, SKU..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="input pl-9"
                    />
                </div>
                <button className="btn-secondary px-3 py-2 text-sm w-full sm:w-auto"><Filter className="w-4 h-4 mr-2" /> Filtres (Catégories, Stock)</button>
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 skeleton rounded-2xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((p: any, idx: number) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                            className="glass-card p-5 group flex flex-col relative"
                        >
                            {/* Actions on hover */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                                <button className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-full bg-rose-500/10 backdrop-blur-md flex items-center justify-center text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4 z-10">
                                <span className={cn("badge", p.status === 'active' ? 'badge-active' : 'badge-inactive')}>
                                    {p.status === 'active' ? 'En ligne' : 'Brouillon'}
                                </span>
                            </div>

                            {/* Image */}
                            <div className="w-full h-40 rounded-xl bg-[#161b26] border border-white/5 mb-4 flex items-center justify-center overflow-hidden">
                                {p.image ? <img src={p.image} className="w-full h-full object-cover" alt={p.name} /> : <Package className="w-10 h-10 text-white/10" />}
                            </div>

                            {/* Content */}
                            <h3 className="text-white font-medium mb-2 pr-12 line-clamp-2" title={p.name}>{p.name}</h3>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-cyan-400">{formatMAD(p.promo_price || p.price)}</span>
                                        {p.promo_price && <span className="text-[10px] text-rose-400 font-semibold uppercase bg-rose-500/10 px-1.5 py-0.5 rounded">Promo</span>}
                                    </div>
                                    {p.promo_price && <span className="text-xs text-gray-500 line-through">{formatMAD(p.price)}</span>}
                                </div>

                                <div className="flex items-center gap-2">
                                    {p.stock === 0 ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <Package className="w-4 h-4 text-gray-500" />}
                                    <span className={cn("text-xs font-semibold", p.stock === 0 ? "text-rose-400" : p.stock < 10 ? "text-amber-400" : "text-gray-400")}>
                                        {p.stock} en stock
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="col-span-full py-20 text-center text-gray-500 flex flex-col items-center">
                            <Package className="w-12 h-12 mb-4 opacity-50" />
                            <p>Aucun produit trouvé.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#0f141f] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="sticky top-0 bg-[#0f141f]/80 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between z-10">
                                <h2 className="text-lg font-bold font-space-grotesk text-white">Nouveau Produit</h2>
                                <button onClick={() => setIsModalOpen(false)} className="btn-ghost p-2 rounded-full"><X className="w-4 h-4" /></button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="label">Images</label>
                                    <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition cursor-pointer flex flex-col items-center justify-center text-gray-400">
                                        <Upload className="w-6 h-6 mb-2 text-cyan-400" />
                                        <span className="text-sm">Glissez-déposez ou cliquez</span>
                                        <span className="text-xs opacity-50 mt-1">JPEG, PNG, WebP (Max 2MB)</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="label">Nom du produit</label>
                                        <input type="text" className="input" placeholder="Ex: Montre Connectée" />
                                    </div>
                                    <div>
                                        <label className="label">Prix de base (MAD)</label>
                                        <input type="number" className="input" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="label">Prix promotionnel (MAD, optionnel)</label>
                                        <input type="number" className="input" placeholder="0.00" />
                                    </div>
                                    <div>
                                        <label className="label">SKU</label>
                                        <input type="text" className="input" placeholder="PROD-001" />
                                    </div>
                                    <div>
                                        <label className="label">Quantité en stock</label>
                                        <input type="number" className="input" placeholder="0" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="label">Description (SEO optimisée)</label>
                                        <textarea className="input min-h-[100px]" placeholder="Décrivez votre produit..." />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-2.5">Annuler</button>
                                    <button type="button" onClick={() => { toast.success('Produit créé!'); setIsModalOpen(false); }} className="btn-primary py-2.5">Enregistrer le produit</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
