-- ============================================
-- MEJORAS DE SCHEMA PARA SUPABASE (VERSIÓN SEGURA)
-- Versión: 2.0
-- Fecha: 2025-12-07
-- ============================================
-- Esta versión incluye limpieza automática de datos
-- ============================================

-- ============================================
-- PASO 0: LIMPIEZA AUTOMÁTICA DE DATOS
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '🧹 Iniciando limpieza de datos...';
END $$;

-- Corregir productos con precio inválido
UPDATE public.equipment
SET price = 100000
WHERE price IS NULL OR price <= 0;

-- Corregir productos con precio promocional inválido
UPDATE public.equipment
SET is_promotion = false,
    promotional_price = NULL
WHERE is_promotion = true 
  AND (promotional_price IS NULL 
       OR promotional_price <= 0 
       OR promotional_price >= price);

-- Corregir order_items con cantidad inválida
UPDATE public.order_items
SET quantity = 1
WHERE quantity IS NULL OR quantity <= 0;

-- Corregir order_items con precio inválido
UPDATE public.order_items oi
SET price_at_purchase = COALESCE(
    (SELECT price FROM public.equipment e WHERE e.id = oi.equipment_id),
    0
)
WHERE price_at_purchase IS NULL OR price_at_purchase < 0;

DO $$ 
BEGIN
    RAISE NOTICE '✅ Limpieza de datos completada';
END $$;

-- ============================================
-- PASO 1: CREAR ÍNDICES (ALTA PRIORIDAD)
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '📊 Creando índices...';
END $$;

-- Índices para equipment (productos)
CREATE INDEX IF NOT EXISTS idx_equipment_category ON public.equipment(category);
CREATE INDEX IF NOT EXISTS idx_equipment_muscle_group ON public.equipment(muscle_group);
CREATE INDEX IF NOT EXISTS idx_equipment_availability ON public.equipment(availability_status);
CREATE INDEX IF NOT EXISTS idx_equipment_is_deleted ON public.equipment(is_deleted);
CREATE INDEX IF NOT EXISTS idx_equipment_is_promotion ON public.equipment(is_promotion);
CREATE INDEX IF NOT EXISTS idx_equipment_created_at ON public.equipment(created_at DESC);

-- Índice parcial para productos activos (más eficiente)
CREATE INDEX IF NOT EXISTS idx_equipment_active 
ON public.equipment(id) 
WHERE (is_deleted = false OR is_deleted IS NULL);

-- Índices para orders (pedidos)
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_transporter ON public.orders(assigned_transporter_id);

-- Índices para order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_equipment_id ON public.order_items(equipment_id);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Índices para events
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events(created_at DESC);

-- Índices para gallery
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON public.gallery(created_at DESC);

DO $$ 
BEGIN
    RAISE NOTICE '✅ Índices creados exitosamente';
END $$;

-- ============================================
-- PASO 2: AGREGAR COLUMNAS DE AUDITORÍA
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '📝 Agregando columnas de auditoría...';
END $$;

-- Agregar updated_at a todas las tablas
ALTER TABLE public.equipment 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.gallery 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

ALTER TABLE public.site_config 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para cada tabla
DROP TRIGGER IF EXISTS update_equipment_updated_at ON public.equipment;
CREATE TRIGGER update_equipment_updated_at 
BEFORE UPDATE ON public.equipment 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON public.orders 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON public.users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at 
BEFORE UPDATE ON public.events 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
CREATE TRIGGER update_gallery_updated_at 
BEFORE UPDATE ON public.gallery 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_config_updated_at ON public.site_config;
CREATE TRIGGER update_site_config_updated_at 
BEFORE UPDATE ON public.site_config 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DO $$ 
BEGIN
    RAISE NOTICE '✅ Columnas de auditoría agregadas';
END $$;

-- ============================================
-- PASO 3: AGREGAR CONSTRAINTS DE VALIDACIÓN
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '🔒 Agregando constraints de validación...';
END $$;

-- Equipment: Validar precios positivos
DO $$ 
BEGIN
    ALTER TABLE public.equipment 
    ADD CONSTRAINT equipment_price_positive CHECK (price > 0);
    RAISE NOTICE '✅ Constraint equipment_price_positive agregado';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE '⚠️ Constraint equipment_price_positive ya existe';
    WHEN check_violation THEN
        RAISE NOTICE '❌ ERROR: Hay productos con precio <= 0. Ejecuta 000_limpieza_previa.sql primero';
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.equipment 
    ADD CONSTRAINT equipment_promotional_price_positive 
    CHECK (promotional_price IS NULL OR promotional_price > 0);
    RAISE NOTICE '✅ Constraint equipment_promotional_price_positive agregado';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE '⚠️ Constraint equipment_promotional_price_positive ya existe';
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.equipment 
    ADD CONSTRAINT equipment_promo_less_than_price 
    CHECK (promotional_price IS NULL OR promotional_price < price);
    RAISE NOTICE '✅ Constraint equipment_promo_less_than_price agregado';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE '⚠️ Constraint equipment_promo_less_than_price ya existe';
