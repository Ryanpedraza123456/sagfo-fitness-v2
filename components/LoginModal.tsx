


import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [view, setView] = useState<'login' | 'register'>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  
  // Reset fields when modal is closed or view is switched
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setAddress('');
        setCity('');
        setDepartment('');
        setError('');
        setView('login');
      }, 300); // Wait for closing animation
    }
  }, [isOpen]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        await register(name, email, password, 'customer', phone, address, city, department);
        onClose();
    } catch(err: any) {
        setError(err.message || 'Error al registrarse.');
    }
  };

  const switchView = (newView: 'login' | 'register') => {
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAddress('');
      setCity('');
      setDepartment('');
      setError('');
      setView(newView);
  }

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto transform text-center transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-10">
            <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400 dark:text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>

            {view === 'login' ? (
                <>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Iniciar Sesión</h2>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Ingresa tus credenciales para acceder.
                    </p>
                    
                    <form onSubmit={handleLogin} className="mt-8 text-left">
                        <div className="space-y-4">
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Correo electrónico" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Contraseña" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                        <button 
                            type="submit"
                            className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            Entrar
                        </button>
                    </form>

                    <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-8">
                        ¿No tienes una cuenta?{' '}
                        <button onClick={() => switchView('register')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:underline">
                            Regístrate
                        </button>
                    </p>
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Crear Cuenta</h2>
                     <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        Completa tus datos para crear una cuenta.
                    </p>
                    
                    <form onSubmit={handleRegister} className="mt-8 text-left">
                        <div className="space-y-4">
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="Nombre completo" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                            <input 
                                type="email" 
                                name="email" 
                                placeholder="Correo electrónico" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="text" 
                                    name="department" 
                                    placeholder="Departamento" 
                                    required 
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                    value={department} 
                                    onChange={(e) => setDepartment(e.target.value)} 
                                />
                                <input 
                                    type="text" 
                                    name="city" 
                                    placeholder="Ciudad" 
                                    required 
                                    className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                    value={city} 
                                    onChange={(e) => setCity(e.target.value)} 
                                />
                            </div>
                            <input 
                                type="text" 
                                name="address" 
                                placeholder="Dirección" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)} 
                            />
                            <input 
                                type="tel" 
                                name="phone" 
                                placeholder="Teléfono" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                            />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Contraseña" 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-neutral-900 dark:text-white" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
                        <button 
                            type="submit"
                            className="w-full mt-6 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            Crear mi cuenta
                        </button>
                    </form>

                     <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-8">
                        ¿Ya tienes una cuenta?{' '}
                        <button onClick={() => switchView('login')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:underline">
                           Inicia sesión
                        </button>
                    </p>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;