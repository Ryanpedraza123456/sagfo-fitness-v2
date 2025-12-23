

import { Order } from '../types';
import { equipmentData } from './equipment';

const customerEquipment1 = equipmentData.find(e => e.id === 'a1b2c3d4-e5f6-7890-1234-567890abcdef'); // T-800 (In Stock)
const customerEquipment2 = equipmentData.find(e => e.id === 'c3d4e5f6-a7b8-9012-3456-7890abcdef12'); // Mancuernas (In Stock)
const customerEquipment3 = equipmentData.find(e => e.id === 'b2c3d4e5-f6a7-8901-2345-67890abcdef1'); // Prensa (Made to Order)
const customerEquipment4 = equipmentData.find(e => e.id === 'd4e5f6a7-b8c9-0123-4567-890abcdef123'); // Balón (In Stock)
const customerEquipment5 = equipmentData.find(e => e.id === 'e5f6a7b8-c9d0-1234-5678-90abcdef1234'); // Poleas (Made to Order)


export const mockOrders: Order[] = (customerEquipment1 && customerEquipment2 && customerEquipment3 && customerEquipment4 && customerEquipment5) ? [
  {
    id: '917217',
    userId: 'user-customer-123',
    status: 'Despachado',
    paymentMethod: 'mixed',
    createdAt: new Date('2025-11-26T10:00:00').toISOString(),
    customerInfo: {
      name: 'Carlos Cliente',
      email: 'customer@sagfo.com',
      phone: '3101234567',
      city: 'Palmira',
      department: 'Valle del Cauca',
      address: 'Avenida Siempre Viva 742',
      country: 'Colombia'
    },
    items: [
      { equipment: customerEquipment5, quantity: 1, price_at_purchase: 9300000, deliveryStatus: 'pending' },
      { equipment: customerEquipment1, quantity: 1, price_at_purchase: 6900000, deliveryStatus: 'pending' },
      { equipment: customerEquipment3, quantity: 1, price_at_purchase: 5200000, deliveryStatus: 'pending' },
      { equipment: customerEquipment4, quantity: 4, price_at_purchase: 150000, deliveryStatus: 'pending' }
    ],
    financials: {
      totalOrderValue: 22000000,
      amountPaid: 11000000,
      amountPending: 11000000
    },
    assignedTransporterId: 'user-transporter-1'
  },
  {
    id: 'ord-1763',
    userId: 'user-pedro-456',
    status: 'En Envío',
    paymentMethod: 'mixed',
    createdAt: new Date('2024-07-17T17:47:00').toISOString(),
    customerInfo: {
      name: 'Pedro Aznar',
      email: 'pedrosazrov@gmail.com',
      phone: '3111234567',
      city: 'Cali',
      department: 'Valle del Cauca',
      address: 'Calle 5 # 45-20, Barrio San Fernando',
      country: 'Colombia'
    },
    items: [
      { equipment: customerEquipment3, quantity: 1, price_at_purchase: customerEquipment3.price, deliveryStatus: 'pending' }, // Prensa (Made to Order)
      { equipment: customerEquipment4, quantity: 10, price_at_purchase: customerEquipment4.price, deliveryStatus: 'shipped' }, // Balones (In Stock - Shipped/En Reparto)
      { equipment: customerEquipment2, quantity: 1, price_at_purchase: customerEquipment2.price, deliveryStatus: 'shipped' }, // Mancuernas (In Stock - Shipped)
    ],
    financials: {
      totalOrderValue: 9500000,
      amountPaid: 9500000,
      amountPending: 0
    },
    assignedTransporterId: 'user-transporter-1'
  }
] : [];