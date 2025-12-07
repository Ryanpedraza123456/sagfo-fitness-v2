-- ============================================
-- SCRIPT DE LIMPIEZA PREVIA A MEJORAS
-- Corrige datos inválidos antes de aplicar constraints
-- ============================================

-- ============================================
-- PASO 1: IDENTIFICAR PROBLEMAS
-- ============================================

-- Ver productos con precio inválido
SELECT 
    id, 
    name, 
    price, 
    promotional_price,
    category
FROM public.equipment
WHERE price IS NULL OR price <= 0;

-- Ver productos con precio promocional inválido
SELECT 
    id, 
    name, 
    price, 
    promotional_price,
    category
FROM public.equipment
WHERE is_promotion = true 
  AND (promotional_price IS NULL 
       OR promotional_price <= 0 
       OR promotional_price >= price);

-- Ver order_items con cantidad inválida
SELECT 
    id, 
    order_id, 
    equipment_id, 
    quantity,
    price_at_purchase
FROM public.order_items
WHERE quantity IS NULL OR quantity <= 0;

-- Ver order_items con precio inválido
SELECT 
    id, 
    order_id, 
    equipment_id, 
    quantity,
    price_at_purchase
FROM public.order_items
WHERE price_at_purchase IS NULL OR price_at_purchase < 0;

-- Ver emails duplicados en users
SELECT 
    email, 
    COUNT(*) as count,
    STRING_AGG(id, ', ') as user_ids
FROM public.users
WHERE email IS NOT NULL
GROUP BY email
HAVING COUNT(*) > 1;

-- ============================================
-- PASO 2: CORREGIR PROBLEMAS
-- ============================================

-- Corregir productos con precio = 0 o NULL
-- Asignar un precio por defecto de 100,000 COP
UPDATE public.equipment
SET price = 100000
WHERE price IS NULL OR price <= 0;

-- Corregir productos con precio promocional inválido
-- Opción 1: Desactivar promoción si el precio es inválido
UPDATE public.equipment
SET is_promotion = false,
    promotional_price = NULL
WHERE is_promotion = true 
  AND (promotional_price IS NULL 
       OR promotional_price <= 0 
       OR promotional_price >= price);

-- Corregir order_items con cantidad inválida
-- Asignar cantidad = 1 por defecto
UPDATE public.order_items
SET quantity = 1
WHERE quantity IS NULL OR quantity <= 0;

-- Corregir order_items con precio inválido
-- Usar el precio del producto si está disponible
UPDATE public.order_items oi
SET price_at_purchase = e.price
FROM public.equipment e
WHERE oi.equipment_id = e.id
  AND (oi.price_at_purchase IS NULL OR oi.price_at_purchase < 0);

-- Si aún hay precios inválidos, asignar 0
UPDATE public.order_items
SET price_at_purchase = 0
WHERE price_at_purchase IS NULL OR price_at_purchase < 0;

-- ============================================
-- PASO 3: LIMPIAR EMAILS DUPLICADOS (MANUAL)
-- ============================================

-- ⚠️ IMPORTANTE: Este paso debe hacerse manualmente
-- porque depende de qué usuario quieres mantener

-- Ejemplo de cómo limpiar duplicados:
-- 1. Identificar el usuario que quieres mantener
-- 2. Actualizar las referencias en orders
-- 3. Eliminar el usuario duplicado

-- EJEMPLO (NO EJECUTAR TAL CUAL):
/*
-- Supongamos que tienes dos usuarios con email 'test@example.com'
-- Usuario 1: id = 'user-123' (MANTENER)
-- Usuario 2: id = 'user-456' (ELIMINAR)

-- Paso 1: Actualizar pedidos del usuario duplicado
UPDATE public.orders
SET user_id = 'user-123'
WHERE user_id = 'user-456';

-- Paso 2: Eliminar usuario duplicado
DELETE FROM public.users
WHERE id = 'user-456';
*/

-- ============================================
-- PASO 4: VERIFICAR CORRECCIONES
-- ============================================

-- Verificar que no haya productos con precio inválido
SELECT COUNT(*) as productos_con_precio_invalido
FROM public.equipment
WHERE price IS NULL OR price <= 0;
-- Debería retornar 0

-- Verificar que no haya promociones inválidas
SELECT COUNT(*) as promociones_invalidas
FROM public.equipment
WHERE is_promotion = true 
  AND (promotional_price IS NULL 
       OR promotional_price <= 0 
       OR promotional_price >= price);
-- Debería retornar 0

-- Verificar que no haya order_items con cantidad inválida
SELECT COUNT(*) as items_con_cantidad_invalida
FROM public.order_items
WHERE quantity IS NULL OR quantity <= 0;
-- Debería retornar 0

-- Verificar que no haya order_items con precio inválido
SELECT COUNT(*) as items_con_precio_invalido
FROM public.order_items
WHERE price_at_purchase IS NULL OR price_at_purchase < 0;
-- Debería retornar 0

-- Verificar emails duplicados
SELECT COUNT(*) as emails_duplicados
FROM (
    SELECT email
    FROM public.users
    WHERE email IS NOT NULL
    GROUP BY email
    HAVING COUNT(*) > 1
) duplicados;
-- Debería retornar 0

-- ============================================
-- RESUMEN DE CAMBIOS
-- ============================================

DO $$ 
DECLARE
    productos_corregidos INTEGER;
    promociones_corregidas INTEGER;
    items_cantidad_corregidos INTEGER;
    items_precio_corregidos INTEGER;
BEGIN
    -- Contar productos corregidos
    SELECT COUNT(*) INTO productos_corregidos
    FROM public.equipment
    WHERE price = 100000; -- Precio por defecto que asignamos
    
    RAISE NOTICE '✅ Limpieza completada';
    RAISE NOTICE '📊 Productos con precio corregido: %', productos_corregidos;
    RAISE NOTICE '⚠️ Revisa los resultados de PASO 4 antes de continuar';
    RAISE NOTICE '📝 Si hay emails duplicados, límpialos manualmente';
END $$;
