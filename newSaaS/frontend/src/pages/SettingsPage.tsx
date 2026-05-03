import { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Globe, MessageCircle, CreditCard, Save, Palette, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [whatsapp, setWhatsapp] = useState('+212600000000');
    const [domain, setDomain] = useState('');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Paramètres sauvegardés avec succès.');
    };

    const tabs = [
        { id: 'general', label: 'Store', icon: Store },
        { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
        { id: 'theme', label: 'Thème', icon: Palette },
        { id: 'domain', label: 'Domaine', icon: Globe },
        { id: 'billing', label: 'Abonnement', icon: CreditCard },
    ];

    const plans = [
        { name: 'Starter', price: '99', features: ['50 Produits', '1 GB Stockage', 'Sous-domaine gratuit'] },
        { name: 'Professional', price: '199', features: ['500 Produits', '10 GB Stockage', 'Domaine Personnalisé (1)'], popular: true },
        { name: 'Enterprise', price: 'Sur devis', features: ['Produits Illimités', '50 GB Stockage', 'Domaines multiples'] },
    ];

    return (
        <div className="space-y-6 max-w-5xl">
            <div>
                <h1 className="page-title">Paramètres</h1>
                <p className="page-subtitle">Configurez votre boutique, votre domaine et votre abonnement.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Nav */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" /> {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 glass-card p-6 sm:p-8 min-h-[500px]">
                    <form onSubmit={handleSave}>
                        {activeTab === 'general' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Informations de la boutique</h2>
                                    <p className="text-sm text-gray-400 mb-6">Ces informations sont publiques sur votre vitrine.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="sm:col-span-2">
                                        <label className="label">Nom de la boutique</label>
                                        <input type="text" className="input" defaultValue="Mon Super Store" />
                                    </div>
                                    <div>
                                        <label className="label">Devise par défaut</label>
                                        <input type="text" className="input bg-white/5" disabled value="Dirham Marocain (MAD)" />
                                    </div>
                                    <div>
                                        <label className="label">Email de contact</label>
                                        <input type="email" className="input" defaultValue="contact@mon-store.com" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="label">Meta Description (SEO)</label>
                                        <textarea className="input min-h-[80px]" defaultValue="Le meilleur store COD au Maroc." />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'whatsapp' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Configuration WhatsApp</h2>
                                    <p className="text-sm text-gray-400 mb-6">Où recevrez-vous les commandes ?</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="label">Numéro WhatsApp (avec indicatif)</label>
                                        <div className="relative">
                                            <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                            <input type="tel" className="input pl-10 border-emerald-500/30 focus:border-emerald-400 focus:ring-emerald-400/20" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="label">Message pré-rempli (Template)</label>
                                        <textarea className="input min-h-[120px] font-mono text-xs" defaultValue="Bonjour, je voudrais commander:
- Produit: {product_name}
- Variante: {variant}
- Quantité: {qty}
Mon nom: {name}
Mon adresse: {address}" />
                                        <p className="text-xs text-gray-500 mt-2">Utilisez les variables `{"{product_name}"}`, `{"{qty}"}`, `{"{name}"}`, `{"{address}"}`.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'theme' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Thème & Apparence</h2>
                                    <p className="text-sm text-gray-400 mb-6">Personnalisez le look de votre vitrine.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {['Horizon', 'Bolt', 'Bloom'].map((theme, idx) => (
                                        <div key={theme} className={`relative p-4 rounded-xl border cursor-pointer transition ${idx === 0 ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}>
                                            {idx === 0 && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-cyan-400" />}
                                            <div className="w-full h-24 rounded-lg bg-[#0f141f] border border-white/5 mb-3 flex flex-col justify-between p-2">
                                                <div className="w-full h-3 rounded bg-white/10" />
                                                <div className="w-2/3 h-2 rounded bg-cyan-500/50" />
                                            </div>
                                            <h3 className="font-semibold text-white text-sm text-center">{theme}</h3>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'domain' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Domaine Personnalisé</h2>
                                    <p className="text-sm text-gray-400 mb-6">Connectez votre propre nom de domaine.</p>
                                </div>

                                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex gap-4">
                                    <AlertCircle className="w-6 h-6 text-indigo-400 shrink-0" />
                                    <div>
                                        <h4 className="text-indigo-400 font-semibold mb-1">Actuellement via Sous-domaine</h4>
                                        <p className="text-sm text-indigo-200/70">Votre boutique est accessible sur: <a href="#" className="font-medium underline hover:text-indigo-300">mon-super-store.codshop.ma</a></p>
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Connecter un domaine (ex: mon-store.com)</label>
                                    <div className="flex gap-2">
                                        <input type="text" className="input" placeholder="mon-store.com" value={domain} onChange={e => setDomain(e.target.value)} />
                                        <button type="button" className="btn-secondary px-6 shrink-0"><LinkIcon className="w-4 h-4 mr-2" /> Connecter</button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-3">Une fois ajouté, vous devrez configurer un enregistrement A pointant vers `104.21.15.55` dans votre zone DNS.</p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'billing' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-bold text-white mb-1">Abonnement & Facturation</h2>
                                    <p className="text-sm text-gray-400 mb-6">Gérez votre plan actuel.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {plans.map(plan => (
                                        <div key={plan.name} className={`relative rounded-2xl p-6 border ${plan.popular ? 'border-cyan-500 bg-cyan-500/5 shadow-[0_0_24px_rgba(6,182,212,0.15)]' : 'border-white/10 bg-white/[0.02]'}`}>
                                            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Actuel</div>}
                                            <h3 className="font-space-grotesk font-bold text-lg text-white mb-2">{plan.name}</h3>
                                            <div className="mb-6">
                                                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">{plan.price}</span>
                                                {plan.price !== 'Sur devis' && <span className="text-gray-500 text-sm"> MAD/mo</span>}
                                            </div>
                                            <ul className="space-y-3 mb-8">
                                                {plan.features.map(f => (
                                                    <li key={f} className="text-sm text-gray-300 flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button type="button" className={`btn w-full py-2.5 ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>
                                                {plan.popular ? 'Gérer' : 'Mettre à niveau'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Sticky Save Button for all tabs except billing */}
                        {activeTab !== 'billing' && (
                            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                                <button type="submit" className="btn-primary py-2.5 px-6 shadow-glow-cyan">
                                    <Save className="w-4 h-4" /> Enregistrer les modifications
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
