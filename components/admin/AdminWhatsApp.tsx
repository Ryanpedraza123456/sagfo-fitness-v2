import React, { useState } from 'react';
import { Order } from '../../types';
import { getStatusColor, generateOrderSummary } from '../../lib/utils';
import { MessageSquare, Copy, Check, Clock } from 'lucide-react';

interface AdminWhatsAppProps {
    orders: Order[];
}

const AdminWhatsApp: React.FC<AdminWhatsAppProps> = ({ orders }) => {
    const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

    const handleWhatsAppMessage = (phone: string, message: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
    };

    const copyOrderSummary = (order: Order) => {
        const summary = generateOrderSummary(order);
        navigator.clipboard.writeText(summary);
        setCopiedOrderId(order.id);
        setTimeout(() => setCopiedOrderId(null), 2000);
    };

    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-[#25D366] rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Centro de Comunicaciones</h2>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Gestión Directa vía WhatsApp Business</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {recentOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-neutral-200 dark:border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <MessageSquare className="w-24 h-24" />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase italic tracking-widest mb-2 ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">
                                        {order.customerInfo?.name || 'Cliente Sin Nombre'}
                                    </h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">Pedido #{order.id.slice(-6)}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-neutral-400 text-xs font-bold uppercase tracking-wider mb-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                    <p className="text-lg font-black text-neutral-900 dark:text-white">
                                        ${order.financials?.totalOrderValue?.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleWhatsAppMessage(
                                        order.customerInfo?.phone || '',
                                        `¡Hola ${order.customerInfo?.name}! 👋 Te escribimos de SAGFO Fitness sobre tu pedido #${order.id.slice(-6)}.`
                                    )}
                                    className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white rounded-xl font-black uppercase italic tracking-widest text-[10px] hover:shadow-lg hover:shadow-green-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Iniciar Chat
                                </button>
                                <button
                                    onClick={() => copyOrderSummary(order)}
                                    className={`flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase italic tracking-widest text-[10px] transition-all border border-neutral-200 dark:border-white/10 ${copiedOrderId === order.id
                                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                                        : 'bg-white text-neutral-900 dark:bg-transparent dark:text-white hover:bg-neutral-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {copiedOrderId === order.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    {copiedOrderId === order.id ? 'Copiado' : 'Copiar Resumen'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminWhatsApp;
