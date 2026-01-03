
import React, { useState, useEffect } from 'react';
import { LayoutGrid, ArrowUpRight } from 'lucide-react';
import { MuscleFilter, GalleryImage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickCategoryNavProps {
    onSelectCategory: (category: MuscleFilter) => void;
    galleryImages?: GalleryImage[];
}

const catData: { label: string; value: MuscleFilter; image: string; side: 'left' | 'right'; tag: string }[] = [
    { label: 'Mancuernas', value: 'Mancuernas', image: '/categories/mancuernas.png', side: 'left', tag: 'EQUIPAMIENTO' },
    { label: 'Discos', value: 'Discos', image: '/categories/discos.png', side: 'left', tag: 'EQUIPAMIENTO' },
    { label: 'Barras', value: 'Barras', image: '/categories/barras.png', side: 'left', tag: 'EQUIPAMIENTO' },
    { label: 'Bancos', value: 'Bancos', image: '/categories/bancos.png', side: 'right', tag: 'EQUIPAMIENTO' },
    { label: 'Cardio', value: 'Cardio', image: '/categories/cardio.png', side: 'right', tag: 'EQUIPAMIENTO' },
    { label: 'Funcional', value: 'Funcional', image: '/categories/funcional.png', side: 'right', tag: 'EQUIPAMIENTO' },
];

const QuickCategoryNav: React.FC<QuickCategoryNavProps> = ({ onSelectCategory, galleryImages = [] }) => {
    const [currentImg, setCurrentImg] = useState(0);

    const machineryImages = galleryImages.length > 0
        ? galleryImages
        : [{ imageUrl: '/categories/cardio.png' }];

    useEffect(() => {
        // Rotation disabled per user request: "solo salgan la primera foto de cada producto"
        return;
    }, [machineryImages]);

    const v = Date.now() + 4000;

    return (
        <section className="relative py-20 md:py-32 bg-white dark:bg-[#050505] overflow-hidden">
            {/* Soft Engineering Grid */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
                <div className="flex flex-col xl:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-20">

                    {/* CENTRAL PORTAL - APPLE CARD STYLE (Always on top for mobile) */}
                    <div className="relative order-1 xl:order-2 w-full max-w-[650px]">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => onSelectCategory('Todos')}
                            className="group relative w-full aspect-square sm:aspect-video xl:aspect-square rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl"
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImg}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={machineryImages[currentImg]?.imageUrl}
                                        alt="Equipamiento"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Apple-style Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-end p-8 sm:p-12 md:p-16 text-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <p className="text-[10px] sm:text-xs font-black text-primary-400 uppercase tracking-[0.4em] mb-3">
                                        LÍNEA ÉLITE INDUSTRIAL
                                    </p>
                                    <h3 className="text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none mb-8">
                                        Maquinaria
                                    </h3>

                                    <div className="inline-flex items-center gap-3 bg-white text-neutral-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-xl group/btn">
                                        <span>EXPLORAR TODO</span>
                                        <ArrowUpRight size={18} strokeWidth={3} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all" />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.button>
                    </div>

                    {/* UNIFIED GRID FOR MOBILE / SPLIT FOR DESKTOP */}
                    {/* LEFT SIDE (Desktop) / ALL ITEMS (Mobile) */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-4 sm:gap-6 order-2 xl:order-1 w-full xl:w-auto">
                        {catData.map((cat, idx) => (
                            <motion.button
                                key={cat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                onClick={() => onSelectCategory(cat.value)}
                                className={`group relative bg-neutral-50 dark:bg-white/5 p-4 sm:p-6 rounded-[2rem] border border-neutral-100 dark:border-white/10 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-500/10 ${cat.side === 'right' ? 'xl:hidden' : ''
                                    }`}
                            >
                                <div className="flex flex-col items-center xl:items-start gap-4 w-full">
                                    <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                                        <img
                                            src={`${cat.image}?v=${v}`}
                                            alt={cat.label}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="text-center xl:text-left px-2 pb-2">
                                        <h4 className="text-lg sm:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none group-hover:text-primary-600 transition-colors">
                                            {cat.label}
                                        </h4>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* RIGHT SIDE (Desktop ONLY) */}
                    <div className="hidden xl:grid grid-cols-1 gap-6 order-3 w-auto">
                        {catData.filter(c => c.side === 'right').map((cat, idx) => (
                            <motion.button
                                key={cat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                onClick={() => onSelectCategory(cat.value)}
                                className="group relative bg-neutral-50 dark:bg-white/5 p-4 sm:p-6 rounded-[2rem] border border-neutral-100 dark:border-white/10 transition-all duration-300 hover:shadow-xl dark:hover:shadow-primary-500/10"
                            >
                                <div className="flex flex-col items-center xl:items-end gap-4 w-full">
                                    <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm">
                                        <img
                                            src={`${cat.image}?v=${v}`}
                                            alt={cat.label}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                    <div className="text-right px-2 pb-2">
                                        <h4 className="text-lg sm:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none group-hover:text-primary-600 transition-colors">
                                            {cat.label}
                                        </h4>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
