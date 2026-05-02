import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    BarChart3,
    Store,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/dashboard/products', label: 'Products', icon: Package },
    { path: '/dashboard/orders', label: 'Orders', icon: ShoppingCart },
    { path: '/dashboard/customers', label: 'Customers', icon: Users },
    { path: '/dashboard/stats', label: 'Statistics', icon: BarChart3 },
];

const DashboardLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch {
            // ignore
        }
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">CODShop</h1>
                        <p className="text-[11px] text-gray-400 -mt-0.5">SaaS Platform</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="px-3 py-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${isActive
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-[18px] h-[18px]" />
                                {item.label}
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80">
                    <div className="flex items-center gap-4 px-4 sm:px-6 py-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-600 hover:text-gray-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-2">
                            <span className="hidden sm:block text-sm text-gray-500">
                                {user?.role?.replace('_', ' ') || 'User'}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
