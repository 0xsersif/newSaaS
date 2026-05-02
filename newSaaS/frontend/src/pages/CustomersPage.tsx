import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, Search, Eye } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    phone: string;
    email?: string;
    city?: string;
    address?: string;
    total_orders?: number;
    created_at: string;
}

const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<any[]>([]);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const res = await api.getCustomers();
            const data = res.data || res.customers || res;
            setCustomers(Array.isArray(data) ? data : data?.data || []);
        } catch {
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    const viewCustomer = async (c: Customer) => {
        setSelected(c);
        try {
            const res = await api.getCustomerOrders(c.id);
            const data = res.data || res.orders || res;
            setCustomerOrders(Array.isArray(data) ? data : data?.data || []);
        } catch {
            setCustomerOrders([]);
        }
    };

    const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search)
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
                <p className="text-gray-500 text-sm mt-1">{customers.length} total customers</p>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search customers..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">No customers yet</h3>
                    <p className="text-sm text-gray-500 mt-1">Customers appear when orders are placed</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-indigo-200 transition-all duration-200 cursor-pointer"
                            onClick={() => viewCustomer(c)}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                    {c.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                                    <p className="text-xs text-gray-500">{c.phone}</p>
                                </div>
                                <Eye className="w-4 h-4 text-gray-300" />
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>{c.city || 'No city'}</span>
                                <span>Since {new Date(c.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Customer detail drawer */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setSelected(null)}>
                    <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b flex items-center justify-between">
                            <h2 className="text-lg font-semibold">{selected.name}</h2>
                            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Phone</p>
                                <p className="text-sm">{selected.phone}</p>
                            </div>
                            {selected.email && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                                    <p className="text-sm">{selected.email}</p>
                                </div>
                            )}
                            {selected.city && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">City</p>
                                    <p className="text-sm">{selected.city}</p>
                                </div>
                            )}
                            {selected.address && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Address</p>
                                    <p className="text-sm">{selected.address}</p>
                                </div>
                            )}

                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Orders ({customerOrders.length})
                                </h3>
                                {customerOrders.length === 0 ? (
                                    <p className="text-sm text-gray-500">No orders yet</p>
                                ) : (
                                    <div className="space-y-2">
                                        {customerOrders.map((o: any) => (
                                            <div key={o.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium">#{o.id}</p>
                                                    <p className="text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold">{o.total_amount} DH</p>
                                                    <p className="text-xs text-gray-500">{o.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersPage;
