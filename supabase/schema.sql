-- WARNING: This schema is designed to be copied and pasted into the Supabase SQL Editor.
-- It drops existing tables to ensure a clean slate.

-- 1. Clean up existing tables (Order matters due to foreign keys)
DROP TABLE IF EXISTS public.order_items;
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.gallery;
DROP TABLE IF EXISTS public.events;
DROP TABLE IF EXISTS public.equipment;
DROP TABLE IF EXISTS public.users;

-- 2. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Create Tables

CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    email text,
    role text CHECK (role IN ('customer', 'admin', 'transporter')),
    phone text,
    address text,
    city text,
    department text,
    location_url text,
    password text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.equipment (
    id text NOT NULL,
    category text,
    muscle_group text,
    availability_status text,
    name text,
    description text,
    price numeric,
    is_promotion boolean DEFAULT false,
    promotional_price numeric,
    image_urls text[],
    features text[],
    specifications jsonb,
    available_colors text[],
    available_weights text[],
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT equipment_pkey PRIMARY KEY (id)
);

CREATE TABLE public.events (
    id text NOT NULL,
    title text,
    date timestamp with time zone,
    location text,
    description text,
    image_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT events_pkey PRIMARY KEY (id)
);

CREATE TABLE public.gallery (
    id text NOT NULL,
    image_url text,
    caption text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT gallery_pkey PRIMARY KEY (id)
);

CREATE TABLE public.orders (
    id text NOT NULL,
    user_id text,
    status text,
    payment_method text,
    customer_info jsonb,
    financials jsonb,
    assigned_transporter_id text,
    production_details jsonb,
    payment_proof_url text,
    status_history jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT orders_assigned_transporter_id_fkey FOREIGN KEY (assigned_transporter_id) REFERENCES public.users(id)
);

CREATE TABLE public.order_items (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    order_id text,
    equipment_id text,
    quantity integer,
    price_at_purchase numeric,
    selected_color text,
    selected_weight text,
    structure_color text,
    upholstery_color text,
    delivery_status text,
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
    CONSTRAINT order_items_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment(id)
);

-- 4. Insert Seed Data

-- Users
INSERT INTO public.users (id, name, email, role, phone, address, password) VALUES
('user-admin-123', 'Admin SAGFO', 'admin@sagfo.com', 'admin', '3109876543', 'Calle Falsa 123, Cali', '123'),
('user-customer-123', 'Carlos Cliente', 'customer@sagfo.com', 'customer', '3101234567', 'Avenida Siempre Viva 742, Palmira', '123'),
('user-transporter-1', 'Jorge Transportador', 'transporte@sagfo.com', 'transporter', '3201234567', 'Central de Carga', '123'),
('user-pedro-456', 'Pedro Aznar', 'pedrosazrov@gmail.com', 'customer', '3111234567', 'Calle 5 # 45-20, Barrio San Fernando', '123');

-- Equipment
INSERT INTO public.equipment (id, category, muscle_group, availability_status, name, description, price, is_promotion, promotional_price, image_urls, features, specifications, available_colors, available_weights) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Maquinaria', 'Cardio', 'in-stock', 'Caminadora Profesional T-800', 'Caminadora de alto rendimiento con inclinación automática y pantalla táctil de 15". Ideal para gimnasios comerciales y entrenamientos intensivos.', 7500000, true, 6900000, ARRAY['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop', 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=2069&auto=format&fit=crop'], ARRAY['Motor de 4.5 HP', 'Velocidad de hasta 22 km/h', 'Inclinación de 0-15%', 'Conexión Bluetooth y WiFi', 'Programas de entrenamiento predefinidos'], '{"Dimensiones": "210cm x 90cm x 155cm", "Peso Máximo de Usuario": "180 kg", "Superficie de Carrera": "155cm x 55cm", "Garantía": "5 años en motor, 1 año en partes"}', ARRAY['Negro Mate', 'Gris Plata'], NULL),
('b2c3d4e5-f6a7-8901-2345-67890abcdef1', 'Maquinaria', 'Pierna', 'made-to-order', 'Prensa de Pierna 45°', 'Diseñada para un desarrollo muscular seguro y efectivo del tren inferior. Estructura robusta de acero y tapicería de alta densidad.', 5200000, false, NULL, ARRAY['https://images.unsplash.com/photo-1594737625787-a8a259c4a4e8?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop'], ARRAY['Soporta hasta 500 kg en discos', 'Plataforma de pies antideslizante y ajustable', 'Mecanismo de seguridad de fácil acceso', 'Movimiento suave y guiado'], '{"Dimensiones": "220cm x 160cm x 150cm", "Peso de la máquina": "210 kg", "Material": "Acero de alta resistencia", "Tapicería": "Cuero sintético de alta durabilidad"}', ARRAY['Negro/Rojo', 'Negro/Negro', 'Blanco/Negro', 'Personalizado'], NULL),
('c3d4e5f6-a7b8-9012-3456-7890abcdef12', 'Accesorios', 'Peso Libre', 'in-stock', 'Set de Mancuernas Hexagonales (5-50 lbs)', 'Set completo de mancuernas de caucho hexagonal para prevenir rodaduras. Agarre ergonómico de acero cromado para un entrenamiento cómodo y seguro.', 2800000, false, NULL, ARRAY['https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070&auto=format&fit=crop', 'https://images.unsplash.com/photo-1590240932284-1f68a5315feb?q=80&w=1974&auto=format&fit=crop'], ARRAY['Recubrimiento de caucho protector', 'Agarre antideslizante', 'Diseño hexagonal anti-rodadura', 'Incluye pares de 5, 10, 15, 20, 25, 30, 35, 40, 45, 50 lbs'], '{"Material": "Hierro fundido con recubrimiento de caucho", "Peso total": "550 lbs (250 kg)", "Estilo de agarre": "Recto, cromado y texturizado"}', NULL, NULL),
('kettlebell-123', 'Accesorios', 'Peso Libre', 'in-stock', 'Pesas Rusas Premium', 'Pesas rusas de hierro fundido con base plana y acabado mate. Ideales para entrenamiento funcional y crossfit.', 62900, false, NULL, ARRAY['https://images.unsplash.com/photo-1591940742878-13aba4b7a34e?q=80&w=2070&auto=format&fit=crop'], ARRAY['Hierro fundido de una sola pieza', 'Base plana para estabilidad', 'Agarre texturizado'], '{"Material": "Hierro Fundido", "Acabado": "Pintura en polvo"}', NULL, ARRAY['4KG', '6KG', '8KG', '10KG', '12KG', '16KG', '20KG', '24KG']),
('d4e5f6a7-b8c9-0123-4567-890abcdef123', 'Accesorios', 'Funcional', 'in-stock', 'Balón Medicinal de Goma', 'Balón medicinal con superficie texturizada para un mejor agarre. Perfecto para ejercicios de fuerza, pliometría y rehabilitación.', 150000, false, NULL, ARRAY['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop'], ARRAY['Superficie de goma de alto agarre', 'Resistente a los impactos', 'Disponible en varios pesos (se vende por unidad)', 'Ideal para entrenamiento funcional'], '{"Peso": "15 lbs (6.8 kg)", "Diámetro": "35 cm", "Material": "Goma de alta densidad"}', ARRAY['Negro', 'Azul', 'Rojo', 'Verde', 'Amarillo'], NULL),
('e5f6a7b8-c9d0-1234-5678-90abcdef1234', 'Maquinaria', 'Pecho', 'made-to-order', 'Máquina de Poleas Cruzadas', 'Estación de entrenamiento funcional versátil que permite una infinidad de ejercicios para todo el cuerpo. Con dos columnas de peso ajustables independientemente.', 9300000, false, NULL, ARRAY['https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2070&auto=format&fit=crop'], ARRAY['Dos stacks de peso de 90 kg cada uno', 'Posiciones de polea ajustables verticalmente', 'Barra de dominadas integrada', 'Incluye múltiples agarres y accesorios'], '{"Dimensiones": "350cm x 100cm x 230cm", "Ratio de polea": "2:1", "Material": "Acero estructural", "Garantía": "2 años en estructura y poleas"}', ARRAY['Negro Mate', 'Gris Industrial', 'Blanco Perla'], NULL);

