-- ============================================
-- SCRIPT DE VERIFICACIÓN POST-MIGRACIÓN
-- Verifica que todas las mejoras se aplicaron correctamente
-- ============================================

-- ============================================
-- VERIFICACIÓN 1: COLUMNAS NUEVAS
-- ============================================

SELECT 
    '✅ VERIFICACIÓN DE COLUMNAS NUEVAS' as seccion;

-- Verificar updated_at en equipment
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'equipment' AND column_name = 'updated_at'
        ) THEN '✅ equipment.updated_at existe'
        ELSE '❌ equipment.updated_at NO existe'
    END as resultado;

-- Verificar deleted_at en equipment
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'equipment' AND column_name = 'deleted_at'
        ) THEN '✅ equipment.deleted_at existe'
        ELSE '❌ equipment.deleted_at NO existe'
    END as resultado;

-- Verificar stock_quantity en equipment
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'equipment' AND column_name = 'stock_quantity'
        ) THEN '✅ equipment.stock_quantity existe'
        ELSE '❌ equipment.stock_quantity NO existe'
    END as resultado;

-- Verificar sku en equipment
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'equipment' AND column_name = 'sku'
        ) THEN '✅ equipment.sku existe'
        ELSE '❌ equipment.sku NO existe'
    END as resultado;

-- Verificar updated_at en orders
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'updated_at'
        ) THEN '✅ orders.updated_at existe'
        ELSE '❌ orders.updated_at NO existe'
    END as resultado;

-- Verificar total_amount en orders
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'total_amount'
        ) THEN '✅ orders.total_amount existe'
        ELSE '❌ orders.total_amount NO existe'
    END as resultado;

-- Verificar admin_notes en orders
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'orders' AND column_name = 'admin_notes'
        ) THEN '✅ orders.admin_notes existe'
        ELSE '❌ orders.admin_notes NO existe'
    END as resultado;

-- Verificar updated_at en users
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'updated_at'
        ) THEN '✅ users.updated_at existe'
        ELSE '❌ users.updated_at NO existe'
    END as resultado;

-- Verificar last_login_at en users
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'last_login_at'
        ) THEN '✅ users.last_login_at existe'
        ELSE '❌ users.last_login_at NO existe'
    END as resultado;

-- Verificar email_verified en users
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'email_verified'
        ) THEN '✅ users.email_verified existe'
        ELSE '❌ users.email_verified NO existe'
    END as resultado;

-- ============================================
-- VERIFICACIÓN 2: ÍNDICES
-- ============================================

SELECT 
    '✅ VERIFICACIÓN DE ÍNDICES' as seccion;

-- Contar índices creados
SELECT 
    COUNT(*) as total_indices_nuevos,
    '✅ Índices encontrados' as resultado
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';

-- Listar índices importantes
SELECT 
    indexname,
    tablename,
    '✅ Existe' as estado
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname IN (
    'idx_equipment_category',
    'idx_equipment_is_promotion',
    'idx_orders_user_id',
    'idx_orders_status',
    'idx_users_email'
)
ORDER BY tablename, indexname;

-- ============================================
-- VERIFICACIÓN 3: CONSTRAINTS
-- ============================================

SELECT 
    '✅ VERIFICACIÓN DE CONSTRAINTS' as seccion;

-- Listar constraints de equipment
SELECT 
    constraint_name,
    '✅ Existe' as estado
FROM information_schema.table_constraints
WHERE table_name = 'equipment'
AND constraint_type = 'CHECK'
ORDER BY constraint_name;

-- Listar constraints de order_items
SELECT 
    constraint_name,
    '✅ Existe' as estado
FROM information_schema.table_constraints
WHERE table_name = 'order_items'
AND constraint_type = 'CHECK'
ORDER BY constraint_name;

-- Verificar constraint de email único
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE table_name = 'users' 
            AND constraint_name = 'users_email_unique'
        ) THEN '✅ users.email es UNIQUE'
        ELSE '⚠️ users.email NO es UNIQUE (puede haber duplicados)'
    END as resultado;

-- ============================================
-- VERIFICACIÓN 4: TRIGGERS
-- ============================================

SELECT 
    '✅ VERIFICACIÓN DE TRIGGERS' as seccion;

-- Listar todos los triggers
SELECT 
    trigger_name,
    event_object_table as tabla,
    '✅ Existe' as estado
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- ============================================
-- VERIFICACIÓN 5: FUNCIONES
-- ============================================

SELECT 
    '✅ VERIFICACIÓN DE FUNCIONES' as seccion;

