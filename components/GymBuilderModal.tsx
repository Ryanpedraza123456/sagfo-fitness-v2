
import React, { useState, useEffect, useMemo } from 'react';
import { EquipmentItem, GymPackage, CartItem } from '../types';
import ProductListItem from './ProductListItem';

interface GymBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: EquipmentItem[];
  onAddPackageToCart: (items: CartItem[]) => void;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const GymBuilderModal: React.FC<GymBuilderModalProps> = ({ isOpen, onClose, allProducts, onAddPackageToCart }) => {
    const [currentPackageName, setCurrentPackageName] = useState('Mi Gimnasio Personalizado');
    const [currentPackageItems, setCurrentPackageItems] = useState<CartItem[]>([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<'Maquinaria' | 'Accesorios'>('Maquinaria');

    const [savedPackages, setSavedPackages] = useState<GymPackage[]>([]);

    useEffect(() => {
        if (isOpen) {
            try {
                const storedPackages = localStorage.getItem('sagfo_gym_packages');
                if (storedPackages) {
                    setSavedPackages(JSON.parse(storedPackages));
                }
            } catch (error) {
                console.error("Failed to load gym packages from localStorage", error);
                setSavedPackages([]);
            }
        }
    }, [isOpen]);

    const savePackagesToStorage = (packages: GymPackage[]) => {
        try {
            localStorage.setItem('sagfo_gym_packages', JSON.stringify(packages));
        } catch (error) {
            console.error("Failed to save gym packages to localStorage", error);
        }
    };

    const filteredProducts = useMemo(() => {
        return allProducts
            .filter(p => p.category === activeCategory)
            .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allProducts, activeCategory, searchTerm]);

    const totalPrice = useMemo(() => {
        return currentPackageItems.reduce((total, item) => total + item.equipment.price * item.quantity, 0);
    }, [currentPackageItems]);

    const handleAddItem = (product: EquipmentItem) => {
        if (!currentPackageItems.some(item => item.equipment.id === product.id)) {
            setCurrentPackageItems(prev => [...prev, { equipment: product, quantity: 1 }]);
        }
    };
    
    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
      if (newQuantity < 1) {
          handleRemoveItem(productId);
          return;
      }
      setCurrentPackageItems(prev => prev.map(item => item.equipment.id === productId ? { ...item, quantity: newQuantity } : item));
    };


    const handleRemoveItem = (productId: string) => {
        setCurrentPackageItems(prev => prev.filter(item => item.equipment.id !== productId));
    };

    const handleSavePackage = () => {
        if (currentPackageName.trim() === '' || currentPackageItems.length === 0) {
            alert('Por favor, nombra tu paquete y añade al menos un producto.');
            return;
        }
        const newPackage: GymPackage = {
            id: new Date().toISOString() + Math.random(),
            name: currentPackageName,
            items: currentPackageItems,
            createdAt: new Date().toISOString(),
        };
        const updatedPackages = [...savedPackages, newPackage];
        setSavedPackages(updatedPackages);
        savePackagesToStorage(updatedPackages);
        alert(`Paquete "${currentPackageName}" guardado!`);
    };
    
    const handleLoadPackage = (packageId: string) => {
        const packageToLoad = savedPackages.find(p => p.id === packageId);
        if (packageToLoad) {
            setCurrentPackageName(packageToLoad.name);
            setCurrentPackageItems(packageToLoad.items);
        }
    };

    const handleDeletePackage = (packageId: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este paquete guardado?')) {
            const updatedPackages = savedPackages.filter(p => p.id !== packageId);
            setSavedPackages(updatedPackages);
            savePackagesToStorage(updatedPackages);
        }
    };

    const handleAddToCartAndClose = () => {
        if (currentPackageItems.length === 0) {
            alert('Añade al menos un producto a tu paquete para añadirlo al carrito.');
            return;
        }
        onAddPackageToCart(currentPackageItems);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
            <div className="relative bg-neutral-100 dark:bg-neutral-900 w-full h-full flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Arma tu Gimnasio</h2>
                    </div>
                    <button onClick={onClose} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
                
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-0 overflow-hidden">
                    <div className="lg:col-span-2 xl:col-span-3 flex flex-col bg-white dark:bg-zinc-950 overflow-hidden">
                        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 items-center sm:justify-between">
                            <input type="search" placeholder="Buscar equipo..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-1/3 pl-4 pr-4 py-2 text-base rounded-lg bg-neutral-100 dark:bg-neutral-800 border-2 border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white" />
                            <div className="flex items-center space-x-1 border border-neutral-300 dark:border-neutral-700 rounded-full p-1">
                                <button onClick={() => setActiveCategory('Maquinaria')} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${activeCategory === 'Maquinaria' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>Maquinaria</button>
                                <button onClick={() => setActiveCategory('Accesorios')} className={`px-4 py-1 text-sm font-semibold rounded-full transition-colors ${activeCategory === 'Accesorios' ? 'bg-primary-600 text-white' : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>Accesorios</button>
                            </div>
                        </div>
                        <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-3">
                            {filteredProducts.map(product => (<ProductListItem key={product.id} product={product} onAdd={handleAddItem} isAdded={currentPackageItems.some(i => i.equipment.id === product.id)} />))}
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col bg-neutral-100 dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800">
                        <div className="flex-1 flex flex-col overflow-y-hidden">
                            <div className="p-4 flex-shrink-0">
                                <label htmlFor="packageName" className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Nombre del Paquete</label>
                                <input id="packageName" type="text" value={currentPackageName} onChange={(e) => setCurrentPackageName(e.target.value)} className="mt-1 w-full p-2 text-lg font-bold rounded-md bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
                            </div>
                            <div className="flex-grow p-4 pt-0 space-y-2 overflow-y-auto">
                                {currentPackageItems.length > 0 ? currentPackageItems.map(item => (
                                    <div key={item.equipment.id} className="flex items-center space-x-2 bg-white dark:bg-neutral-800/50 p-2 rounded-lg text-sm">
                                        <img src={item.equipment.imageUrls[0]} alt={item.equipment.name} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                                        <div className="flex-grow">
                                            <p className="font-semibold truncate text-neutral-800 dark:text-neutral-200">{item.equipment.name}</p>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <button onClick={() => handleUpdateQuantity(item.equipment.id, item.quantity - 1)} className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 font-bold text-sm flex items-center justify-center">-</button>
                                                <span className="font-semibold w-4 text-center text-sm">{item.quantity}</span>
                                                <button onClick={() => handleUpdateQuantity(item.equipment.id, item.quantity + 1)} className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 font-bold text-sm flex items-center justify-center">+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => handleRemoveItem(item.equipment.id)} className="p-1 rounded-full text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 10-2 0v10H6V6h1.382l.724 1.447A1 1 0 009 8h2a1 1 0 00.894-.553L12.618 6H14a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 009 2z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                )) : <p className="text-center text-neutral-500 py-8">Añade productos del catálogo.</p>}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col overflow-y-hidden border-t border-neutral-200 dark:border-neutral-700">
                             <h3 className="p-4 text-sm font-semibold tracking-wider uppercase text-neutral-600 dark:text-neutral-400 flex-shrink-0">Paquetes Guardados</h3>
                            <div className="flex-grow p-4 pt-0 space-y-2 overflow-y-auto">
                                {savedPackages.length > 0 ? savedPackages.map(pkg => (
                                    <div key={pkg.id} className="bg-white dark:bg-neutral-800/50 p-3 rounded-lg">
                                        <p className="font-semibold text-neutral-800 dark:text-neutral-200">{pkg.name}</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{pkg.items.reduce((acc, item) => acc + item.quantity, 0)} productos</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <button onClick={() => handleLoadPackage(pkg.id)} className="text-xs font-semibold bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 px-3 py-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 transition-colors">Cargar</button>
                                            <button onClick={() => handleDeletePackage(pkg.id)} className="text-xs font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 px-3 py-1 rounded-md transition-colors">Eliminar</button>
                                        </div>
                                    </div>
                                )) : <p className="text-center text-neutral-500 py-8">No tienes paquetes guardados.</p>}
                            </div>
                        </div>
                        
                        <div className="flex-shrink-0 p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-black/20 space-y-3">
                            <div className="flex justify-between items-center font-bold">
                                <span className="text-neutral-600 dark:text-neutral-300">Total:</span>
                                <span className="text-2xl text-primary-600 dark:text-primary-400">{formatCurrency(totalPrice)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={handleSavePackage} className="w-full bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white font-semibold py-3 px-4 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors border border-neutral-300 dark:border-neutral-600">Guardar Paquete</button>
                                <button onClick={handleAddToCartAndClose} className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors">Añadir al Carrito</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GymBuilderModal;
