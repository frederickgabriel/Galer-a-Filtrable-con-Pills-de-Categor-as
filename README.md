# Playa Mujeres – Filterable Gallery

Galería de imágenes con filtros dinámicos por categorías mediante pills (botones), sin recarga de página.

## Descripción del Proyecto
 
Galería responsiva con:
- **Grid de imágenes en columnas** adaptable a cualquier pantalla.
- **Sistema de filtros por pills**: Rooms, Swimming Pools, Restaurants, Beaches, Spas, Golf, Experiences, Meeting And Event Rooms.
- **Carga AJAX genuina** — los datos se obtienen desde `data/gallery_images.json` vía `fetch()`.
- **Lightbox/modal** al hacer clic en cada imagen, con navegación con flechas y teclado.
- **Efecto hover** en cada tarjeta con zoom en imagen y overlay con ícono de zoom.
- **Botón "Clear filter"** para restablecer la vista completa.
- Soporte completo de **teclado y accesibilidad** (ARIA roles, focus trap básico).
---

## Instalación y Configuración

### Extensión VS Code
 
Instala **Live Server** en VS Code y haz clic derecho → *Open with Live Server* sobre `index.html`.
En mi caso yo instale esta extension en mi entorno de desarrollo para poder visualizar nuetra pagina web aun 
que hay muchas maneras de hacerlo pero yo opte por esta opcion.

## Stack Tecnológico
 
| Capa | Tecnología |
|------|-----------|
| Markup | HTML5 semántico |
| Estilos | CSS3 — Custom Properties, CSS Columns (masonry), Flexbox, animaciones |
| Scripts | JavaScript ES6+ (Módulo IIFE, `async/await`, `fetch` API) |
| Fuentes | **Agenda** (Adobe Typekit `jky6aby`) → fallback **Poppins** (Google Fonts) |
| Datos | JSON estático (`Data/gallery_images.json`) — reemplazable por cualquier API REST |

## 📦 Datos (`gallery_images.json`)
 
Cada imagen sigue este esquema:
 
```json
{
  "id": 1,
  "title": "Excellence Playa Mujeres - Beach View",
  "category": "Beaches",
  "hotel": "Excellence Playa Mujeres",
  "image": "https://...",        ← URL imagen original (lightbox)
  "thumbnail": "https://...",    ← URL miniatura (grid)
  "description": "..."
}
```

**Categorías válidas:** `Rooms`, `Swimming Pools`, `Restaurants`, `Beaches`, `Spas`, `Golf`, `Experiences`, `Meeting And Event Rooms`

## Decisiones de Diseño
 
- **Paleta**: Marfil (`#faf8f4`) + dorado (`#b49a5e`) + carbón (`#2b2b2b`), fiel al branding de Playa Mujeres.
- **Tipografía**: `agenda` (Typekit) para títulos con `font-style: italic; font-weight: 300` — elegante y ligero.
- **Grid**: `columns` CSS (masonry nativo) para variedad visual sin JavaScript extra.
- **AJAX**: `fetch()` nativo — sin jQuery ni librerías externas. El filtrado ocurre en memoria tras la carga inicial.
- **Lightbox**: Implementación propia sin dependencias, con transición de opacidad y escala en cambio de imagen.

## Enlace del proyecto corriendo en Github page
https://frederickgabriel.github.io/Galer-a-Filtrable-con-Pills-de-Categor-as/

Algunas imagenes no se pudieron cargar tal parece que estan caidas al momento de seguir el vinculo no se encuentran y sale un erro 404 