-- Listar funciones creadas
SELECT 
    routine_name as nombre_funcion,
    '✅ Existe' as estado
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name IN (
    'update_updated_at_column',
    'get_order_total',
    'get_promotional_products',
    'get_products_by_category',
    'update_order_total'
)
ORDER BY routine_name;

-- ============================================
-- VERIFICACIÓN 6: VISTAS
-- ============================================

SELECT 
    '✅ VERIFICACIÓN DE VISTAS' as seccion;

-- Listar vistas creadas
SELECT 
    table_name as nombre_vista,
    '✅ Existe' as estado
FROM information_schema.views 
WHERE table_schema = 'public'
AND table_name IN (
    'equipment_active',
    'sales_stats',
    'top_selling_products',
    'pending_orders'
)
ORDER BY table_name;

-- ============================================
-- VERIFICACIÓN 7: DATOS LIMPIOS
-- ============================================

SELECT 
    '✅ VERIFICACIÓN DE DATOS' as seccion;

-- Verificar que no haya productos con precio inválido
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todos los productos tienen precio válido'
        ELSE '❌ Hay ' || COUNT(*) || ' productos con precio inválido'
    END as resultado
FROM public.equipment
WHERE price IS NULL OR price <= 0;

-- Verificar que no haya promociones inválidas
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las promociones son válidas'
        ELSE '⚠️ Hay ' || COUNT(*) || ' promociones con precio inválido'
    END as resultado
FROM public.equipment
WHERE is_promotion = true 
AND (promotional_price IS NULL 
     OR promotional_price <= 0 
     OR promotional_price >= price);

-- Verificar que no haya order_items con cantidad inválida
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todos los items tienen cantidad válida'
        ELSE '❌ Hay ' || COUNT(*) || ' items con cantidad inválida'
    END as resultado
FROM public.order_items
WHERE quantity IS NULL OR quantity <= 0;

-- ============================================
-- VERIFICACIÓN 8: ESTADÍSTICAS GENERALES
-- ============================================

SELECT 
    '📊 ESTADÍSTICAS GENERALES' as seccion;

-- Estadísticas de productos
SELECT 
    'Productos' as tabla,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_deleted = true) as eliminados,
    COUNT(*) FILTER (WHERE is_promotion = true) as en_promocion
FROM public.equipment;

-- Estadísticas de pedidos
SELECT 
    'Pedidos' as tabla,
    COUNT(*) as total,
    COUNT(DISTINCT user_id) as clientes_unicos,
    COUNT(*) FILTER (WHERE status = 'Pendiente de Aprobación') as pendientes
FROM public.orders;

-- Estadísticas de usuarios
SELECT 
    'Usuarios' as tabla,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE role = 'customer') as clientes,
    COUNT(*) FILTER (WHERE role = 'admin') as admins,
    COUNT(*) FILTER (WHERE role = 'transporter') as transportistas
FROM public.users;

-- ============================================
-- RESUMEN FINAL
-- ============================================

SELECT 
    '=====================================' as linea
UNION ALL
SELECT '✅ RESUMEN DE VERIFICACIÓN'
UNION ALL
SELECT '======================================'
UNION ALL
SELECT 
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.columns 
            WHERE table_name = 'equipment' AND column_name = 'updated_at'
        ) > 0 THEN '✅ Columnas de auditoría: OK'
        ELSE '❌ Columnas de auditoría: FALTA'
    END
UNION ALL
SELECT 
    CASE 
        WHEN (
            SELECT COUNT(*) FROM pg_indexes 
            WHERE schemaname = 'public' AND indexname LIKE 'idx_%'
        ) >= 10 THEN '✅ Índices: OK (' || (
            SELECT COUNT(*)::text FROM pg_indexes 
            WHERE schemaname = 'public' AND indexname LIKE 'idx_%'
        ) || ' creados)'
        ELSE '⚠️ Índices: INCOMPLETO'
    END
UNION ALL
SELECT 
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.triggers 
            WHERE trigger_schema = 'public' AND trigger_name LIKE '%updated_at%'
        ) >= 5 THEN '✅ Triggers: OK'
        ELSE '⚠️ Triggers: INCOMPLETO'
    END
UNION ALL
SELECT 
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.routines 
            WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
        ) >= 4 THEN '✅ Funciones: OK'
        ELSE '⚠️ Funciones: INCOMPLETO'
    END
UNION ALL
SELECT 
    CASE 
        WHEN (
            SELECT COUNT(*) FROM information_schema.views 
            WHERE table_schema = 'public'
        ) >= 3 THEN '✅ Vistas: OK'
        ELSE '⚠️ Vistas: INCOMPLETO'
    END
UNION ALL
SELECT '======================================';
