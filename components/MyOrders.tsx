









import React from 'react';
import { Order, OrderStatus } from '../types';

interface MyOrdersProps {
  orders: Order[];
  onBackToCatalog: () => void;
}

const statusMap: { [key in OrderStatus]: { step: number; color: string } } = {
  'Pendiente de Aprobación': { step: 1, color: 'text-gray-500'},
  'Recibido': { step: 2, color: 'text-blue-500' },
  'En Desarrollo': { step: 3, color: 'text-yellow-500' },
  'Despachado': { step: 4, color: 'text-purple-500' },
  'En Envío': { step: 5, color: 'text-orange-500' },
  'Entregado': { step: 6, color: 'text-green-500' },
};

const StatusTracker: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const currentStep = statusMap[status].step;
    const statuses: OrderStatus[] = ['Pendiente de Aprobación', 'Recibido', 'En Desarrollo', 'Despachado', 'En Envío', 'Entregado'];
    
    return (
        <div className="w-full px-2 sm:px-0">
            <div className="relative flex items-center justify-between overflow-x-auto pb-4 sm:pb-0">
                <div className="absolute left-0 top-4 -mt-px w-full h-0.5 bg-neutral-200 dark:bg-zinc-700 min-w-[600px] sm:min-w-0" aria-hidden="true" />
                <div 
                    className="absolute left-0 top-4 -mt-px h-0.5 bg-primary-600 transition-all duration-500 min-w-[600px] sm:min-w-0" 
                    style={{ width: `${((currentStep - 1) / (statuses.length - 1)) * 100}%`}} 
                />
                <div className="flex justify-between w-full min-w-[600px] sm:min-w-0">
                    {statuses.map((s, index) => {
                        const step = index + 1;
                        const isActive = step <= currentStep;
                        return (
                            <div key={s} className="relative flex flex-col items-center group">
                            <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all duration-300 ${isActive ? 'bg-primary-600 text-white' : 'bg-neutral-200 dark:bg-zinc-700 text-neutral-500 dark:text-neutral-400'}`}>
                                    {isActive ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    ) : step}
                            </div>
                                <p className={`mt-2 text-xs font-semibold text-center w-20 ${isActive ? 'text-neutral-800 dark:text-white' : 'text-neutral-500'}`}>{s}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const MyOrders: React.FC<MyOrdersProps> = ({ orders, onBackToCatalog }) => {
  const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Mis Pedidos</h1>
        <button onClick={onBackToCatalog} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
          ← Volver al Catálogo
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-800/50 rounded-2xl">
          <p className="text-neutral-500 dark:text-neutral-400">No tienes ningún pedido todavía.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => {
             const total = order.financials?.totalOrderValue || order.items.reduce((acc, item) => acc + (item.price_at_purchase || item.equipment.price) * item.quantity, 0);
             const paid = order.financials?.amountPaid || total; // Fallback for old orders
             const pending = order.financials?.amountPending || 0;

             return (
                <div key={order.id} className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden border border-neutral-200 dark:border-zinc-700">
                <div className="p-6 bg-neutral-50 dark:bg-zinc-700/50 border-b border-neutral-200 dark:border-zinc-700 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="font-bold text-lg text-neutral-800 dark:text-white">Pedido #{order.id}</h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Realizado el: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${statusMap[order.status].color} bg-opacity-10 ${order.status === 'Recibido' ? 'bg-blue-500' : order.status === 'En Desarrollo' ? 'bg-yellow-500' : order.status === 'En Envío' ? 'bg-orange-500' : order.status === 'Entregado' ? 'bg-green-500' : order.status === 'Despachado' ? 'bg-purple-500' : 'bg-gray-500'}`}>
                        {order.status}
                    </div>
                </div>
                <div className="p-6">
                    <div className="mb-8 pt-4">
                        <StatusTracker status={order.status} />
                    </div>
                    <div className="space-y-4">
                    {order.items.map(item => (
                        <div key={item.equipment.id} className={`flex flex-col sm:flex-row items-center p-4 rounded-xl border transition-all duration-200 gap-4 ${item.deliveryStatus === 'delivered' ? 'bg-neutral-900/5 dark:bg-zinc-800/80 border-green-500/20 shadow-sm' : 'border-neutral-100 dark:border-zinc-700/50'}`}>
                        <img src={item.equipment.imageUrls[0]} alt={item.equipment.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                        <div className="flex-grow text-center sm:text-left">
                            <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">{item.equipment.name}</h3>
                            <div className="flex flex-col gap-1 mt-1 items-center sm:items-start">
                                <span className="text-sm text-neutral-500 dark:text-neutral-400">Cantidad: {item.quantity}</span>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    {item.equipment.availabilityStatus === 'made-to-order' ? (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 uppercase tracking-wide">Producción</span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 uppercase tracking-wide">Stock</span>
                                    )}
                                </div>

                                {(item.structureColor || item.upholsteryColor) && (
                                    <div className="mt-1 flex flex-col sm:flex-row sm:gap-4 text-xs text-neutral-600 dark:text-neutral-300">
                                        {item.structureColor && <span><strong>Estructura:</strong> {item.structureColor}</span>}
                                        {item.upholsteryColor && <span><strong>Tapicería:</strong> {item.upholsteryColor}</span>}
                                    </div>
                                )}
                                {item.selectedWeight && (
                                     <span className="text-xs text-neutral-500 dark:text-neutral-400">Peso: <strong>{item.selectedWeight}</strong></span>
                                )}
                            </div>
                        </div>

                        {/* Status Badge Area */}
                        <div className="flex-shrink-0 flex flex-col items-center sm:items-end gap-2">
                             <p className="font-semibold text-neutral-700 dark:text-neutral-300">{formatCurrency((item.price_at_purchase || item.equipment.price) * item.quantity)}</p>
                             
                             {item.deliveryStatus === 'delivered' ? (
                                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-900/20 border border-green-500/30 text-green-600 dark:text-green-500 font-bold text-xs shadow-sm">
                                     <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                                        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                     </div>
                                     <span>Entregado</span>
                                </div>
                             ) : item.deliveryStatus === 'shipped' ? (
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold text-xs shadow-sm">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
                                       <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <span>En Camino</span>
                               </div>
                             ) : (
                                item.equipment.availabilityStatus === 'made-to-order' && (
                                    <span className="text-[10px] italic text-neutral-400 dark:text-neutral-500">Sujeto a producción</span>
                                )
                             )}
                        </div>
                        </div>
                    ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-4">
                            {order.productionDetails && (
                                <div className="p-3 bg-neutral-50 dark:bg-zinc-900/30 rounded-lg">
                                    <h4 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-2">Detalles Adicionales (Legado)</h4>
                                    <div className="text-sm space-y-1">
                                        <p className="text-neutral-700 dark:text-neutral-300"><span className="font-semibold">Estructura Global:</span> {order.productionDetails.structureColor}</p>
                                        <p className="text-neutral-700 dark:text-neutral-300"><span className="font-semibold">Tapicería Global:</span> {order.productionDetails.upholsteryColor}</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Status History */}
                            {order.statusHistory && order.statusHistory.length > 0 && (
                                <div className="p-3 bg-neutral-50 dark:bg-zinc-900/30 rounded-lg">
                                    <h4 className="text-xs font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-2">Actualizaciones de Estado</h4>
                                    <div className="space-y-3">
                                        {order.statusHistory.map((history, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-sm">
                                                <div className="flex-shrink-0 mt-1.5">
                                                     <div className={`w-2 h-2 rounded-full ${statusMap[history.status]?.color.replace('text-', 'bg-') || 'bg-gray-400'}`}></div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                        {history.status} <span className="text-xs font-normal text-neutral-500 ml-1">{new Date(history.date).toLocaleString()}</span>
                                                    </p>
                                                    {history.note && <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 italic text-xs">"{history.note}"</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                         </div>

                        <div className="md:text-right">
                            <div className="flex justify-between md:justify-end md:gap-8 text-sm mb-1">
                                <span className="text-neutral-500 dark:text-neutral-400">Total Pedido:</span>
                                <span className="font-bold text-neutral-900 dark:text-white">{formatCurrency(total)}</span>
                            </div>
                            {pending > 0 && (
                                <>
                                    <div className="flex justify-between md:justify-end md:gap-8 text-sm mb-1">
                                        <span className="text-green-600 dark:text-green-400">Pagado / Anticipo:</span>
                                        <span className="font-bold text-green-600 dark:text-green-400">{formatCurrency(paid)}</span>
                                    </div>
                                    <div className="flex justify-between md:justify-end md:gap-8 text-sm">
                                        <span className="text-red-500 dark:text-red-400">Pendiente (Contra entrega):</span>
                                        <span className="font-bold text-red-500 dark:text-red-400">{formatCurrency(pending)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
                </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;