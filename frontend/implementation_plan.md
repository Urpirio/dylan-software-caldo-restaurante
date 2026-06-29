# Planificación: Gestión de Categorías y Subcategorías desde el CMS

Este plan de implementación añade un módulo completo de mantenimiento (CRUD) para las **Categorías** (Supercategorías) y **Subcategorías** en el administrador (CMS). Los platos se asociarán a estas de manera dinámica, y el menú público renderizará su estructura a partir de lo configurado en el CMS.

---

## User Review Required

> [!IMPORTANT]
> **Estructura de Datos Dinámica:** Crearemos dos nuevas entidades en la base de datos local: `SuperCategory` (ej: Alimentos, Bebidas) y `SubCategory` (ej: Caldos, Segundos, Refrescos).
>
> **Mantenimiento en el CMS:** El panel `/admin` incluirá pestañas para gestionar estas entidades. Si agregas, editas o eliminas una categoría o subcategoría en el CMS, el menú público actualizará automáticamente sus pestañas y opciones de filtrado.

---

## Proposed Changes

### Componente: Modelos de Datos y Cliente API

#### [MODIFY] [api.ts](file:///home/urpiriojunior/githud/dylan-software-caldo-restaurante/frontend/lib/api.ts)
Definiremos los nuevos tipos y funciones CRUD:

1. **Modelos:**
   ```typescript
   export interface SuperCategory {
     id: string;
     name: string;
     icon: string;
   }

   export interface SubCategory {
     id: string;
     name: string;
     icon: string;
     superCategoryId: string;
   }

   export interface MenuItem {
     id: string;
     name: string;
     description: string;
     superCategoryId: string; // Relación con SuperCategory
     subCategoryId: string;   // Relación con SubCategory
     image: string;
     available: boolean;
     spicyLevel?: 0 | 1 | 2 | 3;
   }
   ```

2. **Funciones del Cliente API:**
   - Métodos CRUD para `SuperCategory` (`getSuperCategories()`, `createSuperCategory()`, `updateSuperCategory()`, `deleteSuperCategory()`).
   - Métodos CRUD para `SubCategory` (`getSubCategories()`, `createSubCategory()`, `updateSubCategory()`, `deleteSubCategory()`).
   - Actualización del CRUD de `MenuItem` para relacionar `superCategoryId` y `subCategoryId`.
   - Reinicio de datos con mock data para Categorías, Subcategorías y Platos.
   - Evento global de sincronización: `caldo_menu_updated`.

---

### Componente: Menú Público (Cliente)

#### [MODIFY] [page.tsx](file:///home/urpiriojunior/githud/dylan-software-caldo-restaurante/frontend/app/page.tsx)
- Cargar de forma dinámica las supercategorías y subcategorías desde la API.
- Renderizar los botones de supercategorías superiores (ej: Alimentos, Bebidas) usando el listado dinámico.
- Mostrar las subcategorías en pestañas filtradas por la supercategoría seleccionada.
- Filtrar la grilla de platos en base a la jerarquía seleccionada.

---

### Componente: CMS de Administración

#### [MODIFY] [admin/page.tsx](file:///home/urpiriojunior/githud/dylan-software-caldo-restaurante/frontend/app/admin/page.tsx)
Crearemos una interfaz administrativa por pestañas:
1. **Pestaña "Platos":**
   - Tabla de platos y formulario de creación/edición.
   - Los dropdowns de *Categoría* y *Subcategoría* se cargarán dinámicamente con los datos de las otras pestañas. El dropdown de subcategoría filtrará las opciones según la categoría superior elegida.
2. **Pestaña "Categorías & Subcategorías":**
   - Listado de Categorías Principales con opciones de Crear, Editar y Eliminar.
   - Listado de Subcategorías Principales (asociadas a una Categoría Principal) con opciones de Crear, Editar y Eliminar.
   - Formularios modales o inline para agregar/editar categorías (Campos: Nombre, Icono Emoji) y subcategorías (Campos: Nombre, Icono Emoji, Categoría Padre).

---

## Verification Plan

### Automated Tests
- Ejecutar `npm run build` en el frontend para asegurar la compilación de TypeScript.
- Validar las reglas de ESLint ejecutando `npm run lint`.

### Manual Verification
- **Prueba de Creación de Categorías:** En `/admin`, crear la categoría "Promociones" con un icono 🏷️. Luego crear la subcategoría "Combos" bajo "Promociones". Crear un plato y asociarlo a esta nueva combinación.
- **Verificación en Menú:** Ir a la página principal `/`, verificar que aparezca la pestaña "Promociones", hacer clic en ella, verificar que aparezca la subcategoría "Combos" y el plato creado.
