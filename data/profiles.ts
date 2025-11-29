
import { Profile } from '../types';

export const mockProfiles: Profile[] = [
    {
        id: 'user-admin-123',
        name: 'Admin SAGFO',
        email: 'admin@sagfo.com',
        role: 'admin',
        phone: '3109876543',
        address: 'Calle Falsa 123, Cali',
        password: '123'
    },
    {
        id: 'user-customer-123',
        name: 'Carlos Cliente',
        email: 'customer@sagfo.com',
        role: 'customer',
        phone: '3101234567',
        address: 'Avenida Siempre Viva 742, Palmira',
        password: '123'
    },
    {
        id: 'user-transporter-1',
        name: 'Jorge Transportador',
        email: 'transporte@sagfo.com',
        role: 'transporter',
        phone: '3201234567',
        address: 'Central de Carga',
        password: '123'
    }
];
