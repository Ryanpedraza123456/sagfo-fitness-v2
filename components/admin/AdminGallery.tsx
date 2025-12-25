import React from 'react';
import { GalleryImage } from '../../types';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';

interface AdminGalleryProps {
    galleryImages: GalleryImage[];
    onViewProducts: () => void;
}

const AdminGallery: React.FC<AdminGalleryProps> = ({ galleryImages, onViewProducts }) => {
    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <div className="w-12 h-1 bg-fuchsia-500 rounded-full" />
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Galería Digital</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Exhibición Visual de Productos</p>
            </div>

            <div className="bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-2xl p-8 mb-8 text-center">
                <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ImageIcon className="w-8 h-8 text-fuchsia-500" />
                </div>
                <h3 className="text-xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter mb-2">Gestión Centralizada</h3>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6 text-sm">
                    Las imágenes de la galería se gestionan directamente desde el catálogo de productos.
                    Edita un producto para agregar o modificar sus fotos de exhibición.
                </p>
                <button
                    onClick={onViewProducts}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-black uppercase italic tracking-widest text-[10px] hover:scale-105 transition-transform"
                >
                    Ir al Inventario <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {galleryImages.map((image) => (
                    <div key={image.id} className="relative group rounded-[2.5rem] overflow-hidden border border-neutral-200 dark:border-zinc-800 shadow-lg aspect-square">
                        <img
                            src={image.imageUrl}
                            alt=""
                            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                            <p className="text-white text-xs font-black uppercase tracking-[0.3em] italic">
                                {image.caption || 'SAGFO Elite Visual'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminGallery;
