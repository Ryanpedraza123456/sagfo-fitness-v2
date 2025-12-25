import React, { useState } from 'react';
import { Order } from '../../types';
import { getStatusColor } from '../../lib/utils';
import { MessageSquare, Calendar, Wallet } from 'lucide-react';

interface AdminDebtsProps {
    orders: Order[];
}

const AdminDebts: React.FC<AdminDebtsProps> = ({ orders }) => {
    const handleWhatsAppMessage = (phone: string, message: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
    };

    const pendingOrders = orders.filter(
        o => o.financials &&
            o.financials.amountPending > 0 &&
            o.status !== 'Entregado' &&
            o.status !== 'Cancelado'
    );

    const totalPending = pendingOrders.reduce((acc, o) => acc + (o.financials?.amountPending || 0), 0);

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-red-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Cuentas por Cobrar</h2>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Gestión de Saldos y Recaudo</p>
                </div>
                <div className="bg-white dark:bg-zinc-900 px-8 py-4 rounded-2xl border border-neutral-200 dark:border-white/5 shadow-2xl">
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-black uppercase tracking-widest italic mb-1">Monto Total Pendiente</p>
                    <p className="text-2xl font-black text-red-600 italic tracking-tighter">${totalPending.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid gap-6">
                {pendingOrders.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-50 dark:bg-zinc-900/50 rounded-[3rem] border border-neutral-200 dark:border-white/5">
                        <Wallet className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-neutral-400 dark:text-neutral-500 uppercase italic tracking-tighter">Todo al día</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">No hay saldos pendientes por cobrar.</p>
                    </div>
                ) : (
                    pendingOrders.map((order) => {
                        const daysPending = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24));

                        return (
                            <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-neutral-200 dark:border-white/5 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase italic tracking-widest ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {daysPending} días en cartera
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 mb-2">
                                            <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">
                                                {order.customerInfo?.name || 'Cliente'}
                                            </h3>
                                            <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">#{order.id.slice(-6)}</span>
                                        </div>

                                        <div className="flex gap-8 mt-6">
                                            <div>
                                                <p className="text-[10px] text-neutral-400 font-black uppercase italic tracking-widest mb-1">Total Pedido</p>
                                                <p className="text-lg font-bold text-neutral-900 dark:text-white">${order.financials?.totalOrderValue.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-green-600/70 font-black uppercase italic tracking-widest mb-1">Abolado</p>
                                                <p className="text-lg font-bold text-green-600">${order.financials?.amountPaid.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-red-600/70 font-black uppercase italic tracking-widest mb-1">Saldo Pendiente</p>
                                                <p className="text-2xl font-black text-red-600 italic tracking-tighter">${order.financials?.amountPending.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-auto flex flex-col gap-3">
                                        <button
                                            onClick={() => handleWhatsAppMessage(
                                                order.customerInfo?.phone || '',
                                                `¡Hola ${order.customerInfo?.name}! 👋 Te saludamos de SAGFO Fitness. Recordamos amablemente que tienes un saldo pendiente de $${order.financials?.amountPending.toLocaleString()} del pedido #${order.id.slice(-6)}. Quedamos atentos para coordinar el pago final. ¡Gracias!`
                                            )}
                                            className="px-8 py-4 bg-[#25D366] text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Recordar Pago
                                        </button>
                                        <button className="px-8 py-4 bg-neutral-100 dark:bg-white/5 text-neutral-900 dark:text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] hover:bg-neutral-200 dark:hover:bg-white/10 transition-all">
                                            Registrar Abono
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminDebts;
