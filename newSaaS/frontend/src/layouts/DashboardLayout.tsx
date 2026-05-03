import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { getInitials } from '../lib/utils';
import {
    LayoutDashboard, Package, ShoppingCart, Users,
    BarChart3, Settings, LogOut, Menu, X,
    ChevronRight, Zap, Bell, Search,
} from 'lucide-react';

const NAV = [
    { path: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
    { path: '/dashboard/products', label: 'Produits', icon: Package },
    { path: '/dashboard/orders', label: 'Commandes', icon: ShoppingCart },
    { path: '/dashboard/customers', label: 'Clients', icon: Users },
    { path: '/dashboard/stats', label: 'Statistiques', icon: BarChart3 },
];

const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
};

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try { await logout(); } catch { }
        navigate('/login');
    };

    const Sidebar = () => (
        <aside
            className="fixed top-0 left-0 z-40 h-screen w-64 flex flex-col"
            style={{
                background: 'rgba(8,11,17,0.97)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="relative">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)' }}
                    >
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="dot-active absolute -top-0.5 -right-0.5" />
                </div>
                <div>
                    <h1 className="text-[15px] font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        COD<span className="gradient-text">Shop</span>
                    </h1>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>SaaS Platform</p>
                </div>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="ml-auto lg:hidden btn-ghost p-1.5 rounded-lg"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    Navigation
                </p>
                {NAV.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="w-[17px] h-[17px] flex-shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                        </Link>
                    );
                })}

                <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                        Configuration
                    </p>
                    <Link
                        to="/dashboard/settings"
                        onClick={() => setSidebarOpen(false)}
                        className="sidebar-item"
                    >
                        <Settings className="w-[17px] h-[17px]" />
                        Paramètres
                    </Link>
                </div>
            </nav>

            {/* User area */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}
                    >
                        {user?.name ? getInitials(user.name) : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{user?.name}</p>
                        <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.role?.replace('_', ' ')}</p>
                    </div>
                    <button onClick={handleLogout} className="btn-ghost p-1.5 rounded-lg" title="Déconnexion">
                        <LogOut className="w-4 h-4 text-rose-400" />
                    </button>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
            {/* Mobile overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-30 lg:hidden"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        className="lg:hidden"
                        variants={sidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        <Sidebar />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="lg:ml-64 flex flex-col min-h-screen">
                {/* Topbar */}
                <header
                    className="sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 h-14"
                    style={{
                        background: 'rgba(8,11,17,0.8)',
                        backdropFilter: 'blur(16px)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden btn-ghost p-2 rounded-lg"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Breadcrumb or search */}
                    <div className="flex-1 flex items-center gap-3">
                        <div
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                color: 'var(--text-muted)',
                            }}
                        >
                            <Search className="w-3.5 h-3.5" />
                            <span className="text-[12.5px]">Rechercher...</span>
                            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/10">⌘K</kbd>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Notification bell */}
                        <button className="btn-ghost p-2 rounded-lg relative">
                            <Bell className="w-4.5 h-4.5" style={{ width: '17px', height: '17px' }} />
                            <span
                                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                                style={{ background: 'var(--accent-cyan)', boxShadow: '0 0 6px var(--accent-cyan)' }}
                            />
                        </button>

                        {/* Avatar */}
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}
                        >
                            {user?.name ? getInitials(user.name) : 'U'}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
