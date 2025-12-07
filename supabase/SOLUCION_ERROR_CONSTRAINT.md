# 🔧 Solución al Error de Constraint

## ❌ Error Encontrado

```
ERROR: 23514: check constraint "equipment_price_positive" of relation "equipment" is violated by some row
```

**Causa**: Tienes productos en la base de datos con `price = 0` o `price < 0`.

---

## ✅ Solución Rápida (Opción 1)

### **Usar el script v2 que limpia automáticamente**

1. En Supabase SQL Editor, ejecuta:
   ```
   supabase/migrations/001_mejoras_schema_v2.sql
   ```

Este script:
- ✅ Limpia automáticamente los datos inválidos
- ✅ Asigna precio de 100,000 COP a productos con precio = 0
- ✅ Aplica todas las mejoras de forma segura

---

## 🔍 Solución Detallada (Opción 2)

### **Paso 1: Identificar productos con precio inválido**

```sql
SELECT 
    id, 
    name, 
    price, 
    category
FROM public.equipment
WHERE price IS NULL OR price <= 0;
```

### **Paso 2: Corregir los precios**

#### Opción A: Asignar precio por defecto
```sql
-- Asignar 100,000 COP a todos los productos sin precio
UPDATE public.equipment
SET price = 100000
WHERE price IS NULL OR price <= 0;
```

#### Opción B: Asignar precios específicos por categoría
```sql
-- Maquinaria: 500,000 COP
UPDATE public.equipment
SET price = 500000
WHERE (price IS NULL OR price <= 0) 
  AND category = 'Maquinaria';

-- Accesorios: 50,000 COP
UPDATE public.equipment
SET price = 50000
WHERE (price IS NULL OR price <= 0) 
  AND category = 'Accesorios';
```

#### Opción C: Eliminar productos sin precio (si no son importantes)
```sql
-- Soft delete de productos sin precio
UPDATE public.equipment
SET is_deleted = true,
    deleted_at = now()
WHERE price IS NULL OR price <= 0;
```

### **Paso 3: Verificar corrección**

```sql
-- Debería retornar 0
SELECT COUNT(*) as productos_con_precio_invalido
FROM public.equipment
WHERE price IS NULL OR price <= 0;
```

### **Paso 4: Aplicar el script de mejoras**

Ahora sí puedes ejecutar:
```
supabase/migrations/001_mejoras_schema.sql
```

O mejor aún:
```
supabase/migrations/001_mejoras_schema_v2.sql
```

---

## 📋 Script de Limpieza Completo

Si prefieres revisar todo antes de corregir, ejecuta primero:

```
supabase/migrations/000_limpieza_previa.sql
```

Este script:
1. ✅ Identifica TODOS los problemas (no solo precios)
2. ✅ Muestra qué se va a corregir
3. ✅ Corrige automáticamente
4. ✅ Verifica que todo esté bien

---

## 🎯 Recomendación

**Para tu caso específico**, te recomiendo:

### **Ejecutar directamente el script v2:**

```sql
-- En Supabase SQL Editor, copia y pega el contenido de:
-- supabase/migrations/001_mejoras_schema_v2.sql
```

**Ventajas:**
- ✅ Limpia automáticamente los datos
- ✅ Aplica todas las mejoras
- ✅ Maneja errores gracefully
- ✅ Muestra mensajes informativos

---

## 🔍 Verificación Post-Corrección

Después de ejecutar el script, verifica:

```sql
-- 1. Ver todos los productos y sus precios
SELECT id, name, price, category
FROM public.equipment
ORDER BY price ASC;

-- 2. Ver estadísticas de precios
SELECT 
    category,
    COUNT(*) as total_productos,
    MIN(price) as precio_minimo,
    MAX(price) as precio_maximo,
    AVG(price) as precio_promedio
FROM public.equipment
WHERE is_deleted = false OR is_deleted IS NULL
GROUP BY category;

-- 3. Verificar que no haya precios inválidos
SELECT COUNT(*) as productos_invalidos
FROM public.equipment
WHERE price IS NULL OR price <= 0;
-- Debe retornar 0
```

---

## ⚠️ Prevención Futura

Una vez aplicadas las mejoras, el constraint `equipment_price_positive` **prevendrá** que se creen productos con precio inválido en el futuro.

Si intentas crear un producto con `price = 0`, obtendrás un error:
```
ERROR: new row for relation "equipment" violates check constraint "equipment_price_positive"
```

Esto es **bueno** porque protege la integridad de tus datos.

---

## 📞 Si Necesitas Ayuda

Si el error persiste o tienes dudas:

1. Ejecuta este query y comparte el resultado:
```sql
SELECT 
    id, 
    name, 
    price, 
    promotional_price,
    is_promotion,
    category
FROM public.equipment
WHERE price IS NULL OR price <= 0
ORDER BY created_at DESC;
```

2. Verifica cuántos productos tienes en total:
```sql
SELECT COUNT(*) as total_productos FROM public.equipment;
```

---

## 🚀 Resumen de Pasos

1. ✅ **Ejecutar**: `001_mejoras_schema_v2.sql` (limpia y aplica mejoras)
2. ✅ **Verificar**: Que no haya productos con precio <= 0
3. ✅ **Probar**: La aplicación sigue funcionando
4. ✅ **Disfrutar**: Mejor performance y validación automática

---

**Archivo recomendado**: `supabase/migrations/001_mejoras_schema_v2.sql`

Este archivo ya está listo para usar y corregirá automáticamente el problema.