-- Events
INSERT INTO public.events (id, title, date, location, description, image_url) VALUES
('evt-1', 'Gran Apertura Nueva Sede', NOW() + INTERVAL '15 days', 'Cali, Valle del Cauca', 'Únete a nosotros para celebrar la inauguración de nuestra nueva sede. Habrá demostraciones de equipos, descuentos especiales y más.', 'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=2070&auto=format&fit=crop'),
('evt-2', 'Taller de Entrenamiento Funcional', NOW() + INTERVAL '30 days', 'Gimnasio Bodytech', 'Aprende las mejores técnicas de entrenamiento funcional con nuestros expertos y prueba nuestra nueva línea de accesorios.', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop');

-- Gallery
INSERT INTO public.gallery (id, image_url, caption) VALUES
('gal-1', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', 'Instalaciones de primera calidad.'),
('gal-2', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=2071&auto=format&fit=crop', 'Equipos para todos los objetivos.'),
('gal-3', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1974&auto=format&fit=crop', 'Enfoque en la fuerza y el rendimiento.'),
('gal-4', 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=2070&auto=format&fit=crop', 'Durabilidad y diseño profesional.'),
('gal-5', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop', 'Espacios que inspiran a entrenar.'),
('gal-6', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=1974&auto=format&fit=crop', 'El compromiso es la clave del éxito.');

-- Orders
INSERT INTO public.orders (id, user_id, status, payment_method, customer_info, financials, assigned_transporter_id, created_at) VALUES
('917217', 'user-customer-123', 'Despachado', 'mixed', '{"name": "Carlos Cliente", "email": "customer@sagfo.com", "phone": "3101234567", "city": "Palmira", "department": "Valle del Cauca", "address": "Avenida Siempre Viva 742"}', '{"totalOrderValue": 22000000, "amountPaid": 11000000, "amountPending": 11000000}', 'user-transporter-1', '2025-11-26T10:00:00Z'),
('ord-1763', 'user-pedro-456', 'En Envío', 'mixed', '{"name": "Pedro Aznar", "email": "pedrosazrov@gmail.com", "phone": "3111234567", "city": "Cali", "department": "Valle del Cauca", "address": "Calle 5 # 45-20, Barrio San Fernando"}', '{"totalOrderValue": 9500000, "amountPaid": 9500000, "amountPending": 0}', 'user-transporter-1', '2024-07-17T17:47:00Z');

-- Order Items
INSERT INTO public.order_items (order_id, equipment_id, quantity, price_at_purchase, delivery_status) VALUES
('917217', 'e5f6a7b8-c9d0-1234-5678-90abcdef1234', 1, 9300000, 'pending'),
('917217', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 1, 6900000, 'pending'),
('917217', 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', 1, 5200000, 'pending'),
('917217', 'd4e5f6a7-b8c9-0123-4567-890abcdef123', 4, 150000, 'pending'),
('ord-1763', 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', 1, 5200000, 'pending'),
('ord-1763', 'd4e5f6a7-b8c9-0123-4567-890abcdef123', 10, 150000, 'shipped'),
('ord-1763', 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', 1, 2800000, 'shipped');
