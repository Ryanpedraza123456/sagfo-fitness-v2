import React from 'react';
import { EquipmentItem } from '../types';

interface ComparisonBarProps {
  items: EquipmentItem[];
  onCompare: () => void;
  onClear: () => void;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({ items, onCompare, onClear }) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-8 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] p-2 pl-6 pr-2 flex items-center gap-6 border border-neutral-200/50 dark:border-white/10 transform transition-all duration-500 ease-out animate-in slide-in-from-bottom-10 fade-in">

        <div className="flex items-center gap-3">
          <span className="text-neutral-500 dark:text-neutral-400 font-medium text-sm hidden sm:block">
            Comparando
          </span>

          <div className="flex space-x-2">
            {items.map((item) => (
              <div key={item.id} className="relative w-10 h-10 rounded-full ring-2 ring-white dark:ring-[#1c1c1e] overflow-hidden bg-white dark:bg-zinc-800 shadow-sm">
                <img
                  src={item.imageUrls[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {Array.from({ length: Math.max(0, 2 - items.length) }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="w-10 h-10 rounded-full ring-2 ring-white dark:ring-[#1c1c1e] bg-neutral-100 dark:bg-zinc-800/50 border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center"
              >
                <span className="text-neutral-300 dark:text-neutral-600 text-lg font-light">+</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8 w-px bg-neutral-200 dark:bg-white/10 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCompare}
            disabled={items.length < 2}
            className="bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-2.5 px-6 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-neutral-500/20 dark:shadow-none text-sm"
          >
            Comparar ({items.length})
          </button>

          <button
            onClick={onClear}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-zinc-700 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            aria-label="Limpiar comparación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;