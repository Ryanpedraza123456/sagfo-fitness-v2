

import React, { useState, useEffect } from 'react';
import { Event } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event, imageFile?: File) => void;
  event?: Event;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, event }) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    date: '',
    location: '',
    description: '',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date ? new Date(event.date).toISOString().substring(0, 16) : '' // Format for datetime-local input
      });
    } else {
      setFormData({ title: '', date: '', location: '', description: '', imageUrl: '' });
    }
  }, [event, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localImageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, imageUrl: localImageUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Por favor, sube una imagen para el evento.');
      return;
    }
    const eventToSave: Event = {
      ...formData,
      id: event?.id || '', // id is handled in App.tsx if it's new
      date: new Date(formData.date || '').toISOString(),
    } as Event;
    onSave(eventToSave, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div className={`relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-2xl transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">{event ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Título</label>
                <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Fecha y Hora</label>
                  <input id="date" type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Ubicación</label>
                  <input id="location" type="text" name="location" value={formData.location} onChange={handleChange} required className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white" />
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <label htmlFor="imageFile" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Imagen del Evento</label>
                  <input id="imageFile" type="file" name="imageFile" accept="image/*" onChange={handleFileChange} className="mt-1 w-full p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                </div>
                {formData.imageUrl && <img src={formData.imageUrl} alt="Vista previa" className="w-24 h-24 object-cover rounded-lg flex-shrink-0 mt-2" />}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-500 dark:text-neutral-400">Descripción</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} required className="mt-1 w-full p-3 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"></textarea>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 px-8 py-4 flex justify-end space-x-3 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-sm font-semibold">Cancelar</button>
            <button type="submit" className="px-5 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-semibold">Guardar Evento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
