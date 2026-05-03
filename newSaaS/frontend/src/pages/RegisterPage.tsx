import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Store, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  // Form Data
  const [data, setData] = useState({
    name: '', email: '', phone: '', password: '',
    storeName: '', slug: '', theme: 'Horizon'
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) return nextStep();

    setIsLoading(true);
    try {
      // Typically: await register(data);
      // We simulate a fast response to show UX
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Boutique créée avec succès 🎉', { description: 'Bienvenue sur CODShop !' });
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Erreur', { description: err.response?.data?.message || 'Impossible de créer le compte' });
    } finally {
      setIsLoading(false);
    }
  };

  const themes = [
    { id: 'Horizon', desc: 'Minimal & Clean. Idéal mode.' },
    { id: 'Bolt', desc: 'Sombre & High-tech. Pour l\'électronique.' },
    { id: 'Bloom', desc: 'Chaud & Naturel. Beauté/Santé.' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex" style={{ background: 'var(--bg-base)' }}>
      {/* Dynamic Background */}
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[70vw] h-[70vw] lg:w-[40vw] lg:h-[40vw] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: step === 1 ? 'var(--accent-purple)' : step === 2 ? 'var(--accent-cyan)' : 'var(--accent-emerald)', transition: 'background 1s ease' }} />
      <div className="absolute inset-0 noise pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8">

        {/* Header */}
        <div className="w-full max-w-lg flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--grad-primary)' }}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-space-grotesk text-center">
            {step === 1 && 'Créez votre compte'}
            {step === 2 && 'Maquettez votre boutique'}
            {step === 3 && 'Sélectionnez un thème'}
          </h1>
          <p className="text-gray-400 mt-2 text-center text-sm sm:text-base">
            {step === 1 && 'Commencez à vendre en ligne en quelques étapes.'}
            {step === 2 && 'Donnez une identité à votre futur empire COD.'}
            {step === 3 && 'Le design compte. Changez-le à tout moment plus tard.'}
          </p>
        </div>

        {/* Steps Card */}
        <div className="w-full max-w-lg glass-card relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
            <div className="h-full bg-cyan-400 transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          <div className="p-6 sm:p-10">
            <form onSubmit={handleRegister}>
              <AnimatePresence mode="wait">

                {/* STEP 1: Account */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div>
                      <label className="label">Nom complet</label>
                      <input required type="text" className="input" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Amine Benali" />
                    </div>
                    <div>
                      <label className="label">Numéro de téléphone</label>
                      <input required type="tel" className="input" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} placeholder="06..." />
                    </div>
                    <div>
                      <label className="label">Email de connexion</label>
                      <input required type="email" className="input" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} placeholder="amine@gmail.com" />
                    </div>
                    <div>
                      <label className="label">Mot de passe</label>
                      <input required type="password" className="input" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} placeholder="••••••••" />
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Store Info */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 flex gap-3 text-sm text-cyan-200">
                      <Store className="w-5 h-5 shrink-0 text-cyan-400" />
                      <p>Votre boutique sera immédiatement disponible sous un sous-domaine gratuit CODShop.</p>
                    </div>

                    <div>
                      <label className="label">Nom de la boutique</label>
                      <input required type="text" className="input" value={data.storeName} onChange={e => setData({ ...data, storeName: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="Ex: Casablanca Deals" />
                    </div>
                    <div>
                      <label className="label">Lien de la boutique (Slug)</label>
                      <div className="flex border border-white/10 rounded-md overflow-hidden bg-white/[0.02]">
                        <span className="px-4 py-2.5 bg-white/5 text-gray-500 text-sm border-r border-white/10 flex items-center justify-center">https://</span>
                        <input required type="text" className="flex-1 bg-transparent border-none text-white px-3 py-2.5 text-sm outline-none" value={data.slug} onChange={e => setData({ ...data, slug: e.target.value })} placeholder="casablanca-deals" />
                        <span className="px-4 py-2.5 bg-white/5 text-gray-500 text-sm border-l border-white/10 flex items-center justify-center">.codshop.ma</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Theme */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                    <div className="grid gap-3">
                      {themes.map(t => (
                        <div
                          key={t.id}
                          onClick={() => setData({ ...data, theme: t.id })}
                          className={`relative p-4 rounded-xl border cursor-pointer transition flex items-center gap-4 ${data.theme === t.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-white/[0.02] hover:border-white/20'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${data.theme === t.id ? 'border-cyan-400' : 'border-gray-500'}`}>
                            {data.theme === t.id && <motion.div layoutId="check" className="w-2.5 h-2.5 rounded-full bg-cyan-400" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base font-space-grotesk">{t.id}</h4>
                            <p className="text-xs text-gray-400">{t.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Form Navigation */}
              <div className="mt-8 flex items-center justify-between">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="btn-ghost flex items-center text-gray-400 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-1.5" /> Retour
                  </button>
                ) : <div />}

                <button type="submit" disabled={isLoading} className="btn-primary py-2.5 px-6 group flex items-center mx-auto sm:mx-0">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-4" />
                  ) : step === 3 ? (
                    "Lancer ma boutique 🚀"
                  ) : (
                    <>Suivant <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Vous avez déjà un store ?{' '}
          <Link to="/login" className="text-white hover:text-cyan-400 font-medium transition-colors">
            Connectez-vous
          </Link>
        </div>

      </div>
    </div>
  );
}