END $$;

-- Order items: Validar quantity positiva
DO $$ 
BEGIN
    ALTER TABLE public.order_items 
    ADD CONSTRAINT order_items_quantity_positive CHECK (quantity > 0);
    RAISE NOTICE '✅ Constraint order_items_quantity_positive agregado';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE '⚠️ Constraint order_items_quantity_positive ya existe';
END $$;

DO $$ 
BEGIN
    ALTER TABLE public.order_items 
    ADD CONSTRAINT order_items_price_non_negative 
    CHECK (price_at_purchase >= 0);
    RAISE NOTICE '✅ Constraint order_items_price_non_negative agregado';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE '⚠️ Constraint order_items_price_non_negative ya existe';
END $$;

DO $$ 
BEGIN
    RAISE NOTICE '✅ Constraints de validación agregados';
END $$;

-- ============================================
-- PASO 4: MEJORAR TABLA USERS
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '👤 Mejorando tabla users...';
END $$;

-- Agregar campos útiles a users
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_login_at timestamp with time zone;

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- Email único (puede fallar si hay duplicados)
DO $$ 
BEGIN
    ALTER TABLE public.users 
    ADD CONSTRAINT users_email_unique UNIQUE (email);
    RAISE NOTICE '✅ Constraint users_email_unique agregado';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE '⚠️ Constraint users_email_unique ya existe';
    WHEN unique_violation THEN 
        RAISE NOTICE '❌ ERROR: Hay emails duplicados. Límpialos manualmente antes de continuar';
END $$;

DO $$ 
BEGIN
    RAISE NOTICE '✅ Tabla users mejorada';
END $$;

-- ============================================
-- PASO 5: MEJORAR SOFT DELETE
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '🗑️ Mejorando soft delete...';
END $$;

-- Agregar deleted_at para saber cuándo se eliminó
ALTER TABLE public.equipment 
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Crear vista para productos activos
CREATE OR REPLACE VIEW public.equipment_active AS
SELECT * FROM public.equipment
WHERE is_deleted = false OR is_deleted IS NULL;

DO $$ 
BEGIN
    RAISE NOTICE '✅ Soft delete mejorado';
END $$;

-- ============================================
-- PASO 6: AGREGAR CAMPOS ÚTILES A EQUIPMENT
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '📦 Agregando campos útiles a equipment...';
END $$;

-- Stock para productos "in-stock"
ALTER TABLE public.equipment 
ADD COLUMN IF NOT EXISTS stock_quantity integer DEFAULT 0;

DO $$ 
BEGIN
    ALTER TABLE public.equipment 
    ADD CONSTRAINT equipment_stock_non_negative 
    CHECK (stock_quantity >= 0);
    RAISE NOTICE '✅ Constraint equipment_stock_non_negative agregado';
EXCEPTION
    WHEN duplicate_object THEN 
        RAISE NOTICE '⚠️ Constraint equipment_stock_non_negative ya existe';
END $$;

-- SKU para mejor gestión de inventario
ALTER TABLE public.equipment 
ADD COLUMN IF NOT EXISTS sku text;

-- Índice para SKU
CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_sku 
ON public.equipment(sku) 
WHERE sku IS NOT NULL;

DO $$ 
BEGIN
    RAISE NOTICE '✅ Campos útiles agregados a equipment';
END $$;

-- ============================================
-- PASO 7: AGREGAR CAMPOS ÚTILES A ORDERS
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '📋 Agregando campos útiles a orders...';
END $$;

-- Total calculado para reportes más rápidos
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total_amount numeric;

-- Notas internas del admin
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS admin_notes text;

DO $$ 
BEGIN
    RAISE NOTICE '✅ Campos útiles agregados a orders';
END $$;

-- ============================================
-- PASO 8: CREAR FUNCIONES ÚTILES
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '🔧 Creando funciones útiles...';
END $$;

-- Función para obtener total de un pedido
CREATE OR REPLACE FUNCTION get_order_total(order_id_param text)
RETURNS numeric AS $$
  SELECT COALESCE(SUM(quantity * price_at_purchase), 0)
  FROM public.order_items
  WHERE order_id = order_id_param;
$$ LANGUAGE sql STABLE;

