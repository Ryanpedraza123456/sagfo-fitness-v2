import React from 'react';
import { Order, Profile } from '../../types';
import { getStatusColor } from '../../lib/utils';
import { Truck } from 'lucide-react';

interface AdminLogisticsProps {
    orders: Order[];
    transporters: Profile[];
}

const AdminLogistics: React.FC<AdminLogisticsProps> = ({ orders, transporters }) => {
    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-blue-600 rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Logística y Despachos</h2>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Hoja de Ruta y Gestión de Transportadores</p>
            </div>

            <div className="grid gap-8">
                {transporters.map(transporter => {
                    const assignedOrders = orders.filter(o => o.assignedTransporterId === transporter.id);
                    if (assignedOrders.length === 0) return null;

                    return (
                        <div key={transporter.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                <Truck className="w-32 h-32" />
                            </div>

                            <div className="flex justify-between items-end mb-10 pb-8 border-b border-neutral-100 dark:border-white/5">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse" />
                                        <h3 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Transportador: {transporter.name}</h3>
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.2em] italic">Hoja de Ruta Activa • {assignedOrders.length} Entregas</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {assignedOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-6 bg-neutral-50 dark:bg-white/[0.02] rounded-3xl border border-neutral-100 dark:border-white/5">
                                        <div className="flex gap-8 items-center">
                                            <div className="text-center">
                                                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black uppercase italic">Pedido</p>
                                                <p className="font-black text-neutral-900 dark:text-white tracking-tighter">#{order.id.slice(-6)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black uppercase italic">Destino</p>
                                                <p className="font-black text-neutral-900 dark:text-white tracking-tighter uppercase sm:text-base text-sm">{order.customerInfo?.city}, {order.customerInfo?.department}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black uppercase italic">Cliente</p>
                                                <p className="font-black text-neutral-900 dark:text-white tracking-tighter">{order.customerInfo?.name}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase italic tracking-widest ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminLogistics;
