
import React from 'react';
import { Dumbbell, Activity, Disc, Combine, Package, Trophy, Zap, Shield, Target, Compass, ChevronRight } from 'lucide-react';
import { MuscleFilter } from '../types';
import ScrollReveal from './ScrollReveal';

interface QuickCategoryNavProps {
    onSelectCategory: (category: MuscleFilter) => void;
}

const quickCats: { label: string; value: MuscleFilter; icon: any; color: string; desc: string }[] = [
    {
        label: 'Mancuernas',
        value: 'Mancuernas',
        icon: Dumbbell,
        color: 'from-orange-500 to-red-600',
        desc: 'Carga Pro'
    },
    {
        label: 'Cardio',
        value: 'Cardio',
        icon: Activity,
        color: 'from-blue-500 to-indigo-600',
        desc: 'Alto Flujo'
    },
    {
        label: 'Discos',
        value: 'Discos',
        icon: Disc,
        color: 'from-zinc-500 to-zinc-900',
        desc: 'Sólido Elite'
    },
    {
        label: 'Barras',
        value: 'Barras',
        icon: Combine,
        color: 'from-emerald-500 to-teal-600',
        desc: 'Acero Puro'
    },
    {
        label: 'Bancos',
        value: 'Bancos',
        icon: Trophy,
        color: 'from-amber-400 to-orange-600',
        desc: 'Estabilidad'
    },
    {
        label: 'Funcional',
        value: 'Funcional',
        icon: Package,
        color: 'from-purple-500 to-pink-600',
        desc: 'Versatilidad'
    },
];

const QuickCategoryNav: React.FC<QuickCategoryNavProps> = ({ onSelectCategory }) => {
    return (
        <section className="relative py-48 md:py-64 overflow-hidden bg-white dark:bg-[#050505]">
            {/* Background Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary-600/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary-900/5 blur-[120px] rounded-full pointer-events-none animate-pulse delay-1000" />

            <div className="container mx-auto px-6 lg:px-24 relative z-10">
                <div className="flex flex-col items-center mb-40 text-center">
                    <ScrollReveal direction="up">
                        <span className="inline-block text-primary-500 font-black uppercase tracking-[0.5em] text-xs mb-8 italic">
                            Explora Nuestra Colección
                        </span>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.2}>
                        <h2 className="text-6xl md:text-9xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-[0.8] mb-12">
                            DISEÑADO PARA EL <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">DOMINIO</span>
                        </h2>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.3}>
                        <p className="text-neutral-500 font-medium text-lg max-w-2xl tracking-tight opacity-80 leading-relaxed">
                            Equipos diseñados con precisión para resistir los rigores del entrenamiento de élite.
                            Eleva tu gimnasio con la maestría de SAGFO.
                        </p>
                    </ScrollReveal>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {quickCats.map((cat, index) => (
                        <ScrollReveal key={cat.label} direction="up" delay={index * 0.1}>
                            <button
                                onClick={() => onSelectCategory(cat.value)}
                                className="group relative flex flex-col items-start p-14 rounded-[3rem] bg-neutral-50/50 dark:bg-white/[0.02] border border-neutral-100 dark:border-white/5 transition-all duration-700 hover:shadow-premium hover:-translate-y-4 hover:bg-white dark:hover:bg-neutral-900 w-full text-left overflow-hidden h-full"
                            >
                                {/* Visual Accent */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-0 blur-3xl group-hover:opacity-10 transition-opacity duration-1000`} />

                                {/* Icon Ecosystem */}
                                <div className="relative w-24 h-24 rounded-[2rem] bg-white dark:bg-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-700 mb-12 border border-neutral-100 dark:border-white/5">
                                    <cat.icon
                                        size={40}
                                        strokeWidth={1.5}
                                        className="text-neutral-900 dark:text-white group-hover:text-primary-500 transition-colors"
                                    />
                                    {/* Floating Notification-style Dot */}
                                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]`} />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary-500 transition-colors">
                                        {cat.label}
                                    </h3>
                                    <p className="text-xs font-black text-primary-500 uppercase tracking-[0.4em] italic opacity-60">
                                        {cat.desc}
                                    </p>
                                </div>

                                {/* Interactive Signal */}
                                <div className="mt-12 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Ver Catálogo</span>
                                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform duration-500">
                                        <ChevronRight size={20} strokeWidth={3} />
                                    </div>
                                </div>
                            </button>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Brand Core Values */}
                <div className="mt-64 grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-neutral-100 dark:border-white/10 pt-24">
                    {[
                        { icon: Shield, title: "Garantía Elite", desc: "Soporte de por vida para tu tranquilidad absoluta." },
                        { icon: Zap, title: "Logística Veloz", desc: "Red de entrega de última generación en todos los territorios." },
                        { icon: Target, title: "Precisión Pro", desc: "Ingeniería mecánica con tolerancia cero al error." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left group">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 group-hover:text-primary-500 transition-all duration-700 group-hover:shadow-2xl mb-8 group-hover:rotate-12">
                                <item.icon size={28} strokeWidth={2} />
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-[0.4em] italic text-neutral-900 dark:text-white mb-4">
                                {item.title}
                            </h4>
                            <p className="text-xs text-neutral-500 font-medium tracking-tight">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickCategoryNav;
