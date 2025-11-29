import { Event } from '../types';

export const mockEvents: Event[] = [
  {
    id: 'evt-1',
    title: 'Gran Apertura Nueva Sede',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Cali, Valle del Cauca',
    description: 'Únete a nosotros para celebrar la inauguración de nuestra nueva sede. Habrá demostraciones de equipos, descuentos especiales y más.',
    imageUrl: 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'evt-2',
    title: 'Taller de Entrenamiento Funcional',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Gimnasio Bodytech',
    description: 'Aprende las mejores técnicas de entrenamiento funcional con nuestros expertos y prueba nuestra nueva línea de accesorios.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'
  }
];
