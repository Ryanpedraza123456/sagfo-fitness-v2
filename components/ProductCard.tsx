




import React, { useState } from 'react';
import { EquipmentItem } from '../types';

interface ProductCardProps {
  product: EquipmentItem;
  onClick: () => void;
  onToggleCompare: () => void;
  isComparing: boolean;
  isAdmin: boolean;
  onEdit: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onToggleCompare, isComparing, isAdmin, onEdit }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.imageUrls.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.imageUrls.length) % product.imageUrls.length);
  };

  // Determine price to show
  const hasDiscount = product.isPromotion && product.promotionalPrice && product.promotionalPrice < product.price;
  const currentPrice = hasDiscount ? product.promotionalPrice! : product.price;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white dark:bg-zinc-800/50 rounded-3xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-neutral-200 dark:border-zinc-800 flex flex-col"
    >
      <div className="relative w-full h-60 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
        {product.imageUrls.map((url, index) => (
            <img
              key={url}
              src={url}
              alt={`${product.name} ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            />
        ))}

        <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start gap-1">
             {product.availabilityStatus === 'in-stock' ? (
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-emerald-500/90 text-white shadow-sm backdrop-blur-sm">
                    Entrega Inmediata
                </span>
            ) : (
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-amber-500/90 text-white shadow-sm backdrop-blur-sm">
                    Bajo Pedido
                </span>
            )}
            
            {hasDiscount && (
                <span className="px-2 py-1 rounded-md text-xs font-bold bg-red-600/90 text-white shadow-sm backdrop-blur-sm animate-pulse">
                    OFERTA
                </span>
            )}
        </div>

        {product.imageUrls.length > 1 && (
          <>
            <button 
              onClick={prevImage} 
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 focus:outline-none"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 focus:outline-none"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {isAdmin && (
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                }}
                className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all duration-300"
                aria-label="Editar producto"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
            </button>
        )}

        <button
            onClick={(e) => {
                e.stopPropagation();
                onToggleCompare();
            }}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 ${isComparing ? 'bg-primary-600 text-white scale-110' : 'bg-black/30 text-white hover:bg-black/50'}`}
            aria-label={isComparing ? "Quitar de la comparación" : "Añadir a la comparación"}
        >
            {isComparing ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
            )}
        </button>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
            <h3 className="text-md font-bold text-neutral-900 dark:text-white">{product.name}</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{product.category}</p>
        </div>
        <div className="mt-4">
            {hasDiscount ? (
                <div className="flex flex-col">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400 line-through decoration-red-500">{formatCurrency(product.price)}</span>
                    <span className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(currentPrice)}</span>
                </div>
            ) : (
                <p className="text-xl text-primary-600 dark:text-primary-400 font-bold">{formatCurrency(product.price)}</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;