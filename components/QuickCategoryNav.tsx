
import React from 'react';
import { ChevronRight, ArrowUpRight } from 'lucide-react';
import { MuscleFilter } from '../types';
import { motion } from 'framer-motion';

interface QuickCategoryNavProps {
    onSelectCategory: (category: MuscleFilter) => void;
}

const quickCats: { label: string; value: MuscleFilter; image: string; desc: string }[] = [
    { label: 'Mancuernas', value: 'Mancuernas', image: '/categories/mancuernas.png', desc: 'CARGA DE PRECISIÓN' },
    { label: 'Cardio', value: 'Cardio', image: '/categories/cardio.png', desc: 'RESISTENCIA ÉLITE' },
    { label: 'Discos', value: 'Discos', image: '/categories/discos.png', desc: 'PESO OLÍMPICO' },
    { label: 'Barras', value: 'Barras', image: '/categories/barras.png', desc: 'ACERO DE GRADO' },
    { label: 'Bancos', value: 'Bancos', image: '/categories/bancos.png', desc: 'ESTABILIDAD PRO' },
    { label: 'Funcional', value: 'Funcional', image: '/categories/funcional.png', desc: 'AGILIDAD TOTAL' },
];

const QuickCategoryNav: React.FC<QuickCategoryNavProps> = ({ onSelectCategory }) => {
    return (
        <section className="relative py-40 md:py-60 bg-[#fcfcfc] dark:bg-[#050505] overflow-hidden">
            {/* Engineering Grid Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col items-center text-center mb-24 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 bg-primary-500/5 px-6 py-2 rounded-full border border-primary-500/10"
                    >
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.4em] italic">Catálogo de Especialistas</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-[0.85]"
                    >
                        EL PODER DEL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-200 dark:from-neutral-600 dark:to-neutral-400">DISEÑO ÉLITE</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-20">
                    {quickCats.map((cat, index) => (
                        <motion.button
                            key={cat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            onClick={() => onSelectCategory(cat.value)}
                            className="group relative flex flex-col items-center"
                        >
                            {/* Floating Watermark SE */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[100px] font-black text-black/[0.03] dark:text-white/[0.03] uppercase italic pointer-events-none select-none leading-none z-0">
                                SE
                            </div>

                            {/* Circular Image - No card container */}
                            <div className="relative z-10">
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white dark:border-neutral-900 shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:shadow-primary-500/20">
                                    <img
                                        src={cat.image}
                                        alt={cat.label}
                                        className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-1000"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>

                                {/* Desc Badge Floating */}
                                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 shadow-lg px-4 py-1.5 rounded-full border border-neutral-100 dark:border-white/5 whitespace-nowrap z-20">
                                    <span className="text-[8px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest italic">
                                        {cat.desc.split(' ')[0]}
                                    </span>
                                </div>
                            </div>

                            {/* Minimalist Info */}
                            <div className="mt-10 flex flex-col items-center text-center">
                                <h3 className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter mb-4 group-hover:text-primary-500 transition-colors">
                                    {cat.label}
                                </h3>

                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 group-hover:bg-primary-500 group-hover:h-10 transition-all duration-700" />
                                    <ArrowUpRight size={16} className="text-neutral-300 dark:text-neutral-700 group-hover:text-primary-500 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-700" />
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
