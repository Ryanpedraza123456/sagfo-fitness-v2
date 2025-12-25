import React from 'react';
import { Event } from '../../types';
import { Plus, Edit, Trash2, Calendar, MapPin } from 'lucide-react';

interface AdminEventsProps {
    events: Event[];
    onOpenEventModal: (event?: Event) => void;
    onDeleteEvent: (eventId: string) => void;
}

const AdminEvents: React.FC<AdminEventsProps> = ({ events, onOpenEventModal, onDeleteEvent }) => {
    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="w-12 h-1 bg-rose-500 rounded-full" />
                    <h2 className="text-4xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none">Eventos & Seminarios</h2>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.4em] italic leading-none">Gestión de Experiencias y Formación</p>
                </div>
                <button
                    onClick={() => onOpenEventModal()}
                    className="flex items-center gap-3 px-8 py-4 bg-neutral-950 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Experiencia
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <div key={event.id} className="group relative bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-neutral-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-500 hover:-translate-y-1">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute top-4 right-4 flex gap-2 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                    onClick={() => onOpenEventModal(event)}
                                    className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-rose-500 transition-all shadow-xl active:scale-90"
                                    title="Editar Evento"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm('¿Confirmas eliminar este evento?')) {
                                            onDeleteEvent(event.id);
                                        }
                                    }}
                                    className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-90"
                                    title="Eliminar Evento"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-3">
                                    Próximo Evento
                                </span>
                                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2 leading-none">{event.title}</h3>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <Calendar className="w-4 h-4 text-rose-500" />
                                <span className="font-medium uppercase tracking-wide text-xs">{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                <span className="font-medium uppercase tracking-wide text-xs">{event.location}</span>
                            </div>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                                {event.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminEvents;
