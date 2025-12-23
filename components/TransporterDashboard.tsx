
import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, DeliveryStatus } from '../types';

interface TransporterDashboardProps {
    orders: Order[];
    onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
    onUpdateItemStatus: (orderId: string, itemIndex: number, status: DeliveryStatus) => void;
    currentUserId?: string;
}

interface ShipmentCardProps {
    order: Order;
    isHistory?: boolean;
    onUpdateItemStatus: (orderId: string, itemIndex: number, status: DeliveryStatus) => void;
    onDeliveryConfirm: (orderId: string) => void;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({ order, isHistory, onUpdateItemStatus, onDeliveryConfirm }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <div className="group relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-xl dark:shadow-2xl transition-all duration-500 hover:shadow-blue-500/10 hover:border-blue-500/20 dark:hover:border-white/10">
            {/* Header */}
            <div
                className="p-6 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-start">
                    <div className="flex-grow space-y-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-[10px] font-medium text-neutral-500 dark:text-zinc-500 tracking-widest uppercase">
                                #{order.id.slice(-6)}
                            </span>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide border shadow-sm ${order.status === 'Despachado' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' :
                                order.status === 'En Envío' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                    order.status === 'Recibido' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                                        order.status === 'Entregado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                                            'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {order.customerInfo.name}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-zinc-400 font-medium flex items-center gap-2">
                            <svg className="w-4 h-4 text-neutral-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {order.customerInfo.city}, {order.customerInfo.department}
                        </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 dark:text-zinc-400 transition-all duration-500 ${isExpanded ? 'rotate-180 bg-neutral-200 dark:bg-white/10 text-neutral-900 dark:text-white' : ''}`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={`transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 space-y-8">

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent" />

                    {/* Contact Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-neutral-50 dark:bg-black/20 rounded-2xl p-4 border border-neutral-100 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <span className="text-xs font-bold text-neutral-500 dark:text-zinc-500 uppercase tracking-wider">Contacto Directo</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-0 md:pl-11">
                                <a
                                    href={`tel:${order.customerInfo.phone}`}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    Llamar
                                </a>
                                <a
                                    href={`https://wa.me/${order.customerInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${order.customerInfo.name}! 👋 Te contacto de SAGFO sobre la entrega de tu equipo.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#22c35e] transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.239 8.413 3.488 2.247 2.248 3.484 5.236 3.484 8.414 0 6.556-5.338 11.891-11.893 11.891-2.006-.001-3.968-.511-5.7-1.483L0 24zm6.753-4.008l.311.185c1.479.881 2.943 1.344 4.54 1.345 5.51 0 10-4.49 10.002-10 0-2.67-1.04-5.18-2.93-7.072-1.891-1.891-4.401-2.932-7.072-2.932-5.51 0-10 4.49-10.002 10 0 1.83.49 3.612 1.417 5.16l.204.343-1.003 3.666 3.733-.979zm10.166-4.62c-.282-.14-.367-.184-1.241-.62-.112-.057-.204-.085-.282.029-.113.169-.437.551-.536.662-.1.112-.2.126-.482.014-.282-.14-1.19-.439-2.266-1.4-.838-.748-1.402-1.671-1.566-1.953-.163-.282-.017-.435.123-.574.126-.126.282-.324.423-.486l.211-.271c.07-.123.035-.233-.018-.338l-.296-.708c-.126-.301-.254-.258-.338-.258-.1-.003-.204-.007-.311-.007-.311 0-.818.117-1.241.58-.423.465-1.614 1.579-1.614 3.847 0 2.268 1.649 4.461 1.875 4.771.226.31 3.241 4.95 7.85 6.938 1.1.473 1.957.755 2.626.967 1.102.35 2.105.3 2.895.182.881-.131 2.706-1.107 3.088-2.124.382-1.017.382-1.891.268-2.074-.114-.183-.41-.295-.691-.436z" /></svg>
                                    WhatsApp
                                </a>
                            </div>
                        </div>

                        <div className="bg-neutral-50 dark:bg-black/20 rounded-2xl p-4 border border-neutral-100 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/10 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <span className="text-xs font-bold text-neutral-500 dark:text-zinc-500 uppercase tracking-wider">Dirección</span>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-zinc-300 pl-11 leading-relaxed">
                                {order.customerInfo.address || 'Sin dirección específica'}
                            </p>
                        </div>
                    </div>

                    {/* Items Checklist */}
                    <div>
                        <h4 className="text-[11px] font-bold text-neutral-500 dark:text-zinc-500 mb-4 uppercase tracking-widest pl-1">Items a Entregar</h4>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => {
                                const isProduction = item.equipment.availabilityStatus === 'made-to-order';
                                const isDelivered = item.deliveryStatus === 'delivered';
                                const isMissing = isProduction && item.deliveryStatus === 'pending';

                                return (
                                    <div key={idx} className="group/item flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-all duration-300">
                                        <div className="flex items-center gap-4 overflow-hidden">
                                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/40 flex items-center justify-center flex-shrink-0 border border-neutral-200 dark:border-white/5 text-neutral-500 dark:text-zinc-400 font-bold text-sm shadow-sm dark:shadow-none">
                                                x{item.quantity}
                                            </div>
                                            <span className="text-sm font-medium text-neutral-700 dark:text-zinc-200 truncate group-hover/item:text-neutral-900 dark:group-hover/item:text-white transition-colors">{item.equipment.name}</span>
                                        </div>

                                        <div className="flex-shrink-0 ml-4">
                                            {isDelivered ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                    Entregado
                                                </span>
                                            ) : isMissing ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">
                                                    En Producción
                                                </span>
                                            ) : (
                                                !isHistory && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onUpdateItemStatus(order.id, idx, 'delivered'); }}
                                                        className="px-4 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-[11px] font-bold uppercase tracking-wide hover:bg-neutral-800 dark:hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg shadow-neutral-900/10 dark:shadow-white/10"
                                                    >
                                                        Entregar
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 grid grid-cols-1 gap-3">
                        {order.customerInfo.mapsLink ? (
                            <a
                                href={order.customerInfo.mapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300 gap-2 group/btn"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                Abrir en Maps
                            </a>
                        ) : (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.customerInfo.address}, ${order.customerInfo.city}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300 gap-2 group/btn"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                Buscar Ruta
                            </a>
                        )}

                        {!isHistory && (
                            isConfirming ? (
                                <div className="flex gap-3 animate-fade-in">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setIsConfirming(false); }}
                                        className="flex-1 py-4 bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-300 rounded-2xl text-sm font-bold hover:bg-neutral-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeliveryConfirm(order.id); }}
                                        className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-600/30 transition-all"
                                    >
                                        Confirmar Entrega
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsConfirming(true); }}
                                    className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-2xl text-sm font-bold shadow-lg shadow-neutral-900/10 dark:shadow-white/5 hover:bg-neutral-800 dark:hover:bg-zinc-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Marcar Todo Entregado
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TransporterDashboard: React.FC<TransporterDashboardProps> = ({ orders, onUpdateOrderStatus, onUpdateItemStatus, currentUserId }) => {
    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filter orders assigned to transport
    const assignedOrders = orders.filter(o => o.assignedTransporterId === currentUserId);

    // Transporter should see orders that are NOT delivered (active)
    const pendingShipments = assignedOrders.filter(order =>
        order.status !== 'Entregado'
    );

    const historyShipments = assignedOrders.filter(order => order.status === 'Entregado');

    const rawDisplayOrders = activeTab === 'pending' ? pendingShipments : historyShipments;

    // Calculate available statuses for filter
    const availableStatuses = useMemo(() => {
        const statuses = new Set(rawDisplayOrders.map(o => o.status));
        return Array.from(statuses);
    }, [rawDisplayOrders]);

    // Apply status filter
    const filteredOrders = useMemo(() => {
        if (statusFilter === 'all') return rawDisplayOrders;
        return rawDisplayOrders.filter(o => o.status === statusFilter);
    }, [rawDisplayOrders, statusFilter]);

    const handleDeliveryConfirm = (orderId: string) => {
        onUpdateOrderStatus(orderId, 'Entregado', 'Entrega confirmada por transportador.');
    };

    // Reset filter when tab changes
    React.useEffect(() => {
        setStatusFilter('all');
    }, [activeTab]);

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-black text-neutral-900 dark:text-zinc-100 font-sans selection:bg-blue-500/30 transition-colors duration-500">
            <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">

                {/* Header Section */}
                <div className="mb-10 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white tracking-tighter mb-2">
                                Transporte
                            </h1>
                            <p className="text-neutral-500 dark:text-zinc-400 font-medium">
                                Gestiona tus rutas y entregas.
                            </p>
                        </div>

                        {/* Segmented Control */}
                        <div className="bg-neutral-200/50 dark:bg-zinc-900/80 backdrop-blur p-1.5 rounded-full border border-neutral-200 dark:border-white/10 flex relative w-full md:w-auto">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'pending'
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-neutral-500 dark:text-zinc-500 hover:text-neutral-800 dark:hover:text-zinc-300'
                                    }`}
                            >
                                En Ruta <span className="ml-1 opacity-60 text-xs">({pendingShipments.length})</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'history'
                                    ? 'bg-white text-black shadow-lg'
                                    : 'text-neutral-500 dark:text-zinc-500 hover:text-neutral-800 dark:hover:text-zinc-300'
                                    }`}
                            >
                                Historial <span className="ml-1 opacity-60 text-xs">({historyShipments.length})</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar mask-linear-fade">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-5 py-2 text-xs font-bold rounded-full border transition-all whitespace-nowrap flex-shrink-0 ${statusFilter === 'all'
                                ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white shadow-lg'
                                : 'bg-white dark:bg-zinc-900 text-neutral-500 dark:text-zinc-500 border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700 hover:text-neutral-900 dark:hover:text-zinc-300'
                                }`}
                        >
                            Todos
                        </button>
                        {availableStatuses.map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-5 py-2 text-xs font-bold rounded-full border transition-all whitespace-nowrap flex-shrink-0 ${statusFilter === status
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                                    : 'bg-white dark:bg-zinc-900 text-neutral-500 dark:text-zinc-500 border-neutral-200 dark:border-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-700 hover:text-neutral-900 dark:hover:text-zinc-300'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content List */}
                <div className="space-y-6">
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <ShipmentCard
                                key={order.id}
                                order={order}
                                isHistory={activeTab === 'history'}
                                onUpdateItemStatus={onUpdateItemStatus}
                                onDeliveryConfirm={handleDeliveryConfirm}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-neutral-400 dark:text-zinc-600 border border-dashed border-neutral-200 dark:border-zinc-800 rounded-3xl bg-neutral-50 dark:bg-zinc-900/30">
                            <div className="w-16 h-16 mb-4 rounded-full bg-neutral-100 dark:bg-zinc-800/50 flex items-center justify-center">
                                <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <p className="font-medium">No hay pedidos disponibles</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransporterDashboard;
