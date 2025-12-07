# 📘 Guía de Aplicación de Mejoras al Schema de Supabase

## 🎯 Objetivo
Aplicar mejoras al schema de Supabase para optimizar performance, seguridad y funcionalidad.

---

## ⚠️ ANTES DE EMPEZAR

### 1. **Hacer Backup de la Base de Datos**

#### Opción A: Desde Supabase Dashboard
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a **Database** → **Backups**
3. Click en **Create Backup**
4. Espera a que se complete

#### Opción B: Usando pg_dump (Avanzado)
```bash
# Obtén la connection string de Supabase Dashboard > Settings > Database
pg_dump "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" > backup_$(date +%Y%m%d).sql
```

### 2. **Verificar Estado Actual**

Ejecuta esto en el SQL Editor de Supabase:

```sql
-- Ver cuántos productos tienes
SELECT COUNT(*) as total_products FROM public.equipment;

-- Ver cuántos pedidos tienes
SELECT COUNT(*) as total_orders FROM public.orders;

-- Ver cuántos usuarios tienes
SELECT COUNT(*) as total_users FROM public.users;

-- Verificar si hay emails duplicados (IMPORTANTE)
SELECT email, COUNT(*) 
FROM public.users 
WHERE email IS NOT NULL
GROUP BY email 
HAVING COUNT(*) > 1;
```

**⚠️ Si hay emails duplicados, debes limpiarlos antes de continuar!**

---

## 🚀 APLICACIÓN DE MEJORAS

### **Método 1: Aplicar Todo de Una Vez (Recomendado para DBs pequeñas)**

1. Abre Supabase Dashboard
2. Ve a **SQL Editor**
3. Copia y pega el contenido completo de:
   ```
   supabase/migrations/001_mejoras_schema.sql
   ```
4. Click en **Run**
5. Espera a que termine (puede tomar 1-2 minutos)
6. Verifica que no haya errores

### **Método 2: Aplicar Paso a Paso (Recomendado para DBs grandes)**

#### **Paso 1: Índices (5-10 segundos)**
```sql
-- Copia solo la sección "PASO 1: CREAR ÍNDICES" del archivo
-- 001_mejoras_schema.sql y ejecuta
```

✅ **Verificar**: Los índices deberían aparecer en Database > Indexes

#### **Paso 2: Auditoría (10-15 segundos)**
```sql
-- Copia solo la sección "PASO 2: AGREGAR COLUMNAS DE AUDITORÍA"
```

✅ **Verificar**:
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'equipment' AND column_name = 'updated_at';
-- Debería retornar 'updated_at'
```

#### **Paso 3: Constraints (5-10 segundos)**
```sql
-- Copia solo la sección "PASO 3: AGREGAR CONSTRAINTS DE VALIDACIÓN"
```

⚠️ **Puede fallar si tienes datos inválidos**. Si falla:
```sql
-- Ver qué productos tienen precio <= 0
SELECT id, name, price FROM public.equipment WHERE price <= 0;

-- Corregir antes de aplicar constraints
UPDATE public.equipment SET price = 100 WHERE price <= 0;
```

#### **Paso 4: Mejorar Users (2-5 segundos)**
```sql
-- Copia solo la sección "PASO 4: MEJORAR TABLA USERS"
```

⚠️ **Puede fallar si hay emails duplicados**. Si falla, limpia duplicados primero.

#### **Paso 5-10: Resto de Mejoras**
Continúa aplicando cada paso del archivo `001_mejoras_schema.sql`

---

## ✅ VERIFICACIÓN POST-APLICACIÓN

### 1. **Verificar Índices**
```sql
SELECT 
    tablename, 
    indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

Deberías ver índices como:
- `idx_equipment_category`
- `idx_equipment_is_promotion`
- `idx_orders_user_id`
- etc.

### 2. **Verificar Triggers**
```sql
SELECT 
    trigger_name, 
    event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

Deberías ver:
- `update_equipment_updated_at`
- `update_orders_updated_at`
- etc.

### 3. **Verificar Funciones**
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION';
```

Deberías ver:
- `get_order_total`
- `get_promotional_products`
- `update_updated_at_column`
- etc.

### 4. **Verificar Vistas**
```sql
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public';
```

Deberías ver:
- `equipment_active`
- `sales_stats`
- `top_selling_products`
- `pending_orders`

### 5. **Probar Funcionalidad**

```sql
-- Probar vista de productos activos
SELECT COUNT(*) FROM public.equipment_active;

-- Probar función de total de pedido
SELECT get_order_total('ord-1234567890'); -- Usa un ID real

-- Probar vista de productos en promoción
SELECT * FROM get_promotional_products() LIMIT 5;

-- Probar estadísticas de ventas
SELECT * FROM public.sales_stats;
```

