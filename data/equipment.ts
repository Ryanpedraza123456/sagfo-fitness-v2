
import { EquipmentItem } from '../types';

export const equipmentData: EquipmentItem[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    category: 'Maquinaria',
    muscleGroup: 'Cardio',
    availabilityStatus: 'in-stock',
    name: 'Caminadora Profesional T-800',
    description: 'Caminadora de alto rendimiento con inclinación automática y pantalla táctil de 15". Ideal para gimnasios comerciales y entrenamientos intensivos.',
    price: 7500000,
    isPromotion: true,
    promotionalPrice: 6900000,
    imageUrls: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop',
    ],
    features: [
      'Motor de 4.5 HP',
      'Velocidad de hasta 22 km/h',
      'Inclinación de 0-15%',
      'Conexión Bluetooth y WiFi',
      'Programas de entrenamiento predefinidos'
    ],
    specifications: {
      'Dimensiones': '210cm x 90cm x 155cm',
      'Peso Máximo de Usuario': '180 kg',
      'Superficie de Carrera': '155cm x 55cm',
      'Garantía': '5 años en motor, 1 año en partes'
    },
    availableColors: ['Negro Mate', 'Gris Plata']
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    category: 'Maquinaria',
    muscleGroup: 'Pierna',
    availabilityStatus: 'made-to-order',
    name: 'Prensa de Pierna 45°',
    description: 'Diseñada para un desarrollo muscular seguro y efectivo del tren inferior. Estructura robusta de acero y tapicería de alta densidad.',
    price: 5200000,
    imageUrls: [
      'https://images.unsplash.com/photo-1594737625787-a8a259c4a4e8?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
    ],
    features: [
      'Soporta hasta 500 kg en discos',
      'Plataforma de pies antideslizante y ajustable',
      'Mecanismo de seguridad de fácil acceso',
      'Movimiento suave y guiado'
    ],
    specifications: {
      'Dimensiones': '220cm x 160cm x 150cm',
      'Peso de la máquina': '210 kg',
      'Material': 'Acero de alta resistencia',
      'Tapicería': 'Cuero sintético de alta durabilidad'
    },
    availableColors: ['Negro/Rojo', 'Negro/Negro', 'Blanco/Negro', 'Personalizado']
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    category: 'Accesorios',
    muscleGroup: 'Peso Libre',
    availabilityStatus: 'in-stock',
    name: 'Set de Mancuernas Hexagonales (5-50 lbs)',
    description: 'Set completo de mancuernas de caucho hexagonal para prevenir rodaduras. Agarre ergonómico de acero cromado para un entrenamiento cómodo y seguro.',
    price: 2800000,
    imageUrls: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590240932284-1f68a5315feb?q=80&w=1974&auto=format&fit=crop',
    ],
    features: [
      'Recubrimiento de caucho protector',
      'Agarre antideslizante',
      'Diseño hexagonal anti-rodadura',
      'Incluye pares de 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 lbs'
    ],
    specifications: {
      'Material': 'Hierro fundido con recubrimiento de caucho',
      'Peso total': '550 lbs (250 kg)',
      'Estilo de agarre': 'Recto, cromado y texturizado'
    }
  },
  {
    id: 'kettlebell-123',
    category: 'Accesorios',
    muscleGroup: 'Peso Libre',
    availabilityStatus: 'in-stock',
    name: 'Pesas Rusas Premium',
    description: 'Pesas rusas de hierro fundido con base plana y acabado mate. Ideales para entrenamiento funcional y crossfit.',
    price: 62900,
    imageUrls: ['https://images.unsplash.com/photo-1591940742878-13aba4b7a34e?q=80&w=2070&auto=format&fit=crop'],
    features: ['Hierro fundido de una sola pieza', 'Base plana para estabilidad', 'Agarre texturizado'],
    specifications: { 'Material': 'Hierro Fundido', 'Acabado': 'Pintura en polvo' },
    availableWeights: ['4KG', '6KG', '8KG', '10KG', '12KG', '16KG', '20KG', '24KG']
  },
  {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
    category: 'Accesorios',
    muscleGroup: 'Funcional',
    availabilityStatus: 'in-stock',
    name: 'Balón Medicinal de Goma',
    description: 'Balón medicinal con superficie texturizada para un mejor agarre. Perfecto para ejercicios de fuerza, pliometría y rehabilitación.',
    price: 150000,
    imageUrls: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'
    ],
    features: [
      'Superficie de goma de alto agarre',
      'Resistente a los impactos',
      'Disponible en varios pesos (se vende por unidad)',
      'Ideal para entrenamiento funcional'
    ],
    specifications: {
      'Peso': '15 lbs (6.8 kg)',
      'Diámetro': '35 cm',
      'Material': 'Goma de alta densidad',
    },
    availableColors: ['Negro', 'Azul', 'Rojo', 'Verde', 'Amarillo']
  },
  {
    id: 'e5f6a7b8-c9d0-1234-5678-90abcdef1234',
    category: 'Maquinaria',
    muscleGroup: 'Pecho',
    availabilityStatus: 'made-to-order',
    name: 'Máquina de Poleas Cruzadas',
    description: 'Estación de entrenamiento funcional versátil que permite una infinidad de ejercicios para todo el cuerpo. Con dos columnas de peso ajustables independientemente.',
    price: 9300000,
    imageUrls: [
      'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop'
    ],
    features: [
      'Dos stacks de peso de 90 kg cada uno',
      'Posiciones de polea ajustables verticalmente',
      'Barra de dominadas integrada',
      'Incluye múltiples agarres y accesorios'
    ],
    specifications: {
      'Dimensiones': '350cm x 100cm x 230cm',
      'Ratio de polea': '2:1',
      'Material': 'Acero estructural',
      'Garantía': '2 años en estructura y poleas'
    },
    availableColors: ['Negro Mate', 'Gris Industrial', 'Blanco Perla']
  }
];
