import React, { useState, useEffect } from 'react';
import { EquipmentItem } from '../../types';
import { Clock, Save } from 'lucide-react';

interface AdminBulkPricesProps {
    products: EquipmentItem[];
    onSaveProduct: (product: EquipmentItem) => void;
}

const AdminBulkPrices: React.FC<AdminBulkPricesProps> = ({ products, onSaveProduct }) => {
    const [bulkPrices, setBulkPrices] = useState<Record<string, number>>({});
    const [isSavingPrices, setIsSavingPrices] = useState(false);

    useEffect(() => {
        setBulkPrices(products.reduce((acc, p) => ({ ...acc, [p.id]: p.price }), {}));
    }, [products]);

    return (
        <div className="space-y-12 no-print">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-emerald-600 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Editor de Precios</h2>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-[0.4em] italic leading-none">Actualización Masiva de Inventario</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setBulkPrices(products.reduce((acc, p) => ({ ...acc, [p.id]: p.price }), {}));
                        }}
                        className="px-8 py-4 border-2 border-neutral-200 dark:border-white/10 rounded-2xl font-black uppercase italic tracking-widest text-[10px] text-neutral-500 hover:border-red-500/30 hover:text-red-500 transition-all"
                    >
                        Descartar
                    </button>
                    <button
                        onClick={async () => {
                            setIsSavingPrices(true);
                            try {
                                for (const product of products) {
                                    if (bulkPrices[product.id] !== product.price) {
                                        await onSaveProduct({ ...product, price: bulkPrices[product.id] });
                                    }
                                }
                                alert('Precios actualizados con éxito');
                            } catch (error) {
                                console.error('Error saving bulk prices:', error);
                                alert('Error al actualizar precios');
                            } finally {
                                setIsSavingPrices(false);
                            }
                        }}
                        disabled={isSavingPrices}
                        className="flex items-center gap-4 px-10 py-5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-[2rem] font-black uppercase italic tracking-[0.2em] text-[10px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-50 group"
                    >
                        {isSavingPrices ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
                        Guardar Cambios Masivos
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[3rem] border border-neutral-200 dark:border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-neutral-50 dark:bg-white/[0.03]">
                            <th className="px-10 py-8 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] italic">Equipo</th>
                            <th className="px-10 py-8 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] italic">Actual</th>
                            <th className="px-10 py-8 text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] italic">Nuevo Precio</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                        {products.map(product => (
                            <tr key={product.id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.01] transition-colors group">
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                                            <img src={product.imageUrls?.[0]} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-black text-neutral-900 dark:text-white uppercase italic tracking-tight">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-10 py-6 text-neutral-500 dark:text-neutral-400 font-bold">
                                    ${product.price.toLocaleString()}
                                </td>
                                <td className="px-10 py-6">
                                    <div className="relative max-w-[200px]">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 font-black italic">$</span>
                                        <input
                                            type="number"
                                            value={bulkPrices[product.id] || 0}
                                            onChange={(e) => setBulkPrices({ ...bulkPrices, [product.id]: parseInt(e.target.value) || 0 })}
                                            className="w-full pl-10 pr-6 py-4 bg-neutral-100 dark:bg-white/[0.03] border-2 border-transparent focus:border-emerald-500/30 rounded-2xl font-black italic text-neutral-900 dark:text-white outline-none transition-all"
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBulkPrices;
