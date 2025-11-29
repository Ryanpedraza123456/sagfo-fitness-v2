import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
  onGymBuilderClick: () => void;
  onNavigate: (view: 'catalog' | 'orders') => void;
  onAdminViewToggle?: () => void;
  adminView?: 'dashboard' | 'site';
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick, onLoginClick, onGymBuilderClick, onNavigate, onAdminViewToggle, adminView, searchTerm, onSearchChange }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollTo = (id: string) => {
    onNavigate('catalog');
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigation = (view: 'catalog' | 'orders') => {
    onNavigate(view);
    setIsMenuOpen(false);
  }

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 bg-gray-50/80 dark:bg-zinc-900/80 backdrop-blur-xl z-50 border-b border-neutral-200/80 dark:border-zinc-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('catalog')}>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter">
              SAGFO<span className="font-semibold text-neutral-500 dark:text-neutral-400">FITNESS</span>
            </h1>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-8 lg:px-16">
            {adminView !== 'dashboard' && !isCustomer && (
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 dark:text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="search"
                  placeholder="Buscar equipo..."
                  value={searchTerm}
                  onChange={onSearchChange}
                  className="w-full h-11 pl-12 pr-4 rounded-full bg-neutral-100 dark:bg-zinc-800 border-2 border-transparent focus:ring-2 focus:ring-primary-500 text-sm placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              {adminView !== 'dashboard' && !isCustomer && (
                <button
                  onClick={onGymBuilderClick}
                  className="relative text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"
                  aria-label="Arma tu gimnasio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              )}
              {adminView !== 'dashboard' && (
                <button
                  onClick={onCartClick}
                  className="relative text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg"
                  aria-label={`Carrito de compras, ${cartCount} productos`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 bg-primary-600 text-white text-xs font-bold rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
              <div className="relative" ref={menuRef}>
                {user ? (
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg" aria-label="Menú de usuario">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" /></svg>
                  </button>
                ) : (
                  <button onClick={onLoginClick} className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors p-2 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg" aria-label="Iniciar sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </button>
                )}
                {isMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-zinc-800 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-2">
                    <div className="px-4 py-3 border-b border-neutral-200 dark:border-zinc-700">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        Bienvenido {user.role === 'admin' ? 'Administrador' : user.role === 'transporter' ? 'Transportador' : 'Usuario'}
                      </p>
                      <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      {isCustomer && (
                        <button onClick={() => handleNavigation('orders')} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                          <span>Mis Pedidos</span>
                        </button>
                      )}
                      {isAdmin && (
                        <button onClick={onAdminViewToggle} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-700">
                          {adminView === 'dashboard' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-1 4a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1z" /><path d="M2.5 3A1.5 1.5 0 001 4.5v11A1.5 1.5 0 002.5 17h15a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0017.5 3h-15zM2 4.5a.5.5 0 01.5-.5h15a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-15a.5.5 0 01-.5-.5v-11z" /></svg>
                          )}
                          <span>{adminView === 'dashboard' ? 'Ver Sitio' : 'Panel de Admin'}</span>
                        </button>
                      )}
                    </div>
                    <div className="py-1 border-t border-neutral-200 dark:border-zinc-700">
                      <button onClick={handleLogout} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;