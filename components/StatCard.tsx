import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
    const colorClasses: Record<string, string> = {
        emerald: 'from-emerald-500/10 to-transparent text-emerald-600',
        amber: 'from-amber-500/10 to-transparent text-amber-600',
        blue: 'from-blue-500/10 to-transparent text-blue-600',
        violet: 'from-violet-500/10 to-transparent text-violet-600',
    };

    return (
        <div className="group bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-neutral-200 dark:border-white/5 hover:border-primary-500/30 transition-all duration-500 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${color === 'emerald' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : color === 'blue' ? 'bg-blue-500' : 'bg-violet-500'}`} />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`p-4 rounded-2xl bg-gradient-to-br shadow-inner ${colorClasses[color] || 'bg-neutral-100 dark:bg-white/5'}`}>
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
                </div>
                {trend && (
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md italic ${trend.includes('+') ? 'text-emerald-500 bg-emerald-500/5' : 'text-neutral-400 bg-neutral-400/5'}`}>
                        {trend}
                    </span>
                )}
            </div>
            <div className="relative z-10">
                <h3 className="text-neutral-500 dark:text-neutral-400 text-xs font-black uppercase tracking-widest mb-1 italic opacity-70 group-hover:opacity-100 transition-opacity">{title}</h3>
                <p className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter italic group-hover:scale-105 transition-transform origin-left duration-500">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
