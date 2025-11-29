import React from 'react';
import { EquipmentItem } from '../types';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: EquipmentItem[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, items }) => {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const allSpecs = [...new Set(items.flatMap(item => Object.keys(item.specifications)))];
  const allFeatures = [...new Set(items.flatMap(item => item.features))];

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className={`relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Comparar Productos</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="overflow-x-auto overflow-y-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead className="sticky top-0 bg-neutral-50 dark:bg-neutral-800">
              <tr>
                <th className="p-4 w-1/4 font-semibold text-neutral-800 dark:text-neutral-200">Característica</th>
                {items.map(item => (
                  <th key={item.id} className="p-4 w-1/4 border-l border-neutral-200 dark:border-neutral-700">
                    <div className="flex flex-col items-center text-center">
                        <img src={item.imageUrls[0]} alt={item.name} className="w-24 h-24 object-cover rounded-lg mb-2" />
                        <h3 className="font-bold text-base text-neutral-900 dark:text-white">{item.name}</h3>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                <td className="p-4 font-semibold">Precio</td>
                {items.map(item => (
                  <td key={item.id} className="p-4 border-l border-neutral-200 dark:border-neutral-700 text-lg font-bold text-primary-600 dark:text-primary-400 text-center">{formatCurrency(item.price)}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold">Descripción</td>
                {items.map(item => (
                  <td key={item.id} className="p-4 border-l border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300">{item.description}</td>
                ))}
              </tr>
              
              <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                <td colSpan={items.length + 1} className="p-3 font-bold text-neutral-800 dark:text-neutral-200">Especificaciones</td>
              </tr>
              {allSpecs.map(specKey => (
                 <tr key={specKey as string}>
                    <td className="p-4 font-medium text-neutral-500 dark:text-neutral-400">{specKey as string}</td>
                    {items.map(item => (
                        <td key={item.id} className="p-4 border-l border-neutral-200 dark:border-neutral-700 text-center text-neutral-700 dark:text-neutral-300">
                            {/* FIX: Cast 'specKey' to string to resolve "Type 'unknown' cannot be used as an index type" error. */}
                            {item.specifications[specKey as string] || 'N/A'}
                        </td>
                    ))}
                 </tr>
              ))}
              
              <tr className="bg-neutral-50 dark:bg-neutral-800/50">
                <td colSpan={items.length + 1} className="p-3 font-bold text-neutral-800 dark:text-neutral-200">Características Clave</td>
              </tr>
              {allFeatures.map(feature => (
                <tr key={feature as string}>
                    <td className="p-4 font-medium text-neutral-500 dark:text-neutral-400">{feature as string}</td>
                     {items.map(item => (
                        <td key={item.id} className="p-4 border-l border-neutral-200 dark:border-neutral-700 text-center">
                            {item.features.includes(feature as string) ? 
                                (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>) : 
                                (<span className="text-neutral-400">-</span>)
                            }
                        </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
