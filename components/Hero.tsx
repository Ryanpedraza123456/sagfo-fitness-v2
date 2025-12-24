import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../types';
import { ChevronLeft, ChevronRight, Edit3, ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onCartClick: () => void;
  slides: HeroSlide[];
  isAdmin: boolean;
  onEdit: () => void;
  onPromosClick: () => void;
  isLoggedIn: boolean;
}

const Hero: React.FC<HeroProps> = ({ onCartClick, slides, isAdmin, onEdit, onPromosClick, isLoggedIn }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden bg-black">
      {isAdmin && (
        <button
          onClick={onEdit}
          className="absolute top-8 right-8 z-50 bg-white/10 hover:bg-white text-white hover:text-black p-4 rounded-2xl backdrop-blur-xl transition-all duration-500 shadow-2xl group border border-white/10"
        >
          <Edit3 size={20} className="group-hover:rotate-[15deg] transition-transform" />
        </button>
      )}

      {/* Slides Loop */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[1500ms] cubic-bezier(0.4, 0, 0.2, 1) ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-100 pointer-events-none'}`}
        >
          {/* Background Image - Restored to Cover for full immersive experience */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={slide.imageUrl}
              alt={slide.titleLine1}
              className={`w-full h-full object-cover object-center transition-all duration-[1000ms] ease-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            />
            {/* Multi-layered Overlays for Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
          </div>

          {/* Content Architecture - Left Aligned for "Distributed" feel */}
          <div className="relative z-20 h-full container mx-auto px-10 md:px-16 lg:px-24 flex flex-col justify-center">
            <div className="max-w-4xl">
              <div className={`space-y-6 transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-primary-600 rounded-full" />
                  <span className="text-primary-500 font-black uppercase tracking-[0.5em] text-[10px] italic">Elite Fitness Experience</span>
                </div>

                <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white uppercase italic tracking-tighter leading-[0.85] flex flex-col">
                  {slide.titleLine1 && <span className="block drop-shadow-2xl">{slide.titleLine1}</span>}
                  {slide.titleLine2 && (
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 drop-shadow-2xl">
                      {slide.titleLine2}
                    </span>
                  )}
                </h1>

                {slide.subtitle && (
                  <p className="text-neutral-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed italic opacity-90 border-l-4 border-primary-600 pl-6 drop-shadow-md">
                    {slide.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap gap-5 pt-12 md:pt-16">
                  <button
                    onClick={onCartClick}
                    className="group relative bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-primary-600 hover:text-white transition-all duration-500 shadow-2xl active:scale-95 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoggedIn ? 'Ver Catálogo' : 'Regístrate'} <ArrowUpRight size={18} strokeWidth={3} />
                    </span>
                  </button>
                  <button
                    onClick={onPromosClick}
                    className="group px-12 py-5 rounded-2xl border border-white/20 text-white font-black uppercase tracking-[0.3em] text-xs hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md active:scale-95"
                  >
                    Promociones
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modern Navigation Controls */}
      {slides.length > 1 && (
        <>
          <div className="absolute bottom-12 left-12 z-30 flex items-center gap-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1 transition-all duration-700 rounded-full ${idx === currentSlide ? 'w-16 bg-primary-600' : 'w-8 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>

          <div className="absolute bottom-12 right-12 z-30 flex gap-4">
            <button
              onClick={prevSlide}
              className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-xl group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-xl group"
            >
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;
