
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CartItem, PaymentMethod, BankAccount } from '../types';
import { useAuth } from '../hooks/useAuth';
import { colombianDepartments } from '../data/colombia';

declare global {
    interface Window {
        L: any;
    }
}

interface QuoteCartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onRemoveItem: (productId: string) => void;
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onSubmit: (
        userInfo: { name: string; email: string; phone: string; message: string; city: string; department: string; mapsLink?: string; address?: string },
        paymentMethod: PaymentMethod,
        financials: { totalOrderValue: number; amountPaid: number; amountPending: number },
        productionDetails?: { structureColor: string; upholsteryColor: string },
        paymentProofFile?: File
    ) => void;
    onLoginClick: () => void;
    onUpdateItemCustomization: (productId: string, field: 'structureColor' | 'upholsteryColor', value: string) => void;
    bankAccounts: BankAccount[];
}

const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(value);

const QuoteCartModal: React.FC<QuoteCartModalProps> = ({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onSubmit, onLoginClick, onUpdateItemCustomization, bankAccounts }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', city: '', department: '', mapsLink: '', address: '' });

    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Map Refs
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [isMapVisible, setIsMapVisible] = useState(false);

    const availableCities = useMemo(() => {
        const dept = colombianDepartments.find(d => d.name === formData.department);
        return dept ? dept.cities : [];
    }, [formData.department]);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                department: user.department || '',
                address: user.address || '',
                message: '',
                mapsLink: user.locationUrl || ''
            });

            // If user has a location saved, try to show map
            if (user.locationUrl && user.locationUrl.includes('maps')) {
                setIsMapVisible(true);
            }
        } else if (!user) {
            setFormData({ name: '', email: '', phone: '', message: '', city: '', department: '', mapsLink: '', address: '' });
            setIsMapVisible(false);
        }
    }, [user, isOpen]);

    // Initialize Map when visible
    useEffect(() => {
        if (isOpen && isMapVisible && mapContainerRef.current) {
            // Use requestAnimationFrame for smoother initialization
            requestAnimationFrame(() => {
                const coords = parseMapsLink(formData.mapsLink) || { lat: 4.6097, lng: -74.0817 }; // Default Bogota
                initMap(coords.lat, coords.lng);
            });
        }
    }, [isOpen, isMapVisible, formData.mapsLink]);

    // Parse Google Maps Link
    const parseMapsLink = (link: string) => {
        try {
            const url = new URL(link);
            const q = url.searchParams.get('q');
            if (q) {
                const [lat, lng] = q.split(',').map(Number);
                if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
            }
        } catch (e) {
            return null;
        }
        return null;
    };

    const initMap = (lat: number, lng: number) => {
        if (typeof window === 'undefined' || !window.L || !mapContainerRef.current) {
            console.warn('Map dependencies not ready');
            return;
        }

        try {
            if (!mapRef.current) {
                // Force container to have dimensions
                mapContainerRef.current.style.width = '100%';
                mapContainerRef.current.style.height = '100%';

                mapRef.current = window.L.map(mapContainerRef.current, {
                    center: [lat, lng],
                    zoom: 16,
                    zoomControl: true
                });

                window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap',
                    maxZoom: 19
                }).addTo(mapRef.current);
            } else {
                mapRef.current.setView([lat, lng], 16);
                // Force map to recalculate size
                setTimeout(() => {
                    if (mapRef.current) {
                        mapRef.current.invalidateSize();
                    }
                }, 100);
            }

            // Custom Icon to avoid 404s with webpack/react issues in some setups
            const icon = window.L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = window.L.marker([lat, lng], { draggable: true, icon }).addTo(mapRef.current);
                markerRef.current.on('dragend', (event: any) => {
                    const position = event.target.getLatLng();
                    const mapsUrl = `https://www.google.com/maps?q=${position.lat},${position.lng}`;
                    setFormData(prev => ({ ...prev, mapsLink: mapsUrl }));
                });
            }
        } catch (error) {
            console.error('Error initializing map:', error);
        }
    };

    // --- LOGIC FOR SPLIT PAYMENTS ---
    const calculation = useMemo(() => {
        let inStockTotal = 0;
        let productionTotal = 0;
        let hasProductionItems = false;
        let hasInStockItems = false;

        cartItems.forEach(item => {
            const itemTotal = item.equipment.price * item.quantity;
            if (item.equipment.availabilityStatus === 'made-to-order') {
                productionTotal += itemTotal;
                hasProductionItems = true;
            } else {
                inStockTotal += itemTotal;
                hasInStockItems = true;
            }
        });

        const totalOrderValue = inStockTotal + productionTotal;

        // Logic: 100% of In-Stock + 50% of Production
        const amountPaid = inStockTotal + (productionTotal * 0.5);
        const amountPending = productionTotal * 0.5;

        let paymentMethod: PaymentMethod = 'standard';
        if (hasProductionItems && hasInStockItems) paymentMethod = 'mixed';
        else if (hasProductionItems) paymentMethod = 'production';

        return {
            inStockTotal,
            productionTotal,
            totalOrderValue,
            amountPaid,
            amountPending,
            paymentMethod,
            hasProductionItems,
            hasInStockItems
        };
    }, [cartItems]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, department: e.target.value, city: '' }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("La geolocalización no es compatible con tu navegador.");
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                setFormData(prev => ({ ...prev, mapsLink: mapsUrl }));
                setIsLocating(false);
                setIsMapVisible(true);
                // Init map will happen via useEffect
            },
            (error) => {
                console.error(error);
                alert("No se pudo obtener tu ubicación. Por favor, asegúrate de dar permisos de ubicación o ingresa el enlace manualmente.");
                setIsLocating(false);
            }
        );
    };

    const toggleMapManual = () => {
        setIsMapVisible(!isMapVisible);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Validate production items have colors
        if (calculation.hasProductionItems) {
            const missingCustomization = cartItems.some(item =>
                item.equipment.availabilityStatus === 'made-to-order' &&
                (!item.structureColor?.trim() || !item.upholsteryColor?.trim())
            );

            if (missingCustomization) {
                alert('Por favor, completa los colores de estructura y tapicería para todos los productos de producción.');
                return;
            }
        }

        if (!paymentProof) {
            alert('Es obligatorio adjuntar el comprobante de pago/transferencia.');
            return;
        }

        if (!formData.address || formData.address.trim() === '') {
            alert('Por favor ingresa una dirección de entrega escrita.');
            return;
        }

        const financials = {
            totalOrderValue: calculation.totalOrderValue,
            amountPaid: calculation.amountPaid,
            amountPending: calculation.amountPending
        };

        onSubmit(formData, calculation.paymentMethod, financials, undefined, paymentProof || undefined);

        // RESET STATE
        setPaymentProof(null);
        setFormData(prev => ({ ...prev, message: '' }));
        setIsMapVisible(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            <div
                className={`relative bg-neutral-100 dark:bg-neutral-900 w-full max-w-lg h-full flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Carrito de Compras</h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-neutral-500 dark:text-neutral-400">Tu carrito de compras está vacío.</p>
                            <button
                                onClick={onClose}
                                className="mt-4 text-primary-600 dark:text-primary-400 font-semibold"
                            >
                                Seguir explorando
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-8">
                                {cartItems.map(item => (
                                    <div key={item.equipment.id + (item.selectedColor || '') + (item.selectedWeight || '')} className="flex flex-col space-y-3 bg-white dark:bg-neutral-800/50 p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                        <div className="flex items-start space-x-4">
                                            <img src={item.equipment.imageUrls[0]} alt={item.equipment.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                            <div className="flex-grow min-w-0">
                                                <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm truncate">{item.equipment.name}</h3>
                                                <div className="flex flex-col gap-1 mt-1">
                                                    {item.equipment.availabilityStatus === 'made-to-order' ? (
                                                        <span className="w-fit text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Producción</span>
                                                    ) : (
                                                        <span className="w-fit text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Entrega Inmediata</span>
                                                    )}
                                                    {item.selectedColor && (
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                            Color: <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.selectedColor}</span>
                                                        </span>
                                                    )}
                                                    {item.selectedWeight && (
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                            Peso: <span className="font-medium text-neutral-800 dark:text-neutral-200">{item.selectedWeight}</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="flex items-center space-x-3">
                                                        <button onClick={() => onUpdateQuantity(item.equipment.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 font-bold text-neutral-600 dark:text-neutral-300 flex items-center justify-center">-</button>
                                                        <span className="font-semibold text-neutral-900 dark:text-white">{item.quantity}</span>
                                                        <button onClick={() => onUpdateQuantity(item.equipment.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 font-bold text-neutral-600 dark:text-neutral-300 flex items-center justify-center">+</button>
                                                    </div>
                                                    <p className="font-bold text-primary-600 dark:text-primary-400">{formatCurrency(item.equipment.price * item.quantity)}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => onRemoveItem(item.equipment.id)} className="text-neutral-400 hover:text-red-500 p-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 10-2 0v10H6V6h1.382l.724 1.447A1 1 0 009 8h2a1 1 0 00.894-.553L12.618 6H14a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 009 2z" clipRule="evenodd" /></svg>
                                            </button>
                                        </div>

                                        {/* Customization Inputs for Made-to-Order items */}
                                        {item.equipment.availabilityStatus === 'made-to-order' && (
                                            <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                                                <div className="flex items-center mb-2">
                                                    <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded mr-2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 10v4.243zM16 4l-4 4-2.5-2.5 4-4L16 4z" clipRule="evenodd" /></svg>
                                                    </div>
                                                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Personaliza tu equipo</span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Color Estructura</label>
                                                        <input
                                                            type="text"
                                                            value={item.structureColor || ''}
                                                            onChange={(e) => onUpdateItemCustomization(item.equipment.id, 'structureColor', e.target.value)}
                                                            placeholder="Ej: Negro Mate"
                                                            className="w-full mt-1 p-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 dark:text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase">Color Tapicería</label>
                                                        <input
                                                            type="text"
                                                            value={item.upholsteryColor || ''}
                                                            onChange={(e) => onUpdateItemCustomization(item.equipment.id, 'upholsteryColor', e.target.value)}
                                                            placeholder="Ej: Rojo Sangre"
                                                            className="w-full mt-1 p-2 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-neutral-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 dark:text-neutral-400">Items en Stock ({calculation.inStockTotal > 0 ? '100%' : '0'}):</span>
                                    <span className="font-semibold text-neutral-900 dark:text-white">{formatCurrency(calculation.inStockTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 dark:text-neutral-400">Items Producción (50% anticipo):</span>
                                    <span className="font-semibold text-neutral-900 dark:text-white">{formatCurrency(calculation.productionTotal)}</span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-700">
                                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">A Pagar Ahora:</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-neutral-900 dark:text-white block">{formatCurrency(calculation.amountPaid)}</span>
                                        {calculation.amountPending > 0 && (
                                            <span className="text-xs text-neutral-500 dark:text-neutral-400">Pendiente Contra entrega: {formatCurrency(calculation.amountPending)}</span>
                                        )}
                                    </div>
                                </div>

                                {!user ? (
                                    <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-center">
                                        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">Para finalizar tu pedido, necesitas iniciar sesión.</p>
                                        <button onClick={onLoginClick} className="w-full bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors">Iniciar Sesión</button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                                        <h3 className="font-bold text-neutral-900 dark:text-white">Datos de Contacto</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Nombre"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                name="phone"
                                                placeholder="Teléfono"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
                                            />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Correo Electrónico"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative">
                                                <select
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleDepartmentChange}
                                                    required
                                                    className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white appearance-none"
                                                >
                                                    <option value="">Departamento</option>
                                                    {colombianDepartments.map(dept => (
                                                        <option key={dept.name} value={dept.name}>{dept.name}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-neutral-500 dark:text-neutral-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>

                                            <div className="relative">
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                    disabled={!formData.department}
                                                    className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <option value="">Ciudad</option>
                                                    {availableCities.map(city => (
                                                        <option key={city} value={city}>{city}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-neutral-500 dark:text-neutral-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Geolocation Section */}
                                        <div className="space-y-3 bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
                                            <div className="flex justify-between items-center flex-wrap gap-2">
                                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Ubicación Exacta</label>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={toggleMapManual}
                                                        className={`text-xs font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${isMapVisible ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}
                                                    >
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                                                        {isMapVisible ? 'Ocultar Mapa' : 'Seleccionar en Mapa'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleGetLocation}
                                                        disabled={isLocating}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                    >
                                                        {isLocating ? 'Obteniendo...' : (
                                                            <>
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                                Usar GPS
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {isMapVisible && (
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-600 z-0 bg-neutral-200 dark:bg-neutral-700">
                                                    <div ref={mapContainerRef} className="w-full h-full z-0" />
                                                    <div className="absolute top-2 left-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm px-2 py-1 text-[10px] rounded pointer-events-none z-[1000]">
                                                        Arrastra el marcador para ajustar
                                                    </div>
                                                </div>
                                            )}

                                            <input
                                                type="text"
                                                name="mapsLink"
                                                value={formData.mapsLink}
                                                onChange={handleInputChange}
                                                placeholder="Enlace de Google Maps (Opcional)"
                                                className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs text-neutral-500 outline-none"
                                                readOnly={isMapVisible}
                                            />
                                            <p className="text-[10px] text-neutral-400">Permite al repartidor llegar exactamente a tu dirección. {isMapVisible && "Arrastra el pin en el mapa para mayor precisión."}</p>

                                            <textarea
                                                name="address"
                                                placeholder="Dirección de Entrega / Confirmación (Barrio, Conjunto, Torre, Apto)..."
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                rows={2}
                                                className="w-full mt-2 p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-primary-500 text-neutral-900 dark:text-white placeholder:text-neutral-400"
                                            />
                                        </div>

                                        <textarea
                                            name="message"
                                            placeholder="Mensaje adicional (opcional)"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            rows={2}
                                            className="w-full p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 text-neutral-900 dark:text-white"
                                        />

                                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                                            <h3 className="font-bold text-neutral-900 dark:text-white mb-2">Pago</h3>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 mb-4">
                                                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">Cuentas Disponibles:</p>
                                                <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                                                    {bankAccounts.map(acc => (
                                                        <li key={acc.id} className="flex justify-between">
                                                            <span><strong>{acc.bankName}</strong> ({acc.accountType})</span>
                                                            <span className="font-mono">{acc.accountNumber}</span>
                                                        </li>
                                                    ))}
                                                    {bankAccounts.length === 0 && <li>No hay cuentas configuradas. Contacte al administrador.</li>}
                                                </ul>
                                            </div>

                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                                                Adjuntar Comprobante de Pago
                                            </label>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*,.pdf"
                                                className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-primary-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-primary-700 transition-colors shadow-lg hover:shadow-primary-500/30"
                                        >
                                            Enviar Pedido
                                        </button>
                                    </form>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuoteCartModal;
