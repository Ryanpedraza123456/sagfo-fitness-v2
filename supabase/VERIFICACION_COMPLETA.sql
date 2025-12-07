-- ============================================
-- VERIFICACIÓN COMPLETA POST-MIGRACIÓN
-- ============================================

-- ============================================
-- 1. COLUMNAS NUEVAS
-- ============================================

SELECT '🔍 VERIFICANDO COLUMNAS NUEVAS...' as estado;

SELECT 
    table_name as tabla,
    column_name as columna,
    data_type as tipo,
    '✅' as estado
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND column_name IN ('updated_at', 'deleted_at', 'stock_quantity', 'sku', 'total_amount', 'admin_notes', 'last_login_at', 'email_verified')
ORDER BY table_name, column_name;

-- Resumen de columnas
SELECT 
    '📊 RESUMEN COLUMNAS' as seccion,
    COUNT(*) as total_columnas_nuevas,
    CASE 
        WHEN COUNT(*) >= 13 THEN '✅ COMPLETO'
        ELSE '⚠️ FALTAN ' || (13 - COUNT(*)) || ' columnas'
    END as estado
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND column_name IN ('updated_at', 'deleted_at', 'stock_quantity', 'sku', 'total_amount', 'admin_notes', 'last_login_at', 'email_verified');

-- ============================================
-- 2. ÍNDICES
-- ============================================

SELECT '🔍 VERIFICANDO ÍNDICES...' as estado;

SELECT 
    tablename as tabla,
    indexname as indice,
    '✅' as estado
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Resumen de índices
SELECT 
    '📊 RESUMEN ÍNDICES' as seccion,
    COUNT(*) as total_indices,
    CASE 
        WHEN COUNT(*) >= 15 THEN '✅ COMPLETO (' || COUNT(*) || ' índices)'
        ELSE '⚠️ FALTAN ' || (15 - COUNT(*)) || ' índices'
    END as estado
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';

-- ============================================
-- 3. TRIGGERS
-- ============================================

SELECT '🔍 VERIFICANDO TRIGGERS...' as estado;

SELECT 
    event_object_table as tabla,
    trigger_name as trigger,
    '✅' as estado
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Resumen de triggers
SELECT 
    '📊 RESUMEN TRIGGERS' as seccion,
    COUNT(*) as total_triggers,
    CASE 
        WHEN COUNT(*) >= 6 THEN '✅ COMPLETO (' || COUNT(*) || ' triggers)'
        ELSE '⚠️ FALTAN ' || (6 - COUNT(*)) || ' triggers'
    END as estado
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- ============================================
-- 4. FUNCIONES
-- ============================================

SELECT '🔍 VERIFICANDO FUNCIONES...' as estado;

SELECT 
    routine_name as funcion,
    routine_type as tipo,
    '✅' as estado
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

-- Resumen de funciones
SELECT 
    '📊 RESUMEN FUNCIONES' as seccion,
    COUNT(*) as total_funciones,
    CASE 
        WHEN COUNT(*) >= 5 THEN '✅ COMPLETO (' || COUNT(*) || ' funciones)'
        ELSE '⚠️ FALTAN ' || (5 - COUNT(*)) || ' funciones'
    END as estado
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';

-- ============================================
-- 5. VISTAS
-- ============================================

SELECT '🔍 VERIFICANDO VISTAS...' as estado;

SELECT 
    table_name as vista,
    '✅' as estado
FROM information_schema.views 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Resumen de vistas
SELECT 
    '📊 RESUMEN VISTAS' as seccion,
    COUNT(*) as total_vistas,
    CASE 
        WHEN COUNT(*) >= 4 THEN '✅ COMPLETO (' || COUNT(*) || ' vistas)'
        ELSE '⚠️ FALTAN ' || (4 - COUNT(*)) || ' vistas'
    END as estado
FROM information_schema.views 
WHERE table_schema = 'public';

-- ============================================
-- 6. CONSTRAINTS
-- ============================================

SELECT '🔍 VERIFICANDO CONSTRAINTS...' as estado;

SELECT 
    table_name as tabla,
    constraint_name as constraint,
    constraint_type as tipo,
    '✅' as estado
FROM information_schema.table_constraints
WHERE table_schema = 'public'
AND constraint_type IN ('CHECK', 'UNIQUE')
AND constraint_name NOT LIKE '%_pkey'
ORDER BY table_name, constraint_name;

-- Resumen de constraints
SELECT 
    '📊 RESUMEN CONSTRAINTS' as seccion,
    COUNT(*) as total_constraints,
    CASE 
        WHEN COUNT(*) >= 7 THEN '✅ COMPLETO (' || COUNT(*) || ' constraints)'
        ELSE '⚠️ FALTAN ' || (7 - COUNT(*)) || ' constraints'
    END as estado
FROM information_schema.table_constraints
WHERE table_schema = 'public'
AND constraint_type IN ('CHECK', 'UNIQUE')
AND constraint_name NOT LIKE '%_pkey';

-- ============================================
-- 7. VALIDACIÓN DE DATOS
-- ============================================

SELECT '🔍 VERIFICANDO INTEGRIDAD DE DATOS...' as estado;

-- Productos con precio inválido
SELECT 
    'Productos con precio inválido' as verificacion,
    COUNT(*) as cantidad,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ OK'
        ELSE '❌ HAY PROBLEMAS'
    END as estado
