import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Search, ChevronRight, Zap, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { formatMAD } from '../lib/utils';
import QuickOrderForm from '../components/QuickOrderForm';

export default function PublicStorePage() {
  const { slug } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // In a real multi-tenant setup, we'd fetch store by slug/domain. 
  // Using generic endpoints for demo.
  const { data: store, isLoading: storeLoading, isError } = useQuery({
    queryKey: ['public-store', slug],
    queryFn: () => slug ? api.getPublicStore(slug) : { data: { name: 'Demo Store', theme: 'horizon', whatsapp: '+212600000000' } },
    retry: false
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['public-products', slug],
    queryFn: () => api.getPublicProducts(slug || 'demo').catch(() => ({ data: MOCK_PRODUCTS })),
  });

  const isLoading = storeLoading || productsLoading;
  const storeData = store?.data || store;
  const productList = products?.data || products || [];

  const filteredProducts = productList.filter((p: any) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isError) {
    return (
      <div className="min-h-screen bg-[#080b11] flex flex-col items-center justify-center pt-20 pb-10 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Store Introuvable</h1>
        <p className="text-gray-400">Cette boutique CODShop n'existe pas ou n'est plus disponible.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b11] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-[#080b11]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {isLoading ? (
            <div className="w-32 h-6 skeleton" />
          ) : (
            <h1 className="font-space-grotesk text-xl font-bold">
              {storeData?.name || 'Store'}
            </h1>
          )}

          <div className="hidden sm:flex relative max-w-sm w-full ml-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm focus:border-cyan-400 focus:bg-white/10 outline-none transition"
            />
          </div>

          <button className="sm:hidden btn-ghost p-2"><Search className="w-5 h-5" /></button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden py-16 sm:py-24 border-b border-white/5">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-20 bg-cyan-500 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-6 border border-cyan-500/20">
              <Zap className="w-3.5 h-3.5" /> Fast Delivery
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-space-grotesk tracking-tight">
              {isLoading ? <div className="h-12 w-64 skeleton mx-auto" /> : 'Les meilleures offres'}
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base sm:text-lg">
              Découvrez notre sélection de produits de haute qualité. Payez à la livraison, partout au Maroc.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h3 className="text-xl font-semibold mb-8 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-cyan-400" /> Nouveautés
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[3/4] skeleton rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Aucun produit trouvé pour "{searchQuery}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((p: any, idx: number) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer flex flex-col"
                onClick={() => setSelectedProduct(p)}
              >
                <div className="relative aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden bg-[#161b26] mb-4 border border-white/5 group-hover:border-white/15 transition-colors">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                      <ShoppingBag className="w-10 h-10 text-white/20" />
                    </div>
                  )}
                  {p.promo_price && (
                    <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                      Promo
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-sm sm:text-base text-gray-200 line-clamp-2 group-hover:text-white transition-colors">{p.name}</h4>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <span className="font-semibold text-cyan-400">{formatMAD(p.promo_price || p.price)}</span>
                  {p.promo_price && (
                    <span className="text-xs text-gray-500 line-through">{formatMAD(p.price)}</span>
                  )}
                </div>

                {/* Mobile action indicator */}
                <div className="mt-3 flex items-center justify-center p-2 rounded-xl bg-white/5 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors sm:hidden text-xs font-medium">
                  Commander
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-12 bg-black/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-500">
          <p>© 2026 {storeData?.name || 'Store'}. Tous droits réservés.</p>
          <p className="mt-2 flex items-center justify-center gap-1 opacity-70">
            Propulsé par <Link to="/" className="font-bold flex items-center gap-1 hover:text-cyan-400 transition"><Zap className="w-3 h-3" />CODShop</Link>
          </p>
        </div>
      </footer>

      {/* Order Modal */}
      {selectedProduct && (
        <QuickOrderForm
          product={selectedProduct}
          storeWhatsNumber={storeData?.whatsapp || '+212600000000'}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

// Fallback Mock Data if API fails
const MOCK_PRODUCTS = [
  { id: 1, name: 'AirPods Pro Max - Édition 2026', price: 2490, promo_price: 1990 },
  { id: 2, name: 'Montre Connectée Nebula Fit', price: 850, promo_price: null },
  { id: 3, name: 'Projecteur 4K Portable', price: 1200, promo_price: 999 },
  { id: 4, name: 'SSD Externe 2TB UltraSpeed', price: 1500, promo_price: 1350 },
  { id: 5, name: 'Enceinte Bluetooth Chroma', price: 600, promo_price: null },
  { id: 6, name: 'Clavier Mécanique RGB Pro', price: 950, promo_price: 799 },
];
