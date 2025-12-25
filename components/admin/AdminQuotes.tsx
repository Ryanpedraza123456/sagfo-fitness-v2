import React, { useState } from 'react';
import { Order, EquipmentItem } from '../../types';
import { FileText, ArrowDown, Plus, X, Printer, Search } from 'lucide-react';

interface AdminQuotesProps {
    orders: Order[];
    products: EquipmentItem[];
}

interface ManualQuoteItem {
    product: EquipmentItem;
    quantity: number;
    price: number;
}

const AdminQuotes: React.FC<AdminQuotesProps> = ({ orders, products }) => {
    const [isManualQuote, setIsManualQuote] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [manualQuoteItems, setManualQuoteItems] = useState<ManualQuoteItem[]>([]);
    const [manualCustomerName, setManualCustomerName] = useState('');
    const [manualCustomerCity, setManualCustomerCity] = useState('');
    const [itemSearchTerm, setItemSearchTerm] = useState('');

    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-zinc-900 dark:bg-zinc-100 rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Generador de Cotizaciones</h2>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Simulación de Proyectos y Exportación PDF</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 no-print">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex gap-4 p-1 bg-neutral-100 dark:bg-white/5 rounded-2xl w-fit">
                        <button
                            onClick={() => { setIsManualQuote(false); setSelectedOrder(null); }}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all ${!isManualQuote ? 'bg-white dark:bg-zinc-800 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Desde Pedido Existente
                        </button>
                        <button
                            onClick={() => { setIsManualQuote(true); setSelectedOrder(null); }}
                            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase italic tracking-widest transition-all ${isManualQuote ? 'bg-white dark:bg-zinc-800 shadow-sm text-neutral-900 dark:text-white' : 'text-neutral-400 hover:text-neutral-600'}`}
                        >
                            Cotización Manual
                        </button>
                    </div>

                    {!isManualQuote ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-white/5 shadow-2xl space-y-8">
                            <div>
                                <label className="block text-[11px] font-black text-neutral-400 uppercase tracking-widest italic mb-4">Seleccionar Pedido del Sistema</label>
                                <div className="relative">
                                    <select
                                        onChange={(e) => {
                                            const order = orders.find(o => o.id === e.target.value);
                                            setSelectedOrder(order || null);
                                        }}
                                        className="w-full appearance-none bg-neutral-50 dark:bg-white/5 border-2 border-transparent focus:border-neutral-300 dark:focus:border-white/20 rounded-2xl px-6 py-4 text-sm font-bold text-neutral-900 dark:text-white outline-none transition-all"
                                    >
                                        <option value="">-- Seleccionar Pedido --</option>
                                        {orders.map(order => (
                                            <option key={order.id} value={order.id}>
                                                #{order.id.slice(-6)} - {order.customerInfo?.name} ({order.status})
                                            </option>
                                        ))}
                                    </select>
                                    <ArrowDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-white/5 shadow-2xl space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Nombre del Cliente</label>
                                    <input
                                        type="text"
                                        value={manualCustomerName}
                                        onChange={(e) => setManualCustomerName(e.target.value)}
                                        className="w-full px-6 py-4 bg-neutral-50 dark:bg-white/5 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-neutral-200 dark:focus:border-white/10 transition-all text-neutral-900 dark:text-white"
                                        placeholder="Nombre Completo"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic ml-2">Ciudad / Ubicación</label>
                                    <input
                                        type="text"
                                        value={manualCustomerCity}
                                        onChange={(e) => setManualCustomerCity(e.target.value)}
                                        className="w-full px-6 py-4 bg-neutral-50 dark:bg-white/5 rounded-2xl text-xs font-bold outline-none border-2 border-transparent focus:border-neutral-200 dark:focus:border-white/10 transition-all text-neutral-900 dark:text-white"
                                        placeholder="Ciudad, Departamento"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-white/5">
                                <label className="block text-[11px] font-black text-neutral-400 uppercase tracking-widest italic">Agregar Equipamiento</label>
                                <div className="relative">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                    <input
                                        type="text"
                                        value={itemSearchTerm}
                                        onChange={(e) => setItemSearchTerm(e.target.value)}
                                        placeholder="Buscar equipo..."
                                        className="w-full pl-14 pr-6 py-4 bg-neutral-50 dark:bg-white/5 rounded-2xl text-xs font-bold outline-none text-neutral-900 dark:text-white"
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                    {products.filter(p => p.name.toLowerCase().includes(itemSearchTerm.toLowerCase())).map(product => (
                                        <button
                                            key={product.id}
                                            onClick={() => {
                                                setManualQuoteItems([...manualQuoteItems, { product, quantity: 1, price: product.price }]);
                                                setItemSearchTerm('');
                                            }}
                                            className="w-full flex items-center gap-4 p-3 hover:bg-neutral-50 dark:hover:bg-white/5 rounded-xl transition-colors text-left group"
                                        >
                                            <img src={product.imageUrls?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-200" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-xs text-neutral-900 dark:text-white truncate">{product.name}</p>
                                                <p className="text-[10px] text-neutral-500">${product.price.toLocaleString()}</p>
                                            </div>
                                            <Plus className="w-4 h-4 text-neutral-300 group-hover:text-primary-600" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {manualQuoteItems.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-white/5">
                                    <label className="block text-[11px] font-black text-neutral-400 uppercase tracking-widest italic">Items Seleccionados</label>
                                    {manualQuoteItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-white/5 rounded-2xl">
                                            <img src={item.product.imageUrls?.[0]} alt="" className="w-12 h-12 rounded-xl object-cover bg-neutral-200" />
                                            <div className="flex-1">
                                                <p className="font-black text-xs uppercase italic text-neutral-900 dark:text-white">{item.product.name}</p>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const newItems = [...manualQuoteItems];
                                                            newItems[idx].quantity = parseInt(e.target.value) || 1;
                                                            setManualQuoteItems(newItems);
                                                        }}
                                                        className="w-16 px-2 py-1 bg-white dark:bg-black/20 rounded-lg text-xs font-bold text-center"
                                                    />
                                                    <div className="flex items-center text-xs font-bold text-neutral-500">
                                                        $
                                                        <input
                                                            type="number"
                                                            value={item.price}
                                                            onChange={(e) => {
                                                                const newItems = [...manualQuoteItems];
                                                                newItems[idx].price = parseInt(e.target.value) || 0;
                                                                setManualQuoteItems(newItems);
                                                            }}
                                                            className="w-24 px-2 py-1 bg-transparent border-b border-neutral-200 dark:border-white/10 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setManualQuoteItems(manualQuoteItems.filter((_, i) => i !== idx))}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-white/5 shadow-2xl h-fit sticky top-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-800 to-black text-white flex items-center justify-center shadow-lg">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Vista Previa</h3>
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-widest italic">Documento PDF Listo</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm">
                            <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                            <span className="font-bold text-neutral-900 dark:text-white">
                                ${isManualQuote
                                    ? manualQuoteItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()
                                    : (selectedOrder?.financials?.totalOrderValue || 0).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm pt-4 border-t border-neutral-100 dark:border-white/5">
                            <span className="font-black uppercase italic text-neutral-900 dark:text-white">Total Final</span>
                            <span className="font-black text-xl text-primary-600 italic">
                                ${isManualQuote
                                    ? manualQuoteItems.reduce((acc, i) => acc + (i.price * i.quantity), 0).toLocaleString()
                                    : (selectedOrder?.financials?.totalOrderValue || 0).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => window.print()}
                        disabled={!selectedOrder && manualQuoteItems.length === 0}
                        className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Printer className="w-4 h-4" />
                        Generar PDF Elite
                    </button>
                </div>
            </div>

            {/* Print Template (Hidden unless printing) */}
            {
                (isManualQuote ? manualQuoteItems.length > 0 : selectedOrder) && (
                    <div className="hidden print:block fixed inset-0 bg-white z-[100] p-10 text-black">
                        <div className="flex justify-between items-start mb-10">
                            <img src="/logo-sf.png" className="h-16" alt="SAGFO" />
                            <div className="text-right">
                                <h1 className="text-3xl font-black uppercase italic tracking-tighter">Cotización Élite</h1>
                                <p className="text-neutral-500 font-bold">Fecha: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-10 mb-10">
                            <div>
                                <h4 className="font-black uppercase italic tracking-widest text-xs text-neutral-400 mb-2">Cliente</h4>
                                <p className="font-black uppercase italic text-xl">
                                    {isManualQuote ? (manualCustomerName || 'CLIENTE POTENCIAL') : selectedOrder?.customerInfo?.name}
                                </p>
                                <p className="text-neutral-500">
                                    {isManualQuote ? (manualCustomerCity || 'POR DEFINIR') : `${selectedOrder?.customerInfo?.city}, ${selectedOrder?.customerInfo?.department}`}
                                </p>
                            </div>
                            <div className="text-right">
                                <h4 className="font-black uppercase italic tracking-widest text-xs text-neutral-400 mb-2">Proveedor</h4>
                                <p className="font-black uppercase italic text-xl">SAGFO FITNESS CO.</p>
                                <p className="text-neutral-500">Equipamiento de Alto Rendimiento</p>
                            </div>
                        </div>

                        <table className="w-full mb-10 border-t-2 border-black">
                            <thead>
                                <tr className="border-b border-neutral-200">
                                    <th className="py-4 text-left font-black uppercase italic text-xs">Foto</th>
                                    <th className="py-4 text-left font-black uppercase italic text-xs">Equipo</th>
                                    <th className="py-4 text-center font-black uppercase italic text-xs">Cant.</th>
                                    <th className="py-4 text-right font-black uppercase italic text-xs">Precio Unit.</th>
                                    <th className="py-4 text-right font-black uppercase italic text-xs">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {isManualQuote ? (
                                    manualQuoteItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-100">
                                                    <img src={item.product.imageUrls[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="font-black uppercase italic text-sm">{item.product.name}</p>
                                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Equipamiento Elite Sagfo</p>
                                            </td>
                                            <td className="py-4 text-center font-bold">{item.quantity}</td>
                                            <td className="py-4 text-right">${item.price.toLocaleString()}</td>
                                            <td className="py-4 text-right font-black italic">${(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    selectedOrder?.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="py-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-100">
                                                    <img src={item.equipment.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="font-black uppercase italic text-sm">{item.equipment.name}</p>
                                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
                                                    {item.structureColor && `Estructura: ${item.structureColor}`} {item.upholsteryColor && `| Tapicería: ${item.upholsteryColor}`}
                                                </p>
                                            </td>
                                            <td className="py-4 text-center font-bold">{item.quantity}</td>
                                            <td className="py-4 text-right">${(item.price_at_purchase || item.equipment.price).toLocaleString()}</td>
                                            <td className="py-4 text-right font-black italic">${((item.price_at_purchase || item.equipment.price) * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="border-t-2 border-black">
                                    <td colSpan={4} className="pt-6 text-right font-black uppercase italic text-xs">Total Inversión</td>
                                    <td className="pt-6 text-right font-black uppercase italic text-2xl text-primary-600">
                                        ${(isManualQuote ? manualQuoteItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) : selectedOrder?.financials?.totalOrderValue || 0).toLocaleString()}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>

                        <div className="mt-20 pt-10 border-t border-neutral-100 grid grid-cols-2 gap-10">
                            <div>
                                <h4 className="font-black uppercase italic tracking-widest text-[10px] mb-4">Términos y Condiciones</h4>
                                <ul className="text-[10px] text-neutral-500 space-y-1">
                                    <li>• Tiempo de entrega estimado: 25-35 días hábiles.</li>
                                    <li>• Garantía: 5 años en estructura, 1 año en tapicería y partes móviles.</li>
                                    <li>• Forma de pago: 50% anticipo, 50% contra entrega.</li>
                                </ul>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <div className="w-32 h-1 bg-black mb-2" />
                                <p className="font-black uppercase italic text-[10px]">Autorizado por SAGFO Management</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default AdminQuotes;