-- Función para obtener productos en promoción
CREATE OR REPLACE FUNCTION get_promotional_products()
RETURNS SETOF public.equipment AS $$
  SELECT * FROM public.equipment
  WHERE is_promotion = true 
    AND (is_deleted = false OR is_deleted IS NULL)
  ORDER BY promotional_price ASC;
$$ LANGUAGE sql STABLE;

-- Función para obtener productos por categoría
CREATE OR REPLACE FUNCTION get_products_by_category(category_param text)
RETURNS SETOF public.equipment AS $$
  SELECT * FROM public.equipment
  WHERE category = category_param 
    AND (is_deleted = false OR is_deleted IS NULL)
  ORDER BY created_at DESC;
$$ LANGUAGE sql STABLE;

-- Función para actualizar total_amount de un pedido
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.orders
  SET total_amount = (
    SELECT COALESCE(SUM(quantity * price_at_purchase), 0)
    FROM public.order_items
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
  )
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar total automáticamente
DROP TRIGGER IF EXISTS update_order_total_trigger ON public.order_items;
CREATE TRIGGER update_order_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.order_items
FOR EACH ROW EXECUTE FUNCTION update_order_total();

DO $$ 
BEGIN
    RAISE NOTICE '✅ Funciones útiles creadas';
END $$;

-- ============================================
-- PASO 9: CREAR VISTAS PARA REPORTES
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '📊 Creando vistas para reportes...';
END $$;

-- Vista para estadísticas de ventas mensuales
CREATE OR REPLACE VIEW public.sales_stats AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_orders,
  SUM((financials->>'totalOrderValue')::numeric) as total_revenue,
  AVG((financials->>'totalOrderValue')::numeric) as avg_order_value,
  COUNT(DISTINCT user_id) as unique_customers
FROM public.orders
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Vista para productos más vendidos
CREATE OR REPLACE VIEW public.top_selling_products AS
SELECT 
  e.id,
  e.name,
  e.category,
  e.muscle_group,
  COUNT(oi.id) as times_ordered,
  SUM(oi.quantity) as total_quantity_sold,
  SUM(oi.quantity * oi.price_at_purchase) as total_revenue
FROM public.equipment e
LEFT JOIN public.order_items oi ON e.id = oi.equipment_id
GROUP BY e.id, e.name, e.category, e.muscle_group
ORDER BY total_quantity_sold DESC NULLS LAST;

-- Vista para pedidos pendientes
CREATE OR REPLACE VIEW public.pending_orders AS
SELECT 
  o.*,
  u.name as customer_name,
  u.email as customer_email,
  COUNT(oi.id) as items_count
FROM public.orders o
LEFT JOIN public.users u ON o.user_id = u.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
WHERE o.status IN ('Pendiente de Aprobación', 'Recibido', 'En Desarrollo')
GROUP BY o.id, u.name, u.email
ORDER BY o.created_at DESC;

DO $$ 
BEGIN
    RAISE NOTICE '✅ Vistas para reportes creadas';
END $$;

-- ============================================
-- PASO 10: COMENTARIOS EN TABLAS Y COLUMNAS
-- ============================================

COMMENT ON TABLE public.equipment IS 'Catálogo de productos de gimnasio (maquinaria y accesorios)';
COMMENT ON TABLE public.orders IS 'Pedidos realizados por clientes';
COMMENT ON TABLE public.order_items IS 'Items individuales de cada pedido';
COMMENT ON TABLE public.users IS 'Usuarios del sistema (clientes, admin, transportistas)';
COMMENT ON TABLE public.events IS 'Eventos y promociones del gimnasio';
COMMENT ON TABLE public.gallery IS 'Galería de imágenes del gimnasio';
COMMENT ON TABLE public.site_config IS 'Configuración general del sitio';

COMMENT ON COLUMN public.equipment.is_deleted IS 'Soft delete: true = eliminado lógicamente';
COMMENT ON COLUMN public.equipment.stock_quantity IS 'Cantidad en stock (solo para productos in-stock)';
COMMENT ON COLUMN public.equipment.sku IS 'Código SKU único del producto';
COMMENT ON COLUMN public.orders.total_amount IS 'Total calculado del pedido (actualizado automáticamente)';
COMMENT ON COLUMN public.orders.admin_notes IS 'Notas internas del administrador';

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '====================================';
    RAISE NOTICE '✅ MIGRACIÓN COMPLETADA EXITOSAMENTE!';
    RAISE NOTICE '====================================';
    RAISE NOTICE '📊 Índices creados para mejor performance';
    RAISE NOTICE '🔒 Constraints agregados para validación de datos';
    RAISE NOTICE '📝 Columnas de auditoría agregadas (updated_at)';
    RAISE NOTICE '🔧 Funciones y vistas útiles creadas';
    RAISE NOTICE '====================================';
END $$;