FROM public.equipment
WHERE price IS NULL OR price <= 0;

-- Promociones inválidas
SELECT 
    'Promociones inválidas' as verificacion,
    COUNT(*) as cantidad,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ OK'
        ELSE '⚠️ HAY PROBLEMAS'
    END as estado
FROM public.equipment
WHERE is_promotion = true 
AND (promotional_price IS NULL OR promotional_price <= 0 OR promotional_price >= price);

-- Order items con cantidad inválida
SELECT 
    'Order items con cantidad inválida' as verificacion,
    COUNT(*) as cantidad,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ OK'
        ELSE '❌ HAY PROBLEMAS'
    END as estado
FROM public.order_items
WHERE quantity IS NULL OR quantity <= 0;

-- ============================================
-- 8. ESTADÍSTICAS GENERALES
-- ============================================

SELECT '📊 ESTADÍSTICAS GENERALES' as estado;

-- Productos
SELECT 
    'Productos' as tabla,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE is_deleted = true) as eliminados,
    COUNT(*) FILTER (WHERE is_promotion = true) as en_promocion,
    COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as con_updated_at
FROM public.equipment;

-- Pedidos
SELECT 
    'Pedidos' as tabla,
    COUNT(*) as total,
    COUNT(DISTINCT user_id) as clientes_unicos,
    COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as con_updated_at,
    COUNT(*) FILTER (WHERE total_amount IS NOT NULL) as con_total_calculado
FROM public.orders;

-- Usuarios
SELECT 
    'Usuarios' as tabla,
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE role = 'customer') as clientes,
    COUNT(*) FILTER (WHERE role = 'admin') as admins,
    COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as con_updated_at
FROM public.users;

-- ============================================
-- 9. RESUMEN FINAL
-- ============================================

SELECT '═══════════════════════════════════════' as linea
UNION ALL SELECT '✅ RESUMEN FINAL DE VERIFICACIÓN'
UNION ALL SELECT '═══════════════════════════════════════'
UNION ALL
SELECT 
    '📝 Columnas: ' || 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND column_name IN ('updated_at', 'deleted_at', 'stock_quantity', 'sku', 'total_amount', 'admin_notes', 'last_login_at', 'email_verified')) >= 13 
        THEN '✅ OK (' || (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND column_name IN ('updated_at', 'deleted_at', 'stock_quantity', 'sku', 'total_amount', 'admin_notes', 'last_login_at', 'email_verified')) || '/13)'
        ELSE '❌ INCOMPLETO'
    END
UNION ALL
SELECT 
    '📊 Índices: ' || 
    CASE 
        WHEN (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%') >= 15 
        THEN '✅ OK (' || (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%') || ' creados)'
        ELSE '⚠️ INCOMPLETO (' || (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%') || '/15)'
    END
UNION ALL
SELECT 
    '⚡ Triggers: ' || 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') >= 6 
        THEN '✅ OK (' || (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') || ' triggers)'
        ELSE '⚠️ INCOMPLETO (' || (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') || '/6)'
    END
UNION ALL
SELECT 
    '🔧 Funciones: ' || 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') >= 5 
        THEN '✅ OK (' || (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') || ' funciones)'
        ELSE '⚠️ INCOMPLETO (' || (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') || '/5)'
    END
UNION ALL
SELECT 
    '👁️ Vistas: ' || 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') >= 4 
        THEN '✅ OK (' || (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') || ' vistas)'
        ELSE '⚠️ INCOMPLETO (' || (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') || '/4)'
    END
UNION ALL
SELECT 
    '🔒 Constraints: ' || 
    CASE 
        WHEN (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type IN ('CHECK', 'UNIQUE') AND constraint_name NOT LIKE '%_pkey') >= 7 
        THEN '✅ OK (' || (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type IN ('CHECK', 'UNIQUE') AND constraint_name NOT LIKE '%_pkey') || ' constraints)'
        ELSE '⚠️ INCOMPLETO (' || (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_schema = 'public' AND constraint_type IN ('CHECK', 'UNIQUE') AND constraint_name NOT LIKE '%_pkey') || '/7)'
    END
UNION ALL
SELECT 
    '✨ Datos: ' || 
    CASE 
        WHEN (SELECT COUNT(*) FROM public.equipment WHERE price IS NULL OR price <= 0) = 0 
        THEN '✅ OK (sin datos inválidos)'
        ELSE '❌ HAY DATOS INVÁLIDOS'
    END
UNION ALL SELECT '═══════════════════════════════════════'
UNION ALL
SELECT 
    CASE 
        WHEN (
            (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = 'public' AND column_name IN ('updated_at', 'deleted_at', 'stock_quantity', 'sku', 'total_amount', 'admin_notes', 'last_login_at', 'email_verified')) >= 13 AND
            (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public' AND indexname LIKE 'idx_%') >= 15 AND
            (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_schema = 'public') >= 6 AND
            (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public' AND routine_type = 'FUNCTION') >= 5 AND
            (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public') >= 4
        )
        THEN '🎉 ¡TODAS LAS MEJORAS APLICADAS CORRECTAMENTE!'
        ELSE '⚠️ ALGUNAS MEJORAS ESTÁN INCOMPLETAS'
    END
UNION ALL SELECT '═══════════════════════════════════════';
