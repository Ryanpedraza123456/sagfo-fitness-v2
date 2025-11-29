

import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const options: { id: Theme; label: string }[] = [
    { id: 'light', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'auto', label: 'Auto' },
  ];
  const activeIndex = options.findIndex(opt => opt.id === theme);

  return (
    <div className="fixed bottom-5 left-5 z-50">
      <div className="relative flex items-center p-0.5 bg-neutral-200 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full shadow-lg border border-neutral-300 dark:border-neutral-700">
        <div 
          className="absolute top-[2px] left-[2px] h-7 w-14 bg-primary-600 rounded-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(calc(${activeIndex} * 3.5rem))` }} // 3.5rem = w-14 (56px)
        />
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`relative z-10 w-14 h-7 text-xs font-semibold rounded-full transition-colors duration-300 focus:outline-none ${
              theme === option.id ? 'text-white' : 'text-blue-500 dark:text-blue-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
