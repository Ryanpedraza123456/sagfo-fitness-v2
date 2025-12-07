-- ============================================
-- ROLLBACK DE MEJORAS DE SCHEMA
-- Versión: 1.0
-- Fecha: 2025-12-06
-- ============================================
-- ⚠️ USAR SOLO SI NECESITAS REVERTIR LOS CAMBIOS
-- ============================================

-- ============================================
-- PASO 1: ELIMINAR VISTAS
-- ============================================

DROP VIEW IF EXISTS public.pending_orders;
DROP VIEW IF EXISTS public.top_selling_products;
DROP VIEW IF EXISTS public.sales_stats;
DROP VIEW IF EXISTS public.equipment_active;

-- ============================================
-- PASO 2: ELIMINAR TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_order_total_trigger ON public.order_items;
DROP TRIGGER IF EXISTS update_equipment_updated_at ON public.equipment;
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
DROP TRIGGER IF EXISTS update_gallery_updated_at ON public.gallery;
DROP TRIGGER IF EXISTS update_site_config_updated_at ON public.site_config;

-- ============================================
-- PASO 3: ELIMINAR FUNCIONES
-- ============================================

DROP FUNCTION IF EXISTS update_order_total();
DROP FUNCTION IF EXISTS get_products_by_category(text);
DROP FUNCTION IF EXISTS get_promotional_products();
DROP FUNCTION IF EXISTS get_order_total(text);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- ============================================
-- PASO 4: ELIMINAR CONSTRAINTS
-- ============================================

-- Equipment constraints
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS equipment_price_positive;
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS equipment_promotional_price_positive;
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS equipment_promo_less_than_price;
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS equipment_stock_non_negative;

-- Order items constraints
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_quantity_positive;
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_price_non_negative;

-- Users constraints
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_email_unique;

-- ============================================
-- PASO 5: ELIMINAR ÍNDICES
-- ============================================

-- Equipment indices
DROP INDEX IF EXISTS public.idx_equipment_category;
DROP INDEX IF EXISTS public.idx_equipment_muscle_group;
DROP INDEX IF EXISTS public.idx_equipment_availability;
DROP INDEX IF EXISTS public.idx_equipment_is_deleted;
DROP INDEX IF EXISTS public.idx_equipment_is_promotion;
DROP INDEX IF EXISTS public.idx_equipment_created_at;
DROP INDEX IF EXISTS public.idx_equipment_active;
DROP INDEX IF EXISTS public.idx_equipment_sku;

-- Orders indices
DROP INDEX IF EXISTS public.idx_orders_user_id;
DROP INDEX IF EXISTS public.idx_orders_status;
DROP INDEX IF EXISTS public.idx_orders_created_at;
DROP INDEX IF EXISTS public.idx_orders_transporter;

-- Order items indices
DROP INDEX IF EXISTS public.idx_order_items_order_id;
DROP INDEX IF EXISTS public.idx_order_items_equipment_id;

-- Users indices
DROP INDEX IF EXISTS public.idx_users_email;
DROP INDEX IF EXISTS public.idx_users_role;

-- Events indices
DROP INDEX IF EXISTS public.idx_events_date;
DROP INDEX IF EXISTS public.idx_events_created_at;

-- Gallery indices
DROP INDEX IF EXISTS public.idx_gallery_created_at;

-- ============================================
-- PASO 6: ELIMINAR COLUMNAS NUEVAS
-- ============================================

-- Equipment columns
ALTER TABLE public.equipment DROP COLUMN IF EXISTS updated_at;
ALTER TABLE public.equipment DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE public.equipment DROP COLUMN IF EXISTS stock_quantity;
ALTER TABLE public.equipment DROP COLUMN IF EXISTS sku;

-- Orders columns
ALTER TABLE public.orders DROP COLUMN IF EXISTS updated_at;
ALTER TABLE public.orders DROP COLUMN IF EXISTS total_amount;
ALTER TABLE public.orders DROP COLUMN IF EXISTS admin_notes;

-- Users columns
ALTER TABLE public.users DROP COLUMN IF EXISTS updated_at;
ALTER TABLE public.users DROP COLUMN IF EXISTS last_login_at;
ALTER TABLE public.users DROP COLUMN IF EXISTS email_verified;

-- Events columns
ALTER TABLE public.events DROP COLUMN IF EXISTS updated_at;

-- Gallery columns
ALTER TABLE public.gallery DROP COLUMN IF EXISTS updated_at;

-- Site config columns
ALTER TABLE public.site_config DROP COLUMN IF EXISTS updated_at;

-- ============================================
-- PASO 7: ELIMINAR COMENTARIOS
-- ============================================

COMMENT ON TABLE public.equipment IS NULL;
COMMENT ON TABLE public.orders IS NULL;
COMMENT ON TABLE public.order_items IS NULL;
COMMENT ON TABLE public.users IS NULL;
COMMENT ON TABLE public.events IS NULL;
COMMENT ON TABLE public.gallery IS NULL;
COMMENT ON TABLE public.site_config IS NULL;

COMMENT ON COLUMN public.equipment.is_deleted IS NULL;
COMMENT ON COLUMN public.equipment.stock_quantity IS NULL;
COMMENT ON COLUMN public.equipment.sku IS NULL;
COMMENT ON COLUMN public.orders.total_amount IS NULL;
COMMENT ON COLUMN public.orders.admin_notes IS NULL;

-- ============================================
-- FIN DE ROLLBACK
-- ============================================

DO $$ 
BEGIN
    RAISE NOTICE '⚠️ Rollback completado';
    RAISE NOTICE '📊 Todas las mejoras han sido revertidas';
    RAISE NOTICE '🔄 El schema ha vuelto a su estado original';
END $$;
