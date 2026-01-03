
import React, { useRef, useState, useEffect } from 'react';
import { SortOrder, CategoryFilter, MuscleFilter } from '../types';
import { Layers, Package, Search, ChevronDown } from 'lucide-react';

interface ProductListHeaderProps {
  sortOrder: SortOrder;
  onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (category: CategoryFilter) => void;
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  muscleFilter: MuscleFilter;
  onMuscleFilterChange: (muscle: MuscleFilter) => void;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({ sortOrder, onSortChange, categoryFilter, onCategoryFilterChange, searchTerm, onSearchChange, muscleFilter, onMuscleFilterChange }) => {
  const categories: CategoryFilter[] = ['Maquinaria', 'Accesorios'];
  const machinerySubFilters: MuscleFilter[] = ['Todos', 'Pecho', 'Espalda', 'Pierna', 'Brazo', 'Hombro', 'Cardio', 'Abdomen'];
  const accessorySubFilters: MuscleFilter[] = ['Todos', 'Peso Libre', 'Funcional', 'Barras', 'Discos', 'Mancuernas', 'Bancos', 'Agarres', 'Soportes'];

  const currentSubFilters = categoryFilter === 'Maquinaria' ? machinerySubFilters : accessorySubFilters;
  const activeIndex = categories.indexOf(categoryFilter);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [sliderStyle, setSliderStyle] = useState({});

  useEffect(() => {
    const setSlider = () => {
      const activeTabNode = tabsRef.current[activeIndex];
      if (activeTabNode) {
        setSliderStyle({
          width: `${activeTabNode.offsetWidth}px`,
          transform: `translateX(${activeTabNode.offsetLeft}px)`,
        });
      }
    };
    setSlider();
    window.addEventListener('resize', setSlider);
    return () => window.removeEventListener('resize', setSlider);
  }, [activeIndex]);

  return (
    <div className="mb-12 md:mb-20 space-y-12 md:space-y-20 animate-fadeIn">
      {/* Search & Tool Hub */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-8 md:gap-12">

        {/* Elite Category Switcher */}
        {/* Elite Category Switcher - Fixed Visibility */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <div className="relative inline-flex items-center p-1.5 md:p-2 bg-neutral-100 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-full border border-neutral-200 dark:border-white/10 shadow-inner">
            {/* Animated Background Pill */}
            <span
              className="absolute top-1.5 md:top-2 h-[calc(100%-12px)] md:h-[calc(100%-16px)] bg-primary-600 rounded-full shadow-lg transition-all duration-700 cubic-bezier(0.23, 1, 0.32, 1)"
              style={sliderStyle}
              aria-hidden="true"
            />

            <button
              ref={el => { tabsRef.current[0] = el; }}
              onClick={() => onCategoryFilterChange('Maquinaria')}
              className={`relative z-10 px-4 md:px-12 py-2.5 md:py-4 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full transition-all duration-700 flex items-center gap-2 md:gap-3 italic whitespace-nowrap ${categoryFilter === 'Maquinaria'
                ? 'text-white'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              <Layers size={14} className="md:w-4 md:h-4" strokeWidth={3} />
              Maquinaria
            </button>

            <button
              ref={el => { tabsRef.current[1] = el; }}
              onClick={() => onCategoryFilterChange('Accesorios')}
              className={`relative z-10 px-4 md:px-12 py-2.5 md:py-4 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full transition-all duration-700 flex items-center gap-2 md:gap-3 italic whitespace-nowrap ${categoryFilter === 'Accesorios'
                ? 'text-white'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
            >
              <Package size={14} className="md:w-4 md:h-4" strokeWidth={3} />
              Accesorios
            </button>
          </div>
        </div>

        {/* Dynamic Catalog Search (Boutique Style) */}
        <div className="flex-grow max-w-2xl w-full block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none group-focus-within:text-primary-600 transition-colors">
              <Search size={18} strokeWidth={3} className="text-neutral-400 dark:text-neutral-500 opacity-60 group-focus-within:opacity-100" />
            </div>
            <input
              type="text"
              placeholder="EXPLORAR INGENIERÍA SAGFO..."
              value={searchTerm}
              onChange={onSearchChange}
              className="w-full h-14 md:h-16 pl-14 md:pl-16 pr-8 bg-neutral-50 dark:bg-zinc-900 border border-neutral-100 dark:border-white/5 rounded-[2rem] text-[10px] md:text-xs font-black uppercase tracking-widest text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-4 focus:ring-primary-600/5 focus:bg-white dark:focus:bg-zinc-800 transition-all duration-500 shadow-sm"
            />
          </div>
        </div>

        {/* Global Catalog Filter */}
        <div className="relative group w-full md:w-auto">
          <select
            value={sortOrder}
            onChange={onSortChange}
            className="w-full md:min-w-[240px] h-14 md:h-16 appearance-none bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-none rounded-[1.5rem] md:rounded-[1.75rem] pl-6 md:pl-8 pr-12 md:pr-14 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] italic focus:outline-none focus:ring-4 focus:ring-primary-500/10 cursor-pointer shadow-2xl transition-all"
          >
            <option value="default">Prioridad Elite</option>
            <option value="price-asc">Menor Inversión</option>
            <option value="price-desc">Mayor Inversión</option>
          </select>
          <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-white/40 dark:text-neutral-900/40 font-bold">
            <ChevronDown size={18} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Specialty Navigation Hub */}
      <div className="pt-8 md:pt-12 border-t border-neutral-100 dark:border-white/5">
        <div className="flex flex-col items-center gap-6 md:gap-10">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-neutral-200 dark:to-white/10" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] italic text-primary-600 text-center">
              {categoryFilter === 'Maquinaria' ? 'Arquitectura Muscular' : 'Ecosistema de Entrenamiento'}
            </span>
            <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-neutral-200 dark:to-white/10" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar w-full pb-2">
            {currentSubFilters.map((sub) => (
              <button
                key={sub}
                onClick={() => onMuscleFilterChange(sub)}
                className={`px-6 md:px-10 py-3 md:py-4 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic transition-all duration-500 whitespace-nowrap ${muscleFilter === sub
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-105'
                  : 'bg-white dark:bg-white/5 border border-neutral-100 dark:border-white/10 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-primary-500/50'
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListHeader;
