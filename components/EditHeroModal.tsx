import React, { useState, useEffect } from 'react';
import { HeroSlide } from '../types';
import { Plus, Trash2, Layout, Image as ImageIcon, Type, Subtitles, X, Save, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

interface EditHeroModalProps {
    isOpen: boolean;
    onClose: () => void;
    slides: HeroSlide[];
    onSave: (slides: HeroSlide[], newFilesMap?: Record<string, File>) => void;
}

const EditHeroModal: React.FC<EditHeroModalProps> = ({ isOpen, onClose, slides, onSave }) => {
    const [tempSlides, setTempSlides] = useState<HeroSlide[]>([]);
    const [selectedSlideId, setSelectedSlideId] = useState<string | null>(null);
    const [newImagesMap, setNewImagesMap] = useState<Record<string, File>>({});

    useEffect(() => {
        if (isOpen) {
            setTempSlides(JSON.parse(JSON.stringify(slides))); // Deep copy
            setNewImagesMap({});
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

            setNewImagesMap(prev => ({
                ...prev,
                [localImageUrl]: file
            }));
        }
    };

    const addNewSlide = () => {
        const newId = `slide-${Date.now()}`;
        const newSlide: HeroSlide = {
            id: newId,
            titleLine1: 'NUEVA EXPLORACIÓN',
            titleLine2: 'SERIE ELITE',
            subtitle: 'Define aquí la narrativa que cautivará a tu audiencia.',
            imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop'
        };
        setTempSlides([...tempSlides, newSlide]);
        setSelectedSlideId(newId);
    };

    const removeSlide = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('¿Deseas eliminar esta diapositiva de la narrativa principal?')) return;

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
        onSave(tempSlides, newImagesMap);
        onClose();
    };

    const currentSlide = tempSlides.find(s => s.id === selectedSlideId);

    // Logic for navigating slides with arrows
    const navigateSlides = (direction: 'prev' | 'next') => {
        if (!currentSlide || tempSlides.length <= 1) return;

        const currentIndex = tempSlides.findIndex(s => s.id === selectedSlideId);
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % tempSlides.length;
        } else {
            newIndex = (currentIndex - 1 + tempSlides.length) % tempSlides.length;
        }
        setSelectedSlideId(tempSlides[newIndex].id);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-8 transition-all duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />

            <div className={`relative bg-white dark:bg-[#0a0a0a] md:rounded-[3.5rem] w-full max-w-7xl h-full md:h-[90vh] flex flex-col overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] transform transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100' : 'scale-95'}`}>

                {/* Header Superior Elite */}
                <div className="px-6 md:px-10 py-6 md:py-8 border-b border-neutral-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between bg-white/50 dark:bg-white/5 backdrop-blur-xl gap-4">
                    <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-2xl rotate-3 flex-shrink-0">
                            <Layers className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1">Director de Narrativa</h2>
                            <p className="text-[8px] md:text-[10px] text-neutral-500 font-bold uppercase tracking-[0.3em] italic">Gestión Visual</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <button onClick={addNewSlide} className="flex-grow md:flex-grow-0 flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 bg-primary-600/10 text-primary-600 rounded-xl md:rounded-[1.25rem] font-black uppercase italic text-[9px] md:text-[11px] tracking-widest hover:bg-primary-600 hover:text-white transition-all duration-500 border border-primary-600/20">
                            <Plus className="w-3 h-3 md:w-4 md:h-4" />
                            Nuevo Slide
                        </button>
                        <button onClick={onClose} className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-[1.25rem] bg-neutral-100 dark:bg-white/5 text-neutral-400 hover:text-red-500 transition-all border border-neutral-200 dark:border-white/5">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
                    {/* Lista Lateral de Diapositivas */}
                    <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02] flex flex-col max-h-[160px] md:max-h-full">
                        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto p-4 md:p-6 gap-3 md:space-y-4 no-scrollbar">
                            {tempSlides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    onClick={() => setSelectedSlideId(slide.id)}
                                    className={`relative flex-shrink-0 w-40 md:w-auto p-2 md:p-4 rounded-[1.5rem] md:rounded-[2rem] cursor-pointer transition-all duration-500 border-2 ${selectedSlideId === slide.id ? 'bg-white dark:bg-zinc-900 border-primary-600 shadow-xl md:-translate-x-2' : 'bg-transparent border-transparent hover:bg-neutral-100 dark:hover:bg-white/5'}`}
                                >
                                    <div className="aspect-[2/1] rounded-xl md:rounded-2xl overflow-hidden mb-2 md:mb-3 bg-black/20">
                                        <img src={slide.imageUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="px-1">
                                        <p className="text-[10px] font-bold text-neutral-900 dark:text-white truncate">{slide.titleLine1}</p>
                                    </div>

                                    <button
                                        onClick={(e) => removeSlide(slide.id, e)}
                                        className="absolute top-1 right-1 md:top-2 md:right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all shadow-lg"
                                    >
                                        <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Área del Editor Cinematográfico */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-[#070707] overflow-y-auto no-scrollbar">
                        {currentSlide ? (
                            <div className="p-10 lg:p-16 space-y-12 animate-in fade-in duration-700">

                                {/* Visualizer Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-neutral-400 mb-2">
                                        <Layout className="w-4 h-4 text-primary-600" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Previsualización de Cámara</span>
                                    </div>
                                    <div className="aspect-video md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden relative group shadow-3xl bg-black border border-white/10">
                                        <img src={currentSlide.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[2s] group-hover:scale-105" alt="Visual" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                                        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-20 text-white">
                                            <h1 className="text-xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none mb-2 md:mb-6">
                                                {currentSlide.titleLine1}<br />
                                                <span className="text-transparent border-t-2 border-white/20 pt-2 block">{currentSlide.titleLine2}</span>
                                            </h1>
                                            <p className="max-w-md text-[10px] md:text-lg text-neutral-300 font-medium italic opacity-80 line-clamp-2 md:line-clamp-none">{currentSlide.subtitle}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary-600 italic px-4"><ImageIcon className="w-4 h-4" /> Cinematografía (Imagen)</label>
                                            <div className="relative group">
                                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-[10]" />
                                                <div className="w-full p-6 rounded-[2rem] bg-neutral-100 dark:bg-white/5 border-2 border-dashed border-neutral-200 dark:border-white/10 flex items-center justify-center gap-4 group-hover:bg-primary-600/5 group-hover:border-primary-600/30 transition-all pointer-events-none">
                                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform">
                                                        <Plus className="text-primary-600" />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="text-xs font-black text-neutral-900 dark:text-white uppercase italic">Actualizar Visual</p>
                                                        <p className="text-[9px] text-neutral-400 font-bold uppercase">PNG, JPG de alta resolución</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary-600 italic px-4"><Subtitles className="w-4 h-4" /> Descripción Narrativa</label>
                                            <textarea name="subtitle" rows={3} value={currentSlide.subtitle} onChange={handleInputChange} placeholder="Escribe la historia de esta diapositiva..." className="w-full bg-neutral-100 dark:bg-white/5 p-6 rounded-[2rem] text-sm font-medium italic border border-transparent focus:border-primary-600/30 outline-none transition-all text-neutral-900 dark:text-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary-600 italic px-4"><Type className="w-4 h-4" /> Título Primario</label>
                                            <input name="titleLine1" value={currentSlide.titleLine1} onChange={handleInputChange} className="w-full bg-neutral-100 dark:bg-white/5 p-6 rounded-[2rem] font-black uppercase italic tracking-tighter text-xl border border-transparent focus:border-primary-600/30 outline-none transition-all text-neutral-900 dark:text-white" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary-600 italic px-4"><Type className="w-4 h-4" /> Título de Énfasis</label>
                                            <input name="titleLine2" value={currentSlide.titleLine2} onChange={handleInputChange} className="w-full bg-neutral-100 dark:bg-white/5 p-6 rounded-[2rem] font-black uppercase italic tracking-tighter text-xl border border-transparent focus:border-primary-600/30 outline-none transition-all text-neutral-900 dark:text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30">
                                <div className="w-32 h-32 rounded-full border-4 border-dashed border-neutral-400 flex items-center justify-center mb-8">
                                    <Layout className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-neutral-400">Selecciona una escena para dirigir</h3>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer de Sincronización */}
                <div className="px-6 md:px-10 py-6 md:py-8 border-t border-neutral-100 dark:border-white/5 bg-white dark:bg-black flex flex-col md:flex-row justify-end gap-4 md:gap-6 items-center">
                    <button onClick={onClose} className="w-full md:w-auto px-6 py-4 rounded-xl font-black uppercase italic tracking-widest text-[10px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">Abortar Cambios</button>
                    <button
                        onClick={handleSubmit}
                        className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 rounded-[1.25rem] md:rounded-[1.5rem] font-black uppercase italic tracking-[0.2em] text-[10px] md:text-[11px] shadow-3xl hover:scale-105 active:scale-95 transition-all duration-500 relative overflow-hidden group/save"
                    >
                        <Save className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">Publicar Cambios Élite</span>
                        <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover/save:translate-y-0 transition-transform duration-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditHeroModal;
