
import React from 'react';
import { Dumbbell, Activity, Disc, Combine, Package, Trophy, ChevronRight } from 'lucide-react';
import { MuscleFilter } from '../types';
import { motion } from 'framer-motion';

interface QuickCategoryNavProps {
    onSelectCategory: (category: MuscleFilter) => void;
}

const quickCats: { label: string; value: MuscleFilter; icon: any; color: string; desc: string }[] = [
    { label: 'Mancuernas', value: 'Mancuernas', icon: Dumbbell, color: '#0ea5e9', desc: 'Carga de Precisión' },
    { label: 'Cardio', value: 'Cardio', icon: Activity, color: '#6366f1', desc: 'Resistencia Élite' },
    { label: 'Discos', value: 'Discos', icon: Disc, color: '#71717a', desc: 'Peso Olímpico' },
    { label: 'Barras', value: 'Barras', icon: Combine, color: '#10b981', desc: 'Acero de Grado' },
    { label: 'Bancos', value: 'Bancos', icon: Trophy, color: '#f59e0b', desc: 'Estabilidad Pro' },
    { label: 'Funcional', value: 'Funcional', icon: Package, color: '#ec4899', desc: 'Agilidad Total' },
];

const QuickCategoryNav: React.FC<QuickCategoryNavProps> = ({ onSelectCategory }) => {
    return (
        <section className="relative py-32 md:py-48 bg-white dark:bg-[#050505] overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-block text-primary-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-4"
                        >
                            Catálogo de Especialistas
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none"
                        >
                            DISEÑO QUE <br />
                            <span className="text-neutral-400">PULSA PODER</span>
                        </motion.h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickCats.map((cat, index) => (
                        <motion.button
                            key={cat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            onClick={() => onSelectCategory(cat.value)}
                            className="group relative h-[380px] rounded-[2.5rem] bg-neutral-100 dark:bg-white/[0.03] border border-neutral-200/50 dark:border-white/[0.05] overflow-hidden transition-all duration-700 hover:shadow-2xl"
                        >
                            {/* Icon Background Decoration */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-black/5 dark:bg-white/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors duration-700" />

                            <div className="relative h-full p-10 flex flex-col justify-between">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-zinc-900 flex items-center justify-center shadow-xl border border-neutral-100 dark:border-white/5 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-12">
                                    <cat.icon size={28} className="text-neutral-900 dark:text-white" />
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 italic opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                        {cat.desc}
                                    </p>
                                    <h3 className="text-4xl font-black text-neutral-900 dark:text-white uppercase tracking-tighter leading-none">
                                        {cat.label}
                                    </h3>

                                    <div className="flex items-center gap-3 pt-6 group-hover:gap-5 transition-all duration-500">
                                        <div className="w-10 h-[2px] bg-primary-500 group-hover:w-16 transition-all duration-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 group-hover:text-primary-500">Ver Colección</span>
                                        <ChevronRight size={14} className="text-neutral-300 group-hover:text-primary-500 opacity-0 group-hover:opacity-100 transition-all" />
                                    </div>
                                </div>
                            </div>

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
