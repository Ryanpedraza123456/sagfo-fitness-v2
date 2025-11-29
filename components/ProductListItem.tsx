

import React from 'react';
import { EquipmentItem } from '../types';

interface ProductListItemProps {
    product: EquipmentItem;
    onAdd: (product: EquipmentItem) => void;
    isAdded: boolean;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onAdd, isAdded }) => {
    return (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-3 flex items-center space-x-4 shadow-sm border border-neutral-200 dark:border-zinc-700 transition-shadow hover:shadow-md">
            <img src={product.imageUrls[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-grow">
                <p className="font-semibold text-neutral-800 dark:text-neutral-200">{product.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{product.category}</p>
            </div>
            <button
                onClick={() => onAdd(product)}
                disabled={isAdded}
                className={`w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isAdded 
                        ? 'bg-green-500 text-white cursor-default' 
                        : 'bg-primary-500 hover:bg-primary-600 text-white transform hover:scale-110'
                }`}
                aria-label={isAdded ? 'Añadido' : 'Añadir al paquete'}
            >
                {isAdded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default ProductListItem;