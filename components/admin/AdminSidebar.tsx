
import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingCart,
    MessageSquare,
    Package,
    Calendar,
    Image as ImageIcon,
    Wallet,
    Truck,
    FileText,
    Table,
    Users,
    Settings,
    ArrowUpRight,
    LogOut,
    X,
    ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onAdminViewToggle: () => void;
    onLogout: () => void;
    isOpen: boolean;
    onClose: () => void;
}

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
    <motion.button
        whileHover={{ x: active ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`group w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-500 relative overflow-hidden ${active
            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]'
            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5'
            }`}
    >
        {active && (
            <motion.div
                layoutId="active-indicator"
                className="absolute inset-0 bg-neutral-900 dark:bg-white -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
        )}

        <div className={`relative z-10 p-2 rounded-xl transition-all duration-500 ${active ? 'bg-white/10 dark:bg-neutral-900/10' : 'bg-neutral-100 dark:bg-white/5 group-hover:bg-primary-600/10 group-hover:text-primary-600'}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 18, strokeWidth: active ? 3 : 2 })}
        </div>

        <span className={`relative z-10 font-black uppercase italic tracking-[0.15em] text-[10px] transition-all duration-500 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 group-hover:text-neutral-900 dark:group-hover:text-white'}`}>
            {label}
        </span>

        {active ? (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-auto"
            >
                <ChevronRight size={14} strokeWidth={4} />
            </motion.div>
        ) : (
            <div className="ml-auto opacity-0 group-hover:opacity-30 transform translate-x-1 group-hover:translate-x-0 transition-all">
                <ChevronRight size={12} strokeWidth={3} />
            </div>
        )}
    </motion.button>
);

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.4em] italic mb-3 px-4 mt-8 first:mt-0">
        {children}
    </div>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, onAdminViewToggle, onLogout, isOpen, onClose }) => {
    const handleNavClick = (tab: any) => {
        setActiveTab(tab);
        if (window.innerWidth < 1024) onClose();
    };

    return (
        <>
            {/* Mobile Overlay */}
            <motion.div
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={onClose}
            />

            <aside className={`w-72 border-r border-neutral-200 dark:border-white/5 bg-white/80 dark:bg-[#080808]/80 backdrop-blur-2xl fixed top-0 bottom-0 left-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col
                ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>

                {/* Header / Logo */}
                <div className="p-8 lg:p-10 flex items-center justify-between">
                    <div className="cursor-pointer group flex items-center gap-4" onClick={() => handleNavClick('overview')}>
                        <div className="relative">
                            <img src="/logo-light.png" alt="Logo" className="h-9 w-auto object-contain dark:hidden transition-all duration-500 group-hover:scale-105" />
                            <img src="/logo-sf.png" alt="Logo" className="h-9 w-auto object-contain hidden dark:block transition-all duration-500 group-hover:scale-105" />
                            <div className="absolute -inset-4 bg-primary-600/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </div>
                    </div>

                    <button onClick={onClose} className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-5 space-y-1.5 overflow-y-auto no-scrollbar pb-8">
                    <SectionHeader>Consola Principal</SectionHeader>
                    <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'overview'} onClick={() => handleNavClick('overview')} />
                    <NavItem icon={<ShoppingCart />} label="Ventas & Flujo" active={activeTab === 'orders'} onClick={() => handleNavClick('orders')} />
                    <NavItem icon={<MessageSquare />} label="Comunicaciones" active={activeTab === 'whatsapp'} onClick={() => handleNavClick('whatsapp')} />

                    <SectionHeader>Gestión de Activos</SectionHeader>
                    <NavItem icon={<Package />} label="Catálogo Elite" active={activeTab === 'products'} onClick={() => handleNavClick('products')} />
                    <NavItem icon={<Calendar />} label="Eventos" active={activeTab === 'events'} onClick={() => handleNavClick('events')} />
                    <NavItem icon={<ImageIcon />} label="Galería Visual" active={activeTab === 'gallery'} onClick={() => handleNavClick('gallery')} />

                    <SectionHeader>Ingeniería de Venta</SectionHeader>
                    <NavItem icon={<Wallet />} label="Cuentas x Cobrar" active={activeTab === 'debts'} onClick={() => handleNavClick('debts')} />
                    <NavItem icon={<FileText />} label="Cotizaciones" active={activeTab === 'quotes'} onClick={() => handleNavClick('quotes')} />
                    <NavItem icon={<Table />} label="Matriz de Precios" active={activeTab === 'bulk-prices'} onClick={() => handleNavClick('bulk-prices')} />

                    <SectionHeader>Sistema SAGFO</SectionHeader>
                    <NavItem icon={<Users />} label="Directorio" active={activeTab === 'users'} onClick={() => handleNavClick('users')} />
                    <NavItem icon={<Settings />} label="Configuración" active={activeTab === 'settings'} onClick={() => handleNavClick('settings')} />
                </nav>

                {/* Footer Actions */}
                <div className="p-5 mt-auto border-t border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]">
                    <div className="space-y-2">
                        <button
                            onClick={() => { onAdminViewToggle(); if (window.innerWidth < 1024) onClose(); }}
                            className="w-full flex items-center gap-4 px-5 py-4 text-primary-600 dark:text-primary-400 bg-white dark:bg-white/5 border border-primary-600/10 dark:border-primary-400/10 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg shadow-primary-600/5 active:scale-98 group"
                        >
                            <ArrowUpRight className="rotate-[225deg] w-4 h-4 transition-transform group-hover:-translate-x-1 group-hover:translate-y-1" />
                            <span className="font-black uppercase italic tracking-widest text-[9px]">Regresar a Tienda</span>
                        </button>

                        <button
                            onClick={() => { onLogout(); if (window.innerWidth < 1024) onClose(); }}
                            className="w-full flex items-center gap-4 px-5 py-4 text-neutral-500 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all duration-300 group"
                        >
                            <LogOut className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            <span className="font-black uppercase italic tracking-widest text-[9px]">Terminar Sesión</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
