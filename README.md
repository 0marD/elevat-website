# ÉLEVA. — Sitio Web

Sitio web oficial de **ÉLEVA Viajes de Autor**, construido con Next.js 15, TypeScript y Tailwind CSS.

---

## Tabla de contenidos

1. [Estructura del proyecto](#estructura-del-proyecto)
2. [Instalación y arranque](#instalación-y-arranque)
3. [Panel de administración](#panel-de-administración)
4. [Estándares de código](#estándares-de-código)
5. [Seguridad](#seguridad)
6. [Arquitectura y escalabilidad](#arquitectura-y-escalabilidad)
7. [Accesibilidad](#accesibilidad)
8. [Deploy en Vercel](#deploy-en-vercel)
9. [Paleta de colores](#paleta-de-colores)
10. [Tipografía](#tipografía)
11. [TODOs pendientes](#todos-pendientes)

---

## Estructura del proyecto

```
eleva-web/
├── app/
│   ├── layout.tsx                   # Layout raíz (navbar + footer)
│   ├── page.tsx                     # Página de inicio
│   ├── globals.css                  # Estilos globales + variables de marca
│   │
│   ├── (public)/                    # Route group — páginas públicas
│   │   ├── cotizacion/
│   │   │   └── page.tsx             # Formulario de cotización (3 pasos)
│   │   ├── destinos/
│   │   │   ├── page.tsx             # Catálogo de destinos
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Detalle de destino
│   │   ├── testimonios/
│   │   │   └── page.tsx             # Testimonios de clientes
│   │   ├── blog/
│   │   │   ├── page.tsx             # Listado de artículos
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Artículo individual
│   │   └── contacto/
│   │       └── page.tsx             # Contacto + FAQ
│   │
│   ├── admin/                       # Panel de administración (protegido)
│   │   ├── layout.tsx               # Layout del admin (sidebar + auth guard)
│   │   ├── page.tsx                 # Dashboard principal
│   │   ├── blog/
│   │   │   ├── page.tsx             # Listado de posts
│   │   │   ├── nuevo/
│   │   │   │   └── page.tsx         # Crear nuevo post
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Editar post existente
│   │   ├── testimonios/
│   │   │   ├── page.tsx             # Listado de testimonios
│   │   │   └── nuevo/
│   │   │       └── page.tsx         # Agregar testimonio
│   │   ├── destinos/
│   │   │   ├── page.tsx             # Listado de destinos
│   │   │   └── nuevo/
│   │   │       └── page.tsx         # Agregar destino
│   │   └── cotizaciones/
│   │       └── page.tsx             # Bandeja de cotizaciones recibidas
│   │
│   ├── api/                         # Route Handlers (API interna)
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts         # NextAuth — autenticación admin
│   │   ├── cotizacion/
│   │   │   └── route.ts             # POST — recibir y notificar cotización
│   │   ├── blog/
│   │   │   ├── route.ts             # GET (listado) / POST (crear)
│   │   │   └── [id]/
│   │   │       └── route.ts         # GET / PUT / DELETE por ID
│   │   ├── testimonios/
│   │   │   ├── route.ts             # GET / POST
│   │   │   └── [id]/
│   │   │       └── route.ts         # GET / PUT / DELETE
│   │   └── destinos/
│   │       ├── route.ts             # GET / POST
│   │       └── [id]/
│   │           └── route.ts         # GET / PUT / DELETE
│   │
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx           # Navbar responsive con scroll effect
│       │   └── Footer.tsx           # Footer con links y contacto
│       ├── ui/                      # Componentes atómicos reutilizables
│       │   ├── Button.tsx           # Botón con variantes (gold, ghost, danger)
│       │   ├── Input.tsx            # Input accesible con label y error state
│       │   ├── Card.tsx             # Card base de la marca
│       │   ├── GoldLine.tsx         # Separador dorado de marca
│       │   └── SectionLabel.tsx     # Etiqueta de sección con tracking
│       ├── forms/
│       │   ├── CotizacionForm.tsx   # Formulario multi-step de cotización
│       │   └── ContactoForm.tsx     # Formulario de contacto rápido
│       └── admin/
│           ├── Sidebar.tsx          # Navegación lateral del admin
│           ├── BlogEditor.tsx       # Editor de posts (Markdown o rich text)
│           ├── TestimonioForm.tsx   # Formulario de testimonio
│           └── DataTable.tsx        # Tabla reutilizable para listados
│
├── lib/                             # Utilidades y lógica de negocio
│   ├── auth.ts                      # Configuración de NextAuth
│   ├── db.ts                        # Cliente de base de datos (Prisma o Supabase)
│   ├── validations/
│   │   ├── cotizacion.ts            # Zod schema — cotización
│   │   ├── blog.ts                  # Zod schema — post de blog
│   │   └── testimonio.ts            # Zod schema — testimonio
│   ├── utils/
│   │   ├── cn.ts                    # Utilidad classnames (clsx + tailwind-merge)
│   │   ├── format.ts                # Formateo de fechas, moneda, etc.
│   │   └── whatsapp.ts              # Generador de links de WhatsApp
│   └── constants/
│       ├── brand.ts                 # Colores, tipografías y tokens de marca
│       └── routes.ts                # Rutas de la app como constantes tipadas
│
├── types/                           # Tipos e interfaces globales
│   ├── blog.ts
│   ├── testimonio.ts
│   ├── destino.ts
│   └── cotizacion.ts
│
├── hooks/                           # Custom React hooks
│   ├── useScrolled.ts               # Detectar scroll para navbar
│   └── useToast.ts                  # Notificaciones temporales
│
├── public/
│   ├── logo/                        # SVGs del logo en todas sus variantes
│   └── fonts/                       # Fuentes locales (si aplica)
│
├── .env.example                     # Variables de entorno (sin valores reales)
├── tailwind.config.js               # Colores y tipografías de marca
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Instalación y arranque

```bash
# 1. Instalar dependencias
yarn install

# 2. Copiar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus valores reales

# 3. Correr en desarrollo
yarn dev

# 4. Abrir en el navegador
http://localhost:3000

# 5. Panel de administración
http://localhost:3000/admin
```

---

## Panel de administración

El admin es una sección protegida con autenticación (NextAuth) accesible en `/admin`.

### Credenciales de acceso

Configura en `.env.local`:

```env
ADMIN_EMAIL=tu@correo.com
ADMIN_PASSWORD=contraseña_segura_aqui
NEXTAUTH_SECRET=genera_con_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000
```

### Funcionalidades del admin

**Blog**
- Crear, editar y eliminar artículos
- Editor con soporte Markdown
- Subir imagen de portada
- Publicar / guardar como borrador
- Previsualización antes de publicar

**Testimonios**
- Agregar testimonios con nombre, ciudad, viaje y texto
- Activar / desactivar visibilidad sin eliminar
- Reordenar por drag & drop

**Destinos**
- Agregar nuevos destinos con imagen, descripción y etiquetas
- Activar / desactivar destinos del catálogo

**Cotizaciones**
- Ver bandeja de cotizaciones recibidas
- Marcar como atendida / pendiente
- Exportar a CSV

### Agregar un testimonio (flujo rápido)

```
1. Ir a /admin/testimonios/nuevo
2. Completar: nombre, ciudad, tipo de viaje y texto
3. Click en "Publicar"
4. Aparece automáticamente en /testimonios
```

### Agregar un post de blog (flujo rápido)

```
1. Ir a /admin/blog/nuevo
2. Escribir título, extracto y contenido en Markdown
3. Subir imagen de portada
4. Elegir categoría
5. Click en "Publicar" o "Guardar borrador"
6. Aparece automáticamente en /blog
```

---

## Estándares de código

Todo el código de este proyecto debe cumplir los siguientes lineamientos. Al trabajar con Claude Code, incluye estas instrucciones en tu `CLAUDE.md` para que se apliquen automáticamente en cada sesión.

### Clean Code

- **Nombres descriptivos:** Variables, funciones y componentes deben comunicar su intención sin necesitar un comentario. `getUserByEmail` no `getU`. `isFormValid` no `valid`.
- **Funciones pequeñas y de una sola responsabilidad:** Si una función hace más de una cosa, divídela. Límite sugerido: 20–30 líneas por función.
- **Sin números mágicos:** Usar constantes nombradas. `MAX_COTIZACION_STEPS = 3` no `if (step === 3)`.
- **Comentarios solo cuando agregan valor:** El código debe documentarse a sí mismo. Evitar comentarios obvios. Comentar solo el "por qué", nunca el "qué".
- **Sin código muerto:** No dejar `console.log`, variables sin usar ni funciones comentadas en producción.
- **DRY (Don't Repeat Yourself):** Si copias y pegas más de dos veces, abstrae en una función o componente.

```typescript
// ❌ Incorrecto
const x = data.filter(i => i.a === true).map(i => i.b)

// ✅ Correcto
const activeItemNames = items
  .filter((item) => item.isActive)
  .map((item) => item.name)
```

### Convenciones de nomenclatura

| Elemento            | Convención         | Ejemplo                          |
|---------------------|--------------------|----------------------------------|
| Componentes React   | PascalCase         | `TestimonioCard.tsx`             |
| Hooks               | camelCase + use    | `useScrolled.ts`                 |
| Funciones y vars    | camelCase          | `fetchBlogPosts()`               |
| Constantes globales | UPPER_SNAKE_CASE   | `MAX_FILE_SIZE_MB`               |
| Tipos / Interfaces  | PascalCase         | `interface BlogPost`             |
| Archivos de página  | lowercase          | `page.tsx`, `layout.tsx`         |
| Archivos de utilidad| camelCase          | `formatDate.ts`                  |
| Variables CSS       | kebab-case         | `--color-dorado`                 |

### TypeScript

- **Nunca usar `any`.** Si desconoces el tipo, usa `unknown` y haz narrowing explícito.
- **Tipado estricto activado** en `tsconfig.json`: `"strict": true`.
- **Interfaces para objetos de dominio**, types para uniones y utilidades.
- **Props de componentes siempre tipadas** con interfaz nombrada, no inline.

```typescript
// ❌ Incorrecto
const BlogCard = ({ post }: any) => { ... }

// ✅ Correcto
interface BlogCardProps {
  post: BlogPost
  className?: string
}
const BlogCard = ({ post, className }: BlogCardProps) => { ... }
```

### Estructura de componentes React

Orden estándar dentro de cada componente:

```typescript
// 1. Imports externos
// 2. Imports internos
// 3. Tipos / interfaces
// 4. Constantes del componente
// 5. El componente (con hooks primero, luego handlers, luego return)
// 6. Export default
```

---

## Seguridad

### Variables de entorno

- **Nunca** subir `.env.local` al repositorio. Está en `.gitignore`.
- Usar `.env.example` con las claves pero sin valores para documentar qué se necesita.
- En Vercel, configurar todas las variables en el dashboard bajo Settings → Environment Variables.
- Variables que empiezan con `NEXT_PUBLIC_` son visibles en el cliente — nunca poner secretos ahí.

```env
# .env.example — copiar como .env.local y completar

# Base de datos
DATABASE_URL=

# Autenticación admin
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Email (Resend)
RESEND_API_KEY=

# WhatsApp número de destino
NEXT_PUBLIC_WHATSAPP_NUMBER=523337084290

# Almacenamiento de imágenes (Cloudinary o Supabase Storage)
CLOUDINARY_URL=
```

### Validación de inputs

- **Todo input del usuario debe validarse** con [Zod](https://zod.dev) tanto en cliente como en servidor.
- Los Route Handlers (`/api/*`) deben validar el body antes de procesarlo.
- Nunca confiar en datos que vienen del cliente para operaciones de base de datos.

```typescript
// lib/validations/testimonio.ts
import { z } from 'zod'

export const TestimonioSchema = z.object({
  nombre: z.string().min(2).max(80),
  ciudad: z.string().min(2).max(60),
  viaje: z.string().min(2).max(120),
  texto: z.string().min(20).max(800),
  calificacion: z.number().int().min(1).max(5),
})

export type TestimonioInput = z.infer<typeof TestimonioSchema>
```

### Autenticación del admin

- El panel `/admin` usa **NextAuth.js** con proveedor Credentials.
- Middleware de Next.js protege todas las rutas bajo `/admin` y `/api/admin/*`.
- Las contraseñas se hashean con `bcrypt` antes de almacenarse.
- Sesiones con JWT firmados con `NEXTAUTH_SECRET`.

```typescript
// middleware.ts — en la raíz del proyecto
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: { signIn: '/admin/login' },
})

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
```

### Headers de seguridad

Configurar en `next.config.js`:

```javascript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

### Protección contra ataques comunes

- **CSRF:** NextAuth maneja protección CSRF automáticamente en formularios de auth.
- **XSS:** No usar `dangerouslySetInnerHTML` a menos que sea imprescindible. Si se usa, sanitizar con DOMPurify.
- **Inyección:** Usar Prisma ORM o queries parametrizadas, nunca interpolación de strings en SQL.
- **Rate limiting:** Implementar en los endpoints de cotización y contacto con `@upstash/ratelimit`.

---

## Arquitectura y escalabilidad

### Principios generales

- **Separación de responsabilidades:** La UI no hace llamadas directas a la base de datos. Toda la lógica de datos va en `lib/` y los Route Handlers.
- **Componentes presentacionales vs. contenedores:** Los componentes de UI reciben props y no saben de dónde vienen los datos.
- **Colocación de código:** Si un tipo, constante o componente solo lo usa un módulo, vive junto a él. Si lo usan dos o más, sube a la carpeta compartida.

### Patrón de datos recomendado

```
Página (Server Component)
  → llama a función de lib/db.ts o fetch a API
  → pasa datos como props a componentes cliente
    → componente cliente maneja interactividad local
```

### Componentes reutilizables

Todos los componentes de `components/ui/` deben:

- Aceptar `className?: string` para extensión desde fuera
- Ser agnósticos al contenido (no hardcodear textos)
- Tener variantes definidas como objetos de configuración, no con ternarios anidados
- Exportar sus tipos de props para que otros componentes puedan extenderlos

```typescript
// ✅ Patrón correcto para componente reutilizable
const buttonVariants = {
  gold: 'border border-dorado text-dorado hover:bg-dorado hover:text-negro',
  ghost: 'border border-crema/20 text-crema/70 hover:border-crema/60',
  danger: 'border border-red-500/50 text-red-400 hover:bg-red-500/10',
} as const

type ButtonVariant = keyof typeof buttonVariants

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}
```

### Gestión de estado

- **Estado local** (un componente): `useState`
- **Estado compartido** (varios componentes relacionados): `useContext` + `useReducer`
- **Estado global del servidor** (datos de API): React Query / SWR
- **Estado del formulario**: React Hook Form + Zod

### Base de datos recomendada

Para este proyecto se recomienda **Supabase** (PostgreSQL + Storage + Auth gratuito):

- Tablas: `blog_posts`, `testimonios`, `destinos`, `cotizaciones`
- Storage bucket: `imagenes` para fotos de destinos y posts
- Row Level Security (RLS) activado en todas las tablas

---

## Accesibilidad

Todo el código debe cumplir con las pautas **WCAG 2.1 nivel AA**.

### Reglas obligatorias

**Semántica HTML**
- Usar elementos HTML semánticos: `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>`, `<aside>`.
- Un solo `<h1>` por página. Jerarquía de headings lógica y sin saltar niveles.
- Los botones (`<button>`) son para acciones. Los enlaces (`<a>`) son para navegación. Nunca intercambiar.

**Imágenes**
- Todas las imágenes deben tener `alt` descriptivo. Si es decorativa, `alt=""`.
- Usar `next/image` siempre para optimización automática.

**Formularios**
- Todo `<input>` debe tener un `<label>` asociado con `htmlFor` / `id`.
- Los errores de validación deben comunicarse con `aria-describedby` y `role="alert"`.
- Los campos requeridos deben marcarse con `aria-required="true"`.

```typescript
// ✅ Input accesible
<div>
  <label htmlFor="email" className="section-label">
    Correo electrónico
    <span aria-hidden="true" className="text-dorado ml-1">*</span>
  </label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-describedby={error ? 'email-error' : undefined}
    aria-invalid={!!error}
  />
  {error && (
    <p id="email-error" role="alert" className="text-red-400 text-xs mt-1">
      {error}
    </p>
  )}
</div>
```

**Navegación por teclado**
- Todos los elementos interactivos deben ser accesibles con Tab.
- El foco debe ser visible — nunca `outline: none` sin reemplazar con estilo de foco propio.
- Los modales y menús móviles deben atrapar el foco mientras están abiertos (`focus-trap`).

**Contraste de color**
- Texto normal sobre fondo: mínimo 4.5:1
- Texto grande (+18px o +14px bold): mínimo 3:1
- La combinación Crema (`#F5F0E8`) sobre Negro (`#0A0A0A`) cumple con ratio ~18:1 ✅
- El Dorado (`#C9A84C`) sobre Negro cumple con ratio ~7:1 ✅

**Reducción de movimiento**
- Respetar la preferencia del usuario con `@media (prefers-reduced-motion: reduce)`.
- Las animaciones de Framer Motion deben verificar esta preferencia.

```typescript
// hooks/useReducedMotion.ts
import { useReducedMotion } from 'framer-motion'

// Usar en componentes con animaciones
const shouldReduceMotion = useReducedMotion()
const variants = shouldReduceMotion ? {} : animationVariants
```

**Internacionalización básica**
- El tag `<html>` siempre con `lang="es"`.
- Las fechas y monedas deben formatearse con `Intl.DateTimeFormat` y `Intl.NumberFormat`.

---

## Deploy en Vercel

```bash
# Instalar Vercel CLI
yarn global add vercel

# Deploy (primera vez — te guía interactivamente)
vercel

# Deploy a producción
vercel --prod
```

### Variables de entorno en Vercel

```bash
# Agregar variable individual
vercel env add RESEND_API_KEY

# O configurarlas desde el dashboard:
# vercel.com → tu proyecto → Settings → Environment Variables
```

### Dominio personalizado

```bash
# Agregar dominio
vercel domains add elevaviajes.mx

# Seguir instrucciones para configurar DNS en tu registrador
```

---

## Paleta de colores

| Variable          | Hex       | Uso                           |
|-------------------|-----------|-------------------------------|
| `negro`           | `#0A0A0A` | Fondo principal               |
| `dorado`          | `#C9A84C` | Acentos, CTA, íconos          |
| `dorado-claro`    | `#E8C97A` | Hover states                  |
| `dorado-oscuro`   | `#8B6914` | Textos sobre fondos claros    |
| `vino`            | `#5C1A2E` | Fondos secundarios especiales |
| `crema`           | `#F5F0E8` | Texto principal               |
| `plata`           | `#8A8A8A` | Texto secundario              |

---

## Tipografía

- **Display / Títulos:** Cormorant Garamond Light 300 (Google Fonts)
- **Cuerpo / UI:** Montserrat Light 300 & Regular 400 (Google Fonts)

---

## TODOs pendientes

### Funcionalidad core
- [ ] Conectar formulario de cotización a Resend (email) + notificación WhatsApp
- [ ] Implementar base de datos Supabase con tablas: `blog_posts`, `testimonios`, `destinos`, `cotizaciones`
- [ ] Construir panel de administración `/admin` con NextAuth
- [ ] Crear páginas individuales `/destinos/[slug]` y `/blog/[slug]`
- [ ] Implementar filtros interactivos en `/destinos` y `/blog`

### Mejoras de UI/UX
- [ ] Agregar animaciones de entrada con Framer Motion (respetando `prefers-reduced-motion`)
- [ ] Skeleton loaders para contenido que carga desde la base de datos
- [ ] Toast notifications para feedback de formularios
- [ ] Imagen de Open Graph personalizada para cada página

### Infraestructura
- [ ] Configurar dominio `elevaviajes.mx` en Vercel
- [ ] Implementar rate limiting en endpoints de cotización y contacto
- [ ] Configurar headers de seguridad en `next.config.js`
- [ ] Agregar `robots.txt` y `sitemap.xml` generados automáticamente
- [ ] Implementar formulario de newsletter con Resend Audiences

### Calidad de código
- [ ] Configurar ESLint con reglas de accesibilidad (`eslint-plugin-jsx-a11y`)
- [ ] Agregar Prettier para formato consistente
- [ ] Escribir tests de los componentes críticos (formulario de cotización) con Vitest
- [ ] Configurar Husky + lint-staged para validar antes de cada commit

---

## CLAUDE.md — Instrucciones para Claude Code

Crea un archivo `CLAUDE.md` en la raíz del proyecto con este contenido para que Claude Code siga los estándares automáticamente en cada sesión:

```markdown
# Instrucciones para Claude Code — ÉLEVA

## Stack
Next.js 15 · TypeScript strict · Tailwind CSS · Yarn

## Reglas obligatorias

1. **TypeScript estricto:** Nunca usar `any`. Tipar todas las props con interfaces nombradas.
2. **Clean code:** Funciones de una sola responsabilidad. Nombres descriptivos. Sin código muerto.
3. **Accesibilidad:** Todos los inputs con label asociado. Imágenes con alt. Botones con aria-label si no tienen texto visible.
4. **Seguridad:** Validar inputs con Zod. Variables sensibles solo en .env.local. Nunca exponer secretos en NEXT_PUBLIC_.
5. **Componentes reutilizables:** Usar los componentes de components/ui/. Si algo se repite, abstraer.
6. **Tailwind:** Usar variables de marca definidas en tailwind.config.js. No hardcodear colores hex en className.
7. **Convenciones:** PascalCase para componentes, camelCase para funciones, UPPER_SNAKE_CASE para constantes globales.
8. **Yarn:** Siempre usar yarn, nunca npm.

## Número de WhatsApp
523337084290 (formato internacional sin + ni espacios)
```

---

## Contacto del proyecto

- **WhatsApp:** +52 33 3708 4290
- **Email:** hola@elevaviajes.mx
- **Instagram:** @elevaviajes
- **Web:** elevaviajes.mx
# elevat-website
