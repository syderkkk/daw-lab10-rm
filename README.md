# 🛸 Rick & Morty

Aplicación web que consume la [Rick and Morty API](https://rickandmortyapi.com/) para explorar personajes del multiverso.

## ✨ Características

- **Página principal (SSG)** — Lista de personajes generada estáticamente en build-time con `cache: "force-cache"`.
- **Búsqueda en tiempo real (CSR)** — Filtros por nombre, estado, tipo y género usando `useState` + `useEffect` con debounce.
- **Detalle de personaje (ISR)** — Rutas estáticas para los 826+ personajes revalidadas automáticamente cada 10 días.
- **Lazy Loading** — Carga de imágenes bajo demanda con `next/image`.
- **UI elegante** — Diseño azul-blanco con glassmorphism, animaciones suaves y tipografía Raleway + DM Sans.

## 🏗️ Stack

| Tecnología | Versión | Rol |
|-----------|---------|-----|
| [Next.js](https://nextjs.org/) | 16.x | Framework principal |
| [React](https://react.dev/) | 19.x | UI |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Estilos |
| [React Icons](https://react-icons.github.io/react-icons/) | 5.x | Íconos |
| [Rick and Morty API](https://rickandmortyapi.com/) | — | Fuente de datos |

## 📁 Estructura del proyecto

```
rm-lab-rick-and-morty/
├── app/
│   ├── layout.tsx              # Root layout + navbar
│   ├── page.tsx                # Página principal (SSG)
│   ├── globals.css             # Design system completo
│   ├── character/
│   │   └── [slug]/
│   │       ├── page.tsx        # Detalle de personaje (ISR)
│   │       └── not-found.tsx   # Página 404
│   └── search/
│       └── page.tsx            # Búsqueda en tiempo real (CSR)
├── components/
│   └── CharacterCard.tsx       # Tarjeta reutilizable de personaje
├── lib/
│   └── rickmorty.ts            # Funciones de acceso a la API
└── types/
    └── rickmorty.ts            # Tipos TypeScript de la API
```

## 🚀 Instalación y uso local

### Prerrequisitos

- **Node.js** v18 o superior → [descargar](https://nodejs.org/)
- **npm** v9+ (incluido con Node.js)

### Pasos

1. **Clona el repositorio**

   ```bash
   git clone https://github.com/syderkkk/daw-lab10-rm.git
   cd daw-lab10-rm
   ```

2. **Instala las dependencias**

   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo**

   ```bash
   npm run dev
   ```

4. **Abre el navegador** en [http://localhost:3000](http://localhost:3000)

### Otros comandos

```bash
npm run build   # Genera el build de producción (SSG/ISR pre-renderizado)
npm run start   # Sirve el build de producción en local
npm run lint    # Ejecuta el linter
```

## 📡 API utilizada

| Endpoint | Uso | Estrategia |
|----------|-----|-----------|
| `GET /api/character` | Lista de personajes | SSG (`cache: "force-cache"`) |
| `GET /api/character/:id` | Detalle por ID | ISR (`revalidate: 864000`) |
| `GET /api/character/?name=...&status=...` | Búsqueda con filtros | CSR (fetch en cliente) |

### Justificación de estrategias de renderizado

| Página | Estrategia | Por qué |
|--------|-----------|---------|
| `/` | **SSG** | La lista de personajes es estable. Se genera una sola vez en build-time; no necesita revalidación continua. |
| `/search` | **CSR** | Los filtros cambian en tiempo real según la interacción del usuario. Requiere `useState`/`useEffect`. |
| `/character/[slug]` | **ISR** (10 días) | Los datos de personajes no cambian frecuentemente pero pueden actualizarse. ISR permite revalidación automática sin rebuild. |