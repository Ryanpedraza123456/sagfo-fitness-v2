# 🏋️ SAGFO Fitness Catalog

Catálogo de equipamiento de gimnasio con gestión de pedidos, galería de imágenes y sistema de administración.

## 🚀 Características

- ✅ **Catálogo de Productos** - Maquinaria y accesorios de gimnasio
- ✅ **Sistema de Pedidos** - Gestión completa de cotizaciones y pedidos
- ✅ **Panel de Administración** - Gestión de productos, pedidos y usuarios
- ✅ **Galería de Imágenes** - Showcase del gimnasio
- ✅ **Eventos** - Gestión de eventos y promociones
- ✅ **Modo Oscuro** - Interfaz adaptable
- ✅ **Responsive** - Diseño adaptado a móviles y tablets

## 🛠️ Tecnologías

### Frontend
- **React 19** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos (via vanilla CSS)

### Backend & Storage
- **Supabase** - Base de datos PostgreSQL
- **Vercel Blob** - Almacenamiento de imágenes
- **Vercel** - Hosting y deployment

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Vercel (para Blob Storage)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Ryanpedraza123456/SAGFO.git
cd sagfo-fitness-catalog
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
VITE_BLOB_READ_WRITE_TOKEN=tu_vercel_blob_token
```

4. **Configurar base de datos**

Ejecuta los scripts SQL en Supabase en este orden:

```sql
-- 1. Crear tablas (si no existen)
-- Ver: supabase/schema.sql

-- 2. Aplicar mejoras
-- Ver: supabase/APLICAR_MEJORAS_AHORA.sql
```

5. **Iniciar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
sagfo-fitness-catalog/
├── components/          # Componentes React
│   ├── Header.tsx
│   ├── ProductGrid.tsx
│   ├── AdminDashboard.tsx
│   └── ...
├── lib/                # Utilidades
│   ├── supabase.ts     # Cliente de Supabase
│   └── vercel-blob.ts  # Utilidades de Vercel Blob
├── supabase/           # Scripts SQL
│   ├── APLICAR_MEJORAS_AHORA.sql
│   ├── VERIFICACION_COMPLETA.sql
│   └── migrations/
├── types.ts            # Tipos TypeScript
├── App.tsx             # Componente principal
└── index.tsx           # Punto de entrada
```

## 📊 Base de Datos

### Tablas Principales

- **equipment** - Productos del catálogo
- **orders** - Pedidos de clientes
- **order_items** - Items de cada pedido
- **users** - Usuarios del sistema
- **events** - Eventos y promociones
- **gallery** - Galería de imágenes
- **site_config** - Configuración del sitio

### Mejoras Aplicadas

- ✅ **Índices** - 18+ índices para mejor performance
- ✅ **Triggers** - Actualización automática de `updated_at`
- ✅ **Constraints** - Validación de datos a nivel de BD
- ✅ **Funciones** - Funciones SQL reutilizables
- ✅ **Vistas** - Vistas para reportes y estadísticas

## 🖼️ Almacenamiento de Imágenes

### Vercel Blob (Nuevo)
Todas las **nuevas imágenes** se suben a Vercel Blob:
- Productos → `products/`
- Galería → `gallery/`
- Eventos → `events/`

### Supabase Storage (Antiguo)
Las imágenes antiguas permanecen en Supabase Storage y seguirán funcionando.

## 🔐 Roles de Usuario

- **Admin** - Acceso completo al sistema
- **Customer** - Ver catálogo y hacer pedidos
- **Transporter** - Gestionar entregas

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conectar repositorio a Vercel**
2. **Configurar variables de entorno** en Vercel Dashboard
3. **Deploy automático** con cada push a main

### Variables de Entorno en Vercel

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_BLOB_READ_WRITE_TOKEN=...
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🧪 Verificación

### Verificar mejoras de base de datos
```sql
-- En Supabase SQL Editor
-- Ejecutar: supabase/VERIFICACION_COMPLETA.sql
```

### Verificar ubicación de imágenes
```sql
-- En Supabase SQL Editor
-- Ejecutar: supabase/VERIFICAR_IMAGENES.sql
```

## 📚 Documentación Adicional

- [Migración a Vercel Blob](./MIGRACION_VERCEL_BLOB.md)
- [Mejoras de Schema](./supabase/MEJORAS_SCHEMA.md)
- [Guía de Aplicación](./supabase/GUIA_APLICACION.md)
- [Checklist Final](./CHECKLIST_FINAL.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y pertenece a SAGFO Fitness.

## 👥 Autores

- **Ryan Pedraza** - Desarrollo principal

## 🙏 Agradecimientos

- Supabase por la infraestructura de base de datos
- Vercel por el hosting y Blob Storage
- React y Vite por las herramientas de desarrollo

---

**Versión:** 2.0  
**Última actualización:** Diciembre 2025
