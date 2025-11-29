

import React, { useRef, useState, useEffect } from 'react';
import { SortOrder, CategoryFilter, MuscleFilter } from '../types';

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

  // Dynamic sub-menus based on category
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
    <div className="mb-8 space-y-4">
      <div className="relative w-full md:hidden mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500 dark:text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Buscar equipo..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full h-11 pl-10 pr-4 rounded-lg bg-neutral-100 dark:bg-zinc-800 border-2 border-transparent focus:ring-2 focus:ring-primary-500 text-sm placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus:outline-none text-neutral-900 dark:text-white"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6">
        {/* Mobile Category Select */}
        <div className="w-full md:hidden">
          <div className="relative">
            <select
              id="category-filter-mobile"
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value as CategoryFilter)}
              className="appearance-none w-full h-11 pl-4 pr-10 text-sm rounded-lg bg-neutral-100 dark:bg-zinc-800 border-2 border-transparent focus:ring-2 focus:ring-primary-500 focus:outline-none text-neutral-700 dark:text-neutral-300 font-medium"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-neutral-500 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Desktop Category Tabs */}
        <div className="hidden md:flex justify-center items-center">
          <div className="relative inline-flex items-center p-1 bg-neutral-200 dark:bg-zinc-700 rounded-full">
            <span
              className="absolute top-1 h-9 bg-white dark:bg-zinc-600 rounded-full shadow-sm transition-all duration-300 ease-in-out"
              style={sliderStyle}
              aria-hidden="true"
            />
            {categories.map((category, index) => (
              <button
                key={category}
                ref={el => { tabsRef.current[index] = el; }}
                onClick={() => onCategoryFilterChange(category)}
                className={`relative z-10 px-6 h-9 flex items-center text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-700 ${categoryFilter === category
                  ? 'text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Category / Muscle Filter Bar */}
      <div className="w-full mt-6">
        <div className="flex flex-col md:flex-row justify-center items-center gap-3">
          <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
            {categoryFilter === 'Maquinaria' ? 'Navegar por músculo:' : 'Filtrar por tipo:'}
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {currentSubFilters.map(muscle => (
              <button
                key={muscle}
                onClick={() => onMuscleFilterChange(muscle)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${muscleFilter === muscle
                    ? 'bg-neutral-800 text-white border-neutral-800 dark:bg-white dark:text-black dark:border-white'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100 dark:bg-zinc-800 dark:text-neutral-300 dark:border-zinc-700 dark:hover:bg-zinc-700'
                  }`}
              >
                {muscle}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListHeader;
