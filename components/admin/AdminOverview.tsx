import React from 'react';
import { Order, EquipmentItem, Profile } from '../../types';
import ScrollReveal from '../ScrollReveal';
import StatCard from '../StatCard';
import { getStatusColor } from '../../lib/utils';
import {
    DollarSign,
    Clock,
    Package,
    Users,
    ShoppingCart
} from 'lucide-react';

interface AdminOverviewProps {
    orders: Order[];
    products: EquipmentItem[];
    profiles: Profile[];
    onViewOrders: () => void;
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ orders, products, profiles, onViewOrders }) => {
    // Stats
    const activeOrders = orders.filter(o => o.status !== 'Rechazado' && o.status !== 'Cancelado');
    const totalRevenue = activeOrders.reduce((acc, order) => acc + (order.financials?.amountPaid || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'Pendiente de Aprobación').length;
    const totalProducts = products.length;
    const totalUsers = profiles.length;

    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-primary-600 rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Resumen Global</h2>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Inteligencia de Negocio y Métricas Élites</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ScrollReveal delay={0.1}>
                    <StatCard
                        title="Ventas Totales"
                        value={`$${totalRevenue.toLocaleString()}`}
                        icon={<DollarSign className="w-6 h-6" />}
                        color="emerald"
                        trend="+18.4% este mes"
                    />
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                    <StatCard
                        title="Pedidos Críticos"
                        value={pendingOrders.toString()}
                        icon={<Clock className={`w-6 h-6 ${pendingOrders > 0 ? 'animate-pulse' : ''}`} />}
                        color="amber"
                        trend={pendingOrders > 0 ? "Acción inmediata" : "Sincronizado"}
                    />
                </ScrollReveal>
                <ScrollReveal delay={0.3}>
                    <StatCard
                        title="Catálogo Activo"
                        value={totalProducts.toString()}
                        icon={<Package className="w-6 h-6" />}
                        color="blue"
                        trend="Equipos Premium"
                    />
                </ScrollReveal>
                <ScrollReveal delay={0.4}>
                    <StatCard
                        title="Comunidad SAGFO"
                        value={totalUsers.toString()}
                        icon={<Users className="w-6 h-6" />}
                        color="violet"
                        trend="Clientes Elite"
                    />
                </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-neutral-200 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Flujo de Ingresos</h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest italic">Últimos 7 pedidos procesados</p>
                        </div>
                    </div>

                    <div className="h-48 w-full relative flex items-end gap-2 group/chart">
                        {orders.slice(0, 7).reverse().map((o) => {
                            const val = o.financials?.totalOrderValue || 0;
                            // Ensure max is at least 1 to avoid division by zero
                            const max = Math.max(...orders.slice(0, 7).map(x => x.financials?.totalOrderValue || 0), 1);
                            const height = (val / max) * 100;
                            return (
                                <div key={o.id} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-primary-600/20 group-hover:bg-primary-600 rounded-t-xl transition-all duration-700 relative overflow-hidden"
                                        style={{ height: `${Math.max(height, 10)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary-600 to-transparent opacity-0 group-hover:opacity-40 transition-opacity" />
                                    </div>
                                    <span className="text-[8px] font-black text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase italic tracking-tighter truncate w-full text-center">
                                        #{o.id.slice(-4)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-neutral-200 dark:border-white/5 shadow-sm">
                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-8">Actividad Reciente</h3>
                    <div className="space-y-6">
                        {orders.slice(0, 4).map(order => (
                            <div key={order.id} className="group flex items-start justify-between gap-4 transition-all hover:translate-x-1 outline-none">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary-600/10 transition-colors">
                                        <ShoppingCart className="w-6 h-6 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="font-black text-neutral-900 dark:text-white uppercase italic text-sm tracking-tighter leading-none mb-1">Pedido #{order.id.slice(-6)}</p>
                                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase italic tracking-widest ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onViewOrders}
                        className="w-full mt-8 py-4 border border-dashed border-neutral-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] italic text-neutral-400 dark:text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-600/30 transition-all"
                    >
                        Ver todos los pedidos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
