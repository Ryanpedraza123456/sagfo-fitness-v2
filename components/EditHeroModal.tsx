
import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../types';

interface EditHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: HeroSlide[];
  onSave: (slides: HeroSlide[]) => void;
}

const EditHeroModal: React.FC<EditHeroModalProps> = ({ isOpen, onClose, slides, onSave }) => {
  const [tempSlides, setTempSlides] = useState<HeroSlide[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
        setTempSlides(JSON.parse(JSON.stringify(slides))); // Deep copy
        if (slides.length > 0) {
            setSelectedSlideId(slides[0].id);
        }
    }
  }, [slides, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempSlides(prev => prev.map(slide => 
        slide.id === selectedSlideId ? { ...slide, [name]: value } : slide
    ));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localImageUrl = URL.createObjectURL(file);
      setTempSlides(prev => prev.map(slide => 
        slide.id === selectedSlideId ? { ...slide, imageUrl: localImageUrl } : slide
      ));
    }
  };

  const addNewSlide = () => {
    const newId = `slide-${Date.now()}`;
    const newSlide: HeroSlide = {
        id: newId,
        titleLine1: 'NUEVA PROMO',
        titleLine2: 'DESCUENTOS',
        subtitle: 'Describe tu promoción aquí.',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
    };
    setTempSlides([...tempSlides, newSlide]);
    setSelectedSlideId(newId);
  };

  const removeSlide = (id: string) => {
    const newSlides = tempSlides.filter(s => s.id !== id);
    setTempSlides(newSlides);
    if (selectedSlideId === id && newSlides.length > 0) {
        setSelectedSlideId(newSlides[0].id);
    } else if (newSlides.length === 0) {
        setSelectedSlideId(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tempSlides);
    onClose();
  };

  const currentSlide = tempSlides.find(s => s.id === selectedSlideId);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className={`relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Diapositivas</h2>
                    <button onClick={addNewSlide} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 font-semibold">+ Nueva</button>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    {tempSlides.map((slide, index) => (
                        <div 
                            key={slide.id}
                            onClick={() => setSelectedSlideId(slide.id)}
                            className={`p-3 rounded-lg cursor-pointer border transition-all flex items-center gap-3 ${selectedSlideId === slide.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500' : 'border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                        >
                            <div className="h-12 w-20 bg-neutral-200 rounded overflow-hidden flex-shrink-0">
                                <img src={slide.imageUrl} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">Slide {index + 1}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{slide.titleLine1} {slide.titleLine2}</p>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); removeSlide(slide.id); }}
                                className="text-red-400 hover:text-red-600 p-1"
                                title="Eliminar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 10-2 0v10H6V6h1.382l.724 1.447A1 1 0 009 8h2a1 1 0 00.894-.553L12.618 6H14a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 009 2z" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    ))}
                    {tempSlides.length === 0 && (
                        <p className="text-center text-neutral-400 text-sm py-4">No hay diapositivas. Añade una.</p>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="w-2/3 flex flex-col bg-neutral-50 dark:bg-neutral-900">
                {currentSlide ? (
                    <div className="flex-grow overflow-y-auto p-8">
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 border-b pb-2 border-neutral-200 dark:border-neutral-700">Editar Contenido</h3>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">Imagen de Fondo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-32 h-20 rounded-lg overflow-hidden bg-neutral-200 relative group">
                                        <img src={currentSlide.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"/>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Título (Línea 1)</label>
                                    <input type="text" name="titleLine1" value={currentSlide.titleLine1} onChange={handleInputChange} className="mt-1 w-full p-3 rounded-md bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Título (Línea 2 - Destacada)</label>
                                    <input type="text" name="titleLine2" value={currentSlide.titleLine2} onChange={handleInputChange} className="mt-1 w-full p-3 rounded-md bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Subtítulo</label>
                                <textarea name="subtitle" rows={2} value={currentSlide.subtitle} onChange={handleInputChange} className="mt-1 w-full p-3 rounded-md bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"></textarea>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">Vista Previa Rápida</h3>
                            <div className="aspect-video rounded-lg overflow-hidden relative bg-neutral-900 text-white shadow-lg">
                                <img src={currentSlide.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
                                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-4">
                                    <h1 className="text-2xl font-extrabold">
                                        {currentSlide.titleLine1}<br/>
                                        <span className="text-primary-400">{currentSlide.titleLine2}</span>
                                    </h1>
                                    <p className="mt-2 text-sm text-neutral-200">{currentSlide.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center text-neutral-400">
                        Selecciona una diapositiva para editar
                    </div>
                )}

                {/* Footer Actions */}
                <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex justify-end gap-3 rounded-br-2xl">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-sm font-semibold">Cancelar</button>
                    <button type="button" onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-semibold">Guardar Todo</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditHeroModal;
