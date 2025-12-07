-- ============================================
-- VERIFICAR DÓNDE ESTÁN LAS IMÁGENES
-- ============================================

SELECT '🔍 VERIFICANDO UBICACIÓN DE IMÁGENES' as estado;

-- ============================================
-- 1. IMÁGENES DE PRODUCTOS
-- ============================================

SELECT 
    '📦 PRODUCTOS' as seccion,
    id,
    name,
    image_urls[1] as primera_imagen,
    CASE 
        WHEN image_urls[1] LIKE '%vercel-storage.com%' OR image_urls[1] LIKE '%blob.vercel-storage.com%' 
        THEN '✅ Vercel Blob'
        WHEN image_urls[1] LIKE '%supabase%' 
        THEN '⚠️ Supabase Storage (antigua)'
        WHEN image_urls[1] LIKE '%unsplash%' 
        THEN '📸 Unsplash (demo)'
        ELSE '❓ Otro origen'
    END as origen,
    created_at
FROM public.equipment
WHERE image_urls IS NOT NULL 
AND array_length(image_urls, 1) > 0
ORDER BY created_at DESC
LIMIT 10;

-- Resumen de productos
SELECT 
    '📊 RESUMEN PRODUCTOS' as tipo,
    COUNT(*) as total_productos,
    COUNT(*) FILTER (WHERE image_urls[1] LIKE '%vercel-storage.com%' OR image_urls[1] LIKE '%blob.vercel-storage.com%') as en_vercel_blob,
    COUNT(*) FILTER (WHERE image_urls[1] LIKE '%supabase%') as en_supabase,
    COUNT(*) FILTER (WHERE image_urls[1] LIKE '%unsplash%') as en_unsplash
FROM public.equipment
WHERE image_urls IS NOT NULL 
AND array_length(image_urls, 1) > 0;

-- ============================================
-- 2. IMÁGENES DE GALERÍA
-- ============================================

SELECT 
    '🖼️ GALERÍA' as seccion,
    id,
    caption,
    image_url,
    CASE 
        WHEN image_url LIKE '%vercel-storage.com%' OR image_url LIKE '%blob.vercel-storage.com%' 
        THEN '✅ Vercel Blob'
        WHEN image_url LIKE '%supabase%' 
        THEN '⚠️ Supabase Storage (antigua)'
        WHEN image_url LIKE '%unsplash%' 
        THEN '📸 Unsplash (demo)'
        ELSE '❓ Otro origen'
    END as origen,
    created_at
FROM public.gallery
ORDER BY created_at DESC
LIMIT 10;

-- Resumen de galería
SELECT 
    '📊 RESUMEN GALERÍA' as tipo,
    COUNT(*) as total_imagenes,
    COUNT(*) FILTER (WHERE image_url LIKE '%vercel-storage.com%' OR image_url LIKE '%blob.vercel-storage.com%') as en_vercel_blob,
    COUNT(*) FILTER (WHERE image_url LIKE '%supabase%') as en_supabase,
    COUNT(*) FILTER (WHERE image_url LIKE '%unsplash%') as en_unsplash
FROM public.gallery;

-- ============================================
-- 3. IMÁGENES DE EVENTOS
-- ============================================

SELECT 
    '📅 EVENTOS' as seccion,
    id,
    title,
    image_url,
    CASE 
        WHEN image_url LIKE '%vercel-storage.com%' OR image_url LIKE '%blob.vercel-storage.com%' 
        THEN '✅ Vercel Blob'
        WHEN image_url LIKE '%supabase%' 
        THEN '⚠️ Supabase Storage (antigua)'
        WHEN image_url LIKE '%unsplash%' 
        THEN '📸 Unsplash (demo)'
        ELSE '❓ Otro origen'
    END as origen,
    created_at
FROM public.events
ORDER BY created_at DESC
LIMIT 10;

-- Resumen de eventos
SELECT 
    '📊 RESUMEN EVENTOS' as tipo,
    COUNT(*) as total_eventos,
    COUNT(*) FILTER (WHERE image_url LIKE '%vercel-storage.com%' OR image_url LIKE '%blob.vercel-storage.com%') as en_vercel_blob,
    COUNT(*) FILTER (WHERE image_url LIKE '%supabase%') as en_supabase,
    COUNT(*) FILTER (WHERE image_url LIKE '%unsplash%') as en_unsplash
FROM public.events;

-- ============================================
-- 4. RESUMEN GENERAL
-- ============================================

SELECT '═══════════════════════════════════════' as linea
UNION ALL SELECT '📊 RESUMEN GENERAL DE IMÁGENES'
UNION ALL SELECT '═══════════════════════════════════════'
UNION ALL
SELECT 
    '📦 Productos en Vercel Blob: ' || 
    COALESCE(
        (SELECT COUNT(*)::text FROM public.equipment 
         WHERE image_urls[1] LIKE '%vercel-storage.com%' OR image_urls[1] LIKE '%blob.vercel-storage.com%'),
        '0'
    ) || ' / ' ||
    COALESCE(
        (SELECT COUNT(*)::text FROM public.equipment 
         WHERE image_urls IS NOT NULL AND array_length(image_urls, 1) > 0),
        '0'
    )
UNION ALL
SELECT 
    '🖼️ Galería en Vercel Blob: ' || 
    COALESCE(
        (SELECT COUNT(*)::text FROM public.gallery 
         WHERE image_url LIKE '%vercel-storage.com%' OR image_url LIKE '%blob.vercel-storage.com%'),
        '0'
    ) || ' / ' ||
    COALESCE(
        (SELECT COUNT(*)::text FROM public.gallery),
        '0'
    )
UNION ALL
SELECT 
    '📅 Eventos en Vercel Blob: ' || 
    COALESCE(
        (SELECT COUNT(*)::text FROM public.events 
         WHERE image_url LIKE '%vercel-storage.com%' OR image_url LIKE '%blob.vercel-storage.com%'),
        '0'
    ) || ' / ' ||
    COALESCE(
        (SELECT COUNT(*)::text FROM public.events),
        '0'
    )
UNION ALL SELECT '═══════════════════════════════════════'
UNION ALL
SELECT 
    CASE 
        WHEN (
            SELECT COUNT(*) FROM public.equipment 
            WHERE image_urls[1] LIKE '%vercel-storage.com%' OR image_urls[1] LIKE '%blob.vercel-storage.com%'
        ) > 0
        THEN '✅ HAY IMÁGENES EN VERCEL BLOB'
        ELSE '⚠️ AÚN NO HAY IMÁGENES EN VERCEL BLOB (todas son antiguas o de demo)'
    END
UNION ALL SELECT '═══════════════════════════════════════'
UNION ALL SELECT ''
UNION ALL SELECT '💡 NOTA: Las imágenes antiguas seguirán funcionando.'
UNION ALL SELECT '💡 Las NUEVAS imágenes que subas se guardarán en Vercel Blob.'
UNION ALL SELECT '💡 Para probar, crea un producto nuevo o agrega una imagen a la galería.';