---

## 🧪 PRUEBAS EN LA APLICACIÓN

### 1. **Probar que todo sigue funcionando**

```bash
# Iniciar la aplicación
npm run dev
```

### 2. **Verificar funcionalidades clave:**

- ✅ Ver catálogo de productos
- ✅ Crear nuevo producto (admin)
- ✅ Editar producto existente (admin)
- ✅ Crear pedido
- ✅ Ver mis pedidos
- ✅ Agregar imagen a galería (admin)
- ✅ Crear evento (admin)

### 3. **Verificar que updated_at se actualiza**

```sql
-- Antes de editar un producto, ver su updated_at
SELECT id, name, updated_at FROM public.equipment WHERE id = 'prod-123';

-- Edita el producto desde la aplicación

-- Después de editar, verificar que updated_at cambió
SELECT id, name, updated_at FROM public.equipment WHERE id = 'prod-123';
-- updated_at debería ser más reciente
```

---

## 🔄 SI ALGO SALE MAL

### **Opción 1: Rollback Completo**

```sql
-- Ejecuta el archivo de rollback
-- supabase/migrations/001_rollback.sql
```

### **Opción 2: Restaurar desde Backup**

1. Ve a Supabase Dashboard → Database → Backups
2. Selecciona el backup que creaste antes
3. Click en **Restore**
4. Confirma la restauración

### **Opción 3: Rollback Selectivo**

Si solo una parte falló, puedes revertir solo esa parte:

```sql
-- Por ejemplo, si los constraints fallaron:
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS equipment_price_positive;
ALTER TABLE public.equipment DROP CONSTRAINT IF EXISTS equipment_promo_less_than_price;
```

---

## 📊 IMPACTO ESPERADO

### **Performance**
- ✅ Consultas de catálogo: **5-10x más rápidas**
- ✅ Búsqueda de pedidos: **3-5x más rápida**
- ✅ Filtros por categoría: **10x más rápidos**

### **Funcionalidad**
- ✅ Auditoría completa con `updated_at`
- ✅ Validación automática de datos
- ✅ Reportes y estadísticas sin código adicional
- ✅ Funciones SQL reutilizables

### **Seguridad**
- ✅ Constraints previenen datos inválidos
- ✅ Email único previene duplicados
- ✅ Validación de precios y cantidades

---

## 📝 NOTAS IMPORTANTES

### **Compatibilidad con Código Existente**
- ✅ **NO requiere cambios en el código TypeScript/React**
- ✅ Todas las columnas nuevas tienen valores por defecto
- ✅ Las vistas y funciones son opcionales (no rompen nada si no las usas)

### **Uso de Nuevas Funcionalidades**

#### **Usar vista de productos activos:**
```typescript
// En lugar de:
const { data } = await supabase
  .from('equipment')
  .select('*')
  .or('is_deleted.is.null,is_deleted.eq.false');

// Puedes usar:
const { data } = await supabase
  .from('equipment_active')
  .select('*');
```

#### **Usar función de total de pedido:**
```typescript
const { data } = await supabase
  .rpc('get_order_total', { order_id_param: 'ord-123' });
```

#### **Usar vista de estadísticas:**
```typescript
const { data } = await supabase
  .from('sales_stats')
  .select('*');
```

---

## 🎯 CHECKLIST DE APLICACIÓN

- [ ] ✅ Backup de base de datos creado
- [ ] ✅ Verificado estado actual (sin emails duplicados)
- [ ] ✅ Aplicado script de mejoras
- [ ] ✅ Verificados índices creados
- [ ] ✅ Verificados triggers funcionando
- [ ] ✅ Verificadas funciones creadas
- [ ] ✅ Verificadas vistas creadas
- [ ] ✅ Probada aplicación (npm run dev)
- [ ] ✅ Verificadas funcionalidades clave
- [ ] ✅ Verificado updated_at se actualiza
- [ ] ✅ Documentación actualizada

---

## 🆘 SOPORTE

Si tienes problemas:

1. **Revisa los logs de error** en Supabase Dashboard → Logs
2. **Verifica el estado** de tablas, índices y funciones
3. **Usa el rollback** si es necesario
4. **Restaura desde backup** como último recurso

---

## 📚 RECURSOS

- [Supabase SQL Editor](https://app.supabase.com)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Supabase Database Docs](https://supabase.com/docs/guides/database)

---

**Fecha de creación**: 2025-12-06  
**Versión**: 1.0  
**Estado**: ✅ Listo para aplicar
