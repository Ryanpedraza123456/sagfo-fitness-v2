import React from 'react';
import { Event } from '../types';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const formattedDate = new Date(event.date).toLocaleString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div 
      className={`fixed inset-0 z-[101] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className={`relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors z-20 bg-neutral-100/50 hover:bg-neutral-200/80 dark:bg-neutral-800/50 dark:hover:bg-neutral-700/80 rounded-full p-1.5">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800 flex-shrink-0">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        </div>

        <div className="p-8 overflow-y-auto">
            <p className="font-semibold text-primary-600 dark:text-primary-400">{formattedDate}</p>
            <h2 className="mt-2 text-3xl font-bold text-neutral-900 dark:text-white">{event.title}</h2>
            <p className="mt-2 text-lg text-neutral-500 dark:text-neutral-400 font-medium">{event.location}</p>
            <p className="mt-6 text-neutral-600 dark:text-neutral-300 leading-relaxed">{event.description}</p>
        </div>

        <div className="bg-neutral-50 dark:bg-neutral-800/50 px-8 py-4 flex justify-end rounded-b-2xl flex-shrink-0">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-semibold">
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
