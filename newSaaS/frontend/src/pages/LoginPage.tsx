import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Store, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Connexion réussie', { description: 'Bienvenue sur CODShop' });
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Erreur', { description: err.response?.data?.message || 'Identifiants incorrects' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex" style={{ background: 'var(--bg-base)' }}>
      {/* Background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20 animate-spin-slow"
        style={{ background: 'var(--accent-cyan)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-20"
        style={{ background: 'var(--accent-purple)' }} />
      <div className="absolute inset-0 noise" />

      {/* Left side: Branding / Content (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 z-10 border-r border-white/5 bg-black/20 backdrop-blur-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--grad-cyan)' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight font-space-grotesk text-white">
            COD<span className="gradient-text">Shop</span>
          </span>
        </div>

        <div className="max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-4xl leading-tight font-bold text-white mb-6 font-space-grotesk">
              Le futur du <br />Cash on Delivery.
            </h1>
            <p className="text-lg text-gray-400 font-light mb-8 leading-relaxed">
              Gérez vos commandes WhatsApp, votre vitrine et votre équipe depuis un dashboard premium, ultra-rapide et conçu pour performer.
            </p>
            <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0d1117] bg-gray-800 flex items-center justify-center">
                    <Store className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
              <span>Rejoignez +10,000 marchands</span>
            </div>
          </motion.div>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          © 2026 CODShop Platform. Tous droits réservés.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Logo center for mobile only */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--grad-cyan)' }}>
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
            {/* Top glass reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="mb-8 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-white mb-2 font-space-grotesk">Bon retour</h2>
              <p className="text-sm text-gray-400">Connectez-vous pour accéder à votre espace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Adresse email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="contact@mon-store.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="label !mb-0">Mot de passe</label>
                  <Link to="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 mt-4"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Vous n'avez pas de compte ?{' '}
                <Link to="/register" className="text-white font-semibold hover:text-cyan-400 transition-colors">
                  Créer un store
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
