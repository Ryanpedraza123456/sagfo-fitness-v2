
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { MuscleFilter, GalleryImage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QuickCategoryNavProps {
    onSelectCategory: (category: MuscleFilter) => void;
    galleryImages?: GalleryImage[];
}

const QuickCategoryNav: React.FC<QuickCategoryNavProps> = ({ onSelectCategory, galleryImages = [] }) => {
    const [currentImg, setCurrentImg] = useState(0);

    // Filter by machinery if possible, but handle cases where it might not have the property
    // galleryImages is already filtered in App.tsx to only show Maquinaria
    const machineryImages = galleryImages.length > 0
        ? galleryImages
        : [{ imageUrl: '/categories/cardio.png' }];

    useEffect(() => {
        if (machineryImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % machineryImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [machineryImages.length]);

    return (
        <section className="relative py-12 md:py-40 overflow-hidden">
            {/* Soft Engineering Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-[1600px]">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-20">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-2 md:mb-6"
                        >
                            <div className="w-10 h-[2px] bg-primary-500" />
                            <span className="text-primary-600 dark:text-primary-400 font-black uppercase tracking-[0.4em] text-[8px] md:text-xs">
                                Selección Premium
                            </span>
                        </motion.div>
                        <h2 className="text-3xl md:text-7xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[0.85]">
                            Explora la <br /> <span className="text-primary-600">Élite del Fitness</span>
                        </h2>
                    </div>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-lg font-medium max-w-md italic">
                        Diseño de ingeniería superior para entrenamientos de alto rendimiento.
                    </p>
                </div>

                {/* BENTO GRID ARCHITECTURE */}
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4 md:gap-8 auto-rows-[280px] md:auto-rows-[400px]">

                    {/* PRIMARY BENTO: MAQUINARIA (Large Feature) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="md:col-span-4 lg:col-span-6 lg:row-span-2 relative group cursor-pointer rounded-[2rem] md:rounded-[4rem] overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 shadow-2xl"
                        onClick={() => onSelectCategory('Todos')}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImg}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={machineryImages[currentImg]?.imageUrl}
                                    alt="Elite Machinery"
                                    className="w-full h-full object-contain p-4 md:p-12 transition-all duration-[3s]"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Manual Image Navigation Arrows */}
                        {machineryImages.length > 1 && (
                            <div className="absolute inset-0 z-30 pointer-events-none">
                                <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 flex justify-between px-2 md:px-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImg((prev) => (prev - 1 + machineryImages.length) % machineryImages.length);
                                        }}
                                        className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto transition-all hover:scale-110 active:scale-95"
                                    >
                                        <ChevronLeft className="w-4 h-4 md:w-8 md:h-8" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImg((prev) => (prev + 1) % machineryImages.length);
                                        }}
                                        className="w-8 h-8 md:w-14 md:h-14 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white pointer-events-auto transition-all hover:scale-110 active:scale-95"
                                    >
                                        <ChevronRight className="w-4 h-4 md:w-8 md:h-8" />
                                    </button>
                                </div>

                                {/* Pagination Dots - Moved to bottom */}
                                <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full border border-white/5">
                                    {machineryImages.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${currentImg === i ? 'w-4 md:w-8 bg-primary-500' : 'w-1 md:w-1.5 bg-white/30'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />

                        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 z-20">
                            <span className="text-[8px] md:text-[10px] font-black text-primary-400 uppercase tracking-[0.4em] mb-1 md:mb-4 block">Serie Profesional S</span>
                            <h3 className="text-2xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-4 md:mb-10">Maquinaria <br /> Industrial</h3>
                            <div className="inline-flex items-center gap-2 md:gap-4 bg-white text-black px-5 md:px-10 py-2.5 md:py-5 rounded-xl md:rounded-3xl font-black uppercase text-[9px] md:text-xs tracking-widest hover:bg-primary-500 hover:text-white transition-all transform group-hover:translate-x-2">
                                Ver Catálogo <ArrowUpRight className="w-3 h-3 md:w-5 md:h-5" strokeWidth={3} />
                            </div>
                        </div>
                    </motion.div>

                    {/* BENTO: CARDIO (Long Rectangle) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 lg:col-span-6 lg:row-span-1 bg-neutral-50 dark:bg-white/[0.03] rounded-[2rem] md:rounded-[4rem] p-6 md:p-16 border border-neutral-100 dark:border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white dark:hover:bg-white/[0.05] transition-all overflow-hidden"
                        onClick={() => onSelectCategory('Cardio')}
                    >
                        <div className="space-y-2 md:space-y-6 flex-shrink-0">
                            <span className="text-[8px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Aeróbico Elite</span>
                            <h3 className="text-2xl md:text-5xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Cardio</h3>
                            <p className="text-[10px] md:text-sm text-neutral-500 font-medium">Resistencia sin límites.</p>
                        </div>
                        <div className="w-24 h-24 md:w-64 md:h-64 relative bg-white dark:bg-zinc-900 rounded-2xl md:rounded-[3rem] p-3 md:p-8 shadow-sm flex-shrink-0">
                            <img src="/categories/cardio.png" className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700" alt="" />
                        </div>
                    </motion.div>

                    {/* BENTO: MANCUERNAS (Square) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 lg:col-span-3 lg:row-span-1 bg-neutral-50 dark:bg-white/[0.03] rounded-[2rem] md:rounded-[4rem] p-6 md:p-10 border border-neutral-100 dark:border-white/5 group cursor-pointer relative overflow-hidden flex flex-col justify-between hover:bg-white dark:hover:bg-white/[0.05] transition-all"
                        onClick={() => onSelectCategory('Mancuernas')}
                    >
                        <div className="relative z-10">
                            <span className="text-[8px] md:text-[10px] font-black text-primary-500 uppercase tracking-widest italic mb-1 md:mb-2 block">Acero Forjado</span>
                            <h3 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Mancuernas</h3>
                        </div>
                        <div className="h-28 md:h-40 w-full relative bg-white dark:bg-zinc-900/50 rounded-xl md:rounded-3xl p-6 md:p-8 mt-2 md:mt-4 overflow-hidden">
                            <img src="/categories/mancuernas.png" className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]" alt="" />
                        </div>
                    </motion.div>

                    {/* BENTO: DISCOS (Square) */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="md:col-span-2 lg:col-span-3 lg:row-span-1 bg-neutral-900 rounded-[2rem] md:rounded-[4rem] p-6 md:p-10 border border-neutral-100 dark:border-white/5 group cursor-pointer relative overflow-hidden flex flex-col justify-between hover:shadow-[0_0_50px_rgba(14,165,233,0.15)] transition-all"
                        onClick={() => onSelectCategory('Discos')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <span className="text-[8px] md:text-[10px] font-black text-primary-400 uppercase tracking-widest italic mb-1 md:mb-2 block">Hierro Fundido</span>
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">Pesos <br /> Libres</h3>
                        </div>
                        <div className="h-28 md:h-40 w-full relative flex items-center justify-center p-6 md:p-8">
                            <img src="/categories/discos.png" className="w-full h-full object-contain group-hover:rotate-45 group-hover:scale-110 transition-transform duration-[1.5s]" alt="" />
                        </div>
                    </motion.div>

                    {/* BENTO: FUNCIONAL (Square) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="md:col-span-2 lg:col-span-3 lg:row-span-1 bg-neutral-50 dark:bg-white/[0.03] rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 border border-neutral-100 dark:border-white/5 group cursor-pointer hover:bg-white dark:hover:bg-white/[0.05] transition-all flex flex-col"
                        onClick={() => onSelectCategory('Funcional')}
                    >
                        <div className="mb-3 md:mb-6">
                            <span className="text-[8px] md:text-[10px] font-black text-neutral-400 uppercase tracking-widest italic mb-0.5 block">Cross Training</span>
                            <h3 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Funcional</h3>
                        </div>
                        <div className="flex-grow flex items-center justify-center p-8 md:p-12 bg-white dark:bg-zinc-900/50 rounded-xl md:rounded-[2rem] overflow-hidden">
                            <img src="/categories/funcional.png" className="w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-[15deg] transition-transform duration-700" alt="" />
                        </div>
                    </motion.div>

                    {/* BENTO: BANCOS (Square) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="md:col-span-2 lg:col-span-3 lg:row-span-1 bg-neutral-50 dark:bg-white/[0.03] rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 border border-neutral-100 dark:border-white/5 group cursor-pointer hover:bg-white dark:hover:bg-white/[0.05] relative overflow-hidden flex flex-col transition-all"
                        onClick={() => onSelectCategory('Bancos')}
                    >
                        <div className="mb-3 md:mb-6">
                            <span className="text-[8px] md:text-[10px] font-black text-primary-500 uppercase tracking-widest italic mb-0.5 block">Soporte Anatómico</span>
                            <h3 className="text-2xl md:text-3xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter">Bancos</h3>
                        </div>
                        <div className="flex-grow flex items-center justify-center p-8 md:p-12 bg-white dark:bg-zinc-900/50 rounded-xl md:rounded-[2rem] overflow-hidden">
                            <img src="/categories/bancos.png" className="w-full h-full object-contain group-hover:translate-x-3 group-hover:-rotate-[8deg] group-hover:scale-105 transition-transform duration-700" alt="" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
