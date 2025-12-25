
import React, { useState, useRef, useEffect } from 'react';
import { GalleryImage } from '../types';
import { X, Maximize2, Camera } from 'lucide-react';
import { createPortal } from 'react-dom';

interface GallerySectionProps {
  images: GalleryImage[];
  isAdmin: boolean;
}

const GallerySection: React.FC<GallerySectionProps> = ({ images, isAdmin }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollPosRef = useRef(0);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Duplicamos las imágenes para el efecto de loop infinito sin saltos
  const displayImages = [...images, ...images];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || images.length === 0) return;

    let lastTime = performance.now();
    let animationId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(scrollContainer);

    const animate = (time: number) => {
      if (isVisible) {
        const deltaTime = time - lastTime;
        lastTime = time;

        const speed = 0.6;
        scrollPosRef.current += speed;

        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollPosRef.current >= halfWidth) {
          scrollPosRef.current = 0;
        }

        scrollContainer.scrollLeft = scrollPosRef.current;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [images.length]);

  return (
    <section id="gallery" className="py-12 px-4 md:px-6 relative z-10">
      <div className="w-full bg-white dark:bg-[#111] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden py-16 md:py-24 border border-neutral-200 dark:border-white/5 relative">
        <div className="container mx-auto px-6 lg:px-12 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-[2px] bg-primary-600 rounded-full" />
                <span className="text-[10px] font-black text-primary-600 uppercase tracking-[0.5em] italic">Exposición Continua</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">
                Galería <span className="text-primary-600">Élite</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Marquee sin controles para un look más limpio y premium */}
        <div
          ref={scrollRef}
          className="flex gap-6 md:gap-10 overflow-hidden whitespace-nowrap px-6 md:px-12 py-4 cursor-default select-none marquee-mask"
        >
          {images.length === 0 ? (
            <div className="w-full flex items-center justify-center py-20 bg-neutral-50 dark:bg-white/3 rounded-[3rem] border-2 border-dashed border-neutral-200 dark:border-white/10">
              <Camera size={40} className="text-neutral-300 mr-4" />
              <p className="text-neutral-400 font-bold uppercase italic tracking-widest text-xs">Aún no hay material visual</p>
            </div>
          ) : (
            displayImages.map((image, idx) => (
              <div
                key={`${image.id}-${idx}`}
                className="flex-none w-[320px] md:w-[500px] h-[240px] md:h-[375px] relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group shadow-xl transition-all duration-700 hover:-translate-y-2 bg-neutral-100 dark:bg-zinc-900 border border-neutral-100 dark:border-white/5"
              >
                <div className="w-full h-full cursor-pointer" onClick={() => openLightbox(image)}>
                  <img
                    src={image.imageUrl}
                    alt={image.caption}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-500">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                      <Maximize2 size={24} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal de Lightbox Cinematográfico con Portal para evitar problemas de z-index y transform */}
        {selectedImage && createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-3xl flex items-center justify-center transition-all duration-500 animate-fadeIn"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={closeLightbox}
          >
            {/* Close Button - More Premium and Visible */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="fixed top-6 right-6 md:top-10 md:right-10 w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-white bg-white/10 hover:bg-white hover:text-black rounded-2xl md:rounded-3xl transition-all duration-500 z-[100000] border border-white/20 group shadow-[0_0_50px_rgba(0,0,0,0.5)] active:scale-90"
              aria-label="Cerrar Galería"
            >
              <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-20" onClick={(e) => e.stopPropagation()}>
              <div className="relative group max-w-full max-h-full flex items-center justify-center">
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.caption}
                  className="w-auto h-auto max-w-[95vw] max-h-[85vh] object-contain rounded-[1.5rem] md:rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.9)] border border-white/10 animate-scaleIn select-none"
                />

                {/* Decorative corners for a premium feel */}
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary-600 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-primary-600 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>

              {selectedImage.caption && (
                <div className="mt-8 group">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-full shadow-2xl animate-fadeInUp flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
                    <p className="font-black italic uppercase tracking-[0.4em] text-[10px] md:text-xs text-white">
                      {selectedImage.caption}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
      </div>
    </section>
  );
};

export default GallerySection;