# ÉLEVA. — Sitio Web

Sitio web oficial de **ÉLEVA Viajes de Autor**, construido con Next.js, TypeScript estricto y Tailwind CSS.

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Instalación y arranque](#instalación-y-arranque)
4. [Variables de entorno](#variables-de-entorno)
5. [Base de datos](#base-de-datos)
6. [Panel de administración](#panel-de-administración)
7. [PWA y notificaciones push](#pwa-y-notificaciones-push)
8. [SEO](#seo)
9. [Tests](#tests)
10. [Deploy en Vercel](#deploy-en-vercel)
11. [Paleta de colores](#paleta-de-colores)
12. [Tipografía](#tipografía)

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Lenguaje | TypeScript `strict: true` |
| Estilos | Tailwind CSS 3 + clsx + tailwind-merge |
| Base de datos | PostgreSQL (Supabase) vía Prisma 7 |
| Auth | NextAuth v4 — Credentials provider, JWT |
| Validación | Zod v4 |
| Email | Resend |
| Animaciones | Framer Motion |
| PWA | @ducanh2912/next-pwa |
| Push notifications | web-push (VAPID) |
| Tests | Vitest + Testing Library |
| Gestor de paquetes | Yarn |

---

## Estructura del proyecto

```
elevate/
├── app/
│   ├── layout.tsx                    # Layout raíz (html + body + SessionProvider)
│   ├── globals.css                   # Variables CSS globales
│   ├── sitemap.ts                    # Sitemap dinámico
│   │
│   ├── (public)/                     # Route group — páginas públicas con Navbar + Footer
│   │   ├── layout.tsx                # Navbar + Footer + PWAInstallModal + PushNotificationBanner
│   │   ├── page.tsx                  # Home /
│   │   ├── blog/
│   │   │   ├── page.tsx              # Listado con filtro por categoría (client)
│   │   │   └── [slug]/page.tsx       # Artículo completo (Markdown)
│   │   ├── destinos/
│   │   │   ├── page.tsx              # Catálogo con filtros
│   │   │   └── [slug]/page.tsx       # Detalle de destino
│   │   ├── testimonios/page.tsx      # Testimonios de clientes
│   │   ├── cotizacion/page.tsx       # Formulario multi-step (3 pasos) con draft en localStorage
│   │   └── contacto/page.tsx         # Contacto + FAQ con JSON-LD
│   │
│   ├── admin/                        # Panel protegido — requiere sesión
│   │   ├── login/page.tsx            # Login standalone
│   │   └── (panel)/                  # Route group con Sidebar
│   │       ├── layout.tsx
│   │       ├── page.tsx              # Dashboard con stats en tiempo real
│   │       ├── blog/
│   │       │   ├── page.tsx          # Tabla de posts
│   │       │   ├── nuevo/page.tsx    # Crear post
│   │       │   └── [id]/page.tsx     # Editar post
│   │       ├── destinos/
│   │       │   ├── page.tsx          # Tabla de destinos
│   │       │   └── nuevo/page.tsx    # Crear destino
│   │       ├── testimonios/
│   │       │   ├── page.tsx          # Tabla de testimonios
│   │       │   └── nuevo/page.tsx    # Crear testimonio
│   │       └── cotizaciones/page.tsx # Bandeja de cotizaciones
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/       # NextAuth
│   │   ├── blog/                     # GET, POST / GET, PUT, DELETE [id]
│   │   ├── destinos/                 # GET, POST / GET, PUT, DELETE [id]
│   │   ├── testimonios/              # GET, POST / GET, PUT, DELETE [id]
│   │   ├── cotizacion/               # POST / PATCH, DELETE [id]
│   │   └── push/
│   │       └── subscribe/            # POST (suscribir), DELETE (desuscribir)
│   │
│   └── components/
│       ├── layout/
│       │   ├── Navbar.tsx
│       │   └── Footer.tsx
│       ├── ui/                       # Componentes atómicos reutilizables
│       │   ├── Button.tsx            # Variantes: gold, ghost, danger
│       │   ├── Input.tsx
│       │   ├── Textarea.tsx
│       │   ├── Card.tsx
│       │   ├── GoldLine.tsx
│       │   ├── SectionLabel.tsx
│       │   ├── PWAInstallModal.tsx   # Prompt de instalación PWA
│       │   └── PushNotificationBanner.tsx  # Banner de suscripción a push
│       ├── seo/
│       │   └── JsonLd.tsx            # JSON-LD genérico (TravelAgency, Article, FAQPage)
│       └── admin/
│           ├── Sidebar.tsx
│           ├── BlogTable.tsx + BlogForm.tsx
│           ├── DestinosTable.tsx + DestinoForm.tsx
│           ├── TestimoniosTable.tsx + TestimonioForm.tsx
│           ├── CotizacionesTable.tsx
│           └── BlogFilterGrid.tsx
│
├── lib/
│   ├── auth.ts                       # NextAuthOptions
│   ├── db.ts                         # Singleton Prisma con @prisma/adapter-pg
│   ├── data/
│   │   ├── blog-store.ts             # CRUD BlogPost (Prisma)
│   │   ├── destinos-store.ts         # CRUD Destino (Prisma)
│   │   ├── testimonios-store.ts      # CRUD Testimonio (Prisma)
│   │   ├── cotizaciones-store.ts     # CRUD Cotizacion (Prisma)
│   │   └── push-store.ts             # CRUD PushSubscription (Prisma)
│   ├── push/
│   │   └── send.ts                   # sendPushToAll() — envío VAPID
│   ├── email/
│   │   └── cotizacion-template.ts    # HTML email para Resend
│   ├── validations/
│   │   ├── blog.ts
│   │   ├── destino.ts
│   │   ├── testimonio.ts
│   │   ├── cotizacion.ts
│   │   └── contacto.ts
│   ├── utils/
│   │   ├── cn.ts                     # clsx + tailwind-merge
│   │   ├── format.ts                 # readingTime(), formatDate()
│   │   └── slugify.ts
│   └── constants/
│       └── routes.ts                 # ROUTES tipadas
│
├── types/
│   ├── blog.ts                       # BlogPost, BlogPostSerialized
│   ├── destino.ts                    # Destino, DestinoSerialized
│   ├── testimonio.ts                 # Testimonio, TestimonioSerialized
│   ├── cotizacion.ts                 # Cotizacion, CotizacionSerialized
│   └── next-auth.d.ts                # Augment Session
│
├── hooks/
│   └── useLocalStorage.ts            # Hook genérico SSR-safe
│
├── worker/
│   └── index.ts                      # Service worker: push events + notificationclick
│
├── prisma/
│   ├── schema.prisma                 # Modelos: BlogPost, Destino, Testimonio, Cotizacion, PushSubscription
│   ├── seed.ts                       # Seed inicial de datos
│   └── prisma.config.ts              # Config Prisma 7 (datasource url)
│
├── public/
│   ├── manifest.json                 # Web App Manifest
│   ├── icons/                        # icon-192.svg, icon-512.svg
│   ├── robots.txt
│   └── llms.txt                      # Descripción para crawlers de IA
│
├── tests/
│   ├── api/                          # Tests de Route Handlers
│   ├── data/                         # Tests de stores
│   ├── components/                   # Tests de componentes
│   ├── validations/                  # Tests de schemas Zod
│   └── utils/                        # Tests de utilidades
│
├── middleware.ts                     # Protege /admin/:path*, permite /admin/login
├── .env.example
├── next.config.js                    # PWA + CSP headers
├── tailwind.config.js                # Tokens de marca
├── tsconfig.json
└── vitest.config.ts
```

---

## Instalación y arranque

```bash
# 1. Instalar dependencias
yarn install

# 2. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus valores (ver sección Variables de entorno)

# 3. Generar claves VAPID para push notifications
yarn generate-vapid
# Copia los valores en .env.local

# 4. Crear tablas en la base de datos
yarn db:push

# 5. (Opcional) Cargar datos de ejemplo
yarn db:seed

# 6. Arrancar en desarrollo
yarn dev
```

> En desarrollo el service worker está desactivado (`disable: process.env.NODE_ENV === 'development'`). Para probar la PWA y las push notifications, usar el build de producción.

---

## Variables de entorno

```env
# Base de datos (Supabase PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?pgbouncer=true
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Autenticación admin
NEXTAUTH_SECRET=          # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM=              # opcional, default: onboarding@resend.dev

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=523337084290

# Push Notifications (VAPID)
# Generar con: yarn generate-vapid
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@eleva.mx
```

---

## Base de datos

El proyecto usa **PostgreSQL en Supabase** con **Prisma 7** como ORM.

### Modelos

| Tabla | Modelo | Descripción |
|-------|--------|-------------|
| `blog_posts` | `BlogPost` | Artículos con slug, Markdown, publicado/borrador |
| `destinos` | `Destino` | Destinos con slug, etiquetas, activo/inactivo |
| `testimonios` | `Testimonio` | Testimonios con calificación y visibilidad |
| `cotizaciones` | `Cotizacion` | Solicitudes del formulario multi-step |
| `push_subscriptions` | `PushSubscription` | Suscripciones Web Push |

### Comandos

```bash
# Crear/sincronizar tablas en la base de datos
yarn db:push

# Cargar datos de ejemplo
yarn db:seed

# Regenerar Prisma Client (se ejecuta automáticamente en postinstall)
yarn postinstall
```

### Configuración Prisma 7

Prisma 7 requiere un `prisma.config.ts` en la raíz del proyecto. El campo `url` se eliminó del `datasource` en `schema.prisma` y se define solo en `prisma.config.ts`.

---

## Panel de administración

Accesible en `/admin/login`. Credenciales configuradas en `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

### Funcionalidades

**Blog** — `/admin/blog`
- Crear y editar artículos con editor Markdown (tabs Escribir/Vista previa)
- Publicar directamente o guardar como borrador
- Al publicar → se envía push notification a todos los suscriptores

**Destinos** — `/admin/destinos`
- Crear destinos con imagen, descripción, país, tipo y etiquetas
- Activar/desactivar del catálogo público
- Al crear o reactivar → se envía push notification

**Testimonios** — `/admin/testimonios`
- Agregar testimonios con nombre, ciudad, viaje, texto y calificación (1–5)
- Activar/desactivar visibilidad
- Al crear → se envía push notification

**Cotizaciones** — `/admin/cotizaciones`
- Bandeja con todas las solicitudes recibidas
- Marcar como atendida/pendiente
- Ver detalle expandido de cada cotización

**Dashboard** — `/admin`
- Contadores en tiempo real: posts publicados, destinos activos, testimonios, cotizaciones pendientes

---

## PWA y notificaciones push

La aplicación es una **Progressive Web App** instalable en dispositivos móviles y escritorio.

### Flujo de notificaciones push

```
1. Usuario instala la PWA
2. Después de 3s aparece el PushNotificationBanner
3. Usuario acepta → el navegador solicita permiso
4. La suscripción (endpoint + claves) se guarda en push_subscriptions
5. Admin publica contenido → API dispara sendPushToAll()
6. El service worker (worker/index.ts) muestra la notificación
7. Click en la notificación → abre la URL del contenido
```

### Eventos que disparan notificaciones

| Acción | Título | Condición |
|--------|--------|-----------|
| Crear blog post | "Nuevo artículo en ÉLEVA." | Solo si `publicado: true` |
| Publicar borrador | "Nuevo artículo en ÉLEVA." | Toggle `publicado → true` |
| Crear destino | "Nuevo destino en ÉLEVA." | Siempre |
| Reactivar destino | "Nuevo destino en ÉLEVA." | Toggle `activo → true` |
| Crear testimonio | "Nueva experiencia compartida." | Siempre |

### Generar claves VAPID

```bash
yarn generate-vapid
# Output:
# NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
# VAPID_PRIVATE_KEY=...
```

Copiar los valores en `.env.local` y en las variables de entorno de Vercel.

---

## SEO

- **Metadata** completa en todas las páginas públicas (title, description, canonical, Open Graph, Twitter Cards)
- **JSON-LD** estructurado en home (TravelAgency), blog/[slug] (Article), contacto (FAQPage)
- **Sitemap dinámico** en `/sitemap.xml` — incluye rutas estáticas + posts publicados
- **robots.txt** — permite crawlers de IA (GPTBot, ClaudeBot, PerplexityBot)
- **llms.txt** — descripción del negocio para crawlers de IA

---

## Tests

```bash
# Ejecutar todos los tests
yarn test

# Con cobertura
yarn test:coverage
```

**197 tests** distribuidos en 22 archivos:

| Directorio | Qué cubre |
|------------|-----------|
| `tests/api/` | Route Handlers (blog, destinos, testimonios, cotizaciones) |
| `tests/data/` | Stores Prisma (mockeados con `vi.mock('@/lib/db')`) |
| `tests/validations/` | Schemas Zod |
| `tests/components/` | LoginForm, BlogFilterGrid, QuickContactForm |
| `tests/utils/` | format.ts, slugify.ts |

---

## Deploy en Vercel

```bash
# Primera vez
vercel

# Producción
vercel --prod
```

### Variables de entorno en Vercel

Configurar en **Settings → Environment Variables** del proyecto:

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL          → https://tudominio.mx
ADMIN_EMAIL
ADMIN_PASSWORD
RESEND_API_KEY
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_VAPID_PUBLIC_KEY
VAPID_PRIVATE_KEY
VAPID_SUBJECT
```

> `postinstall: "prisma generate"` está configurado en `package.json` — Vercel regenera el cliente de Prisma automáticamente en cada deploy.

---

## Paleta de colores

| Variable | Hex | Uso |
|----------|-----|-----|
| `negro` | `#0A0A0A` | Fondo principal |
| `dorado` | `#C9A84C` | Acentos, CTAs, íconos |
| `dorado-claro` | `#E8C97A` | Hover states |
| `dorado-oscuro` | `#8B6914` | Textos sobre fondos claros |
| `vino` | `#5C1A2E` | Fondos secundarios especiales |
| `crema` | `#F5F0E8` | Texto principal |
| `plata` | `#8A8A8A` | Texto secundario |

---

## Tipografía

- **Display / Títulos:** Cormorant Garamond Light 300 (Google Fonts)
- **Cuerpo / UI:** Montserrat Light 300 & Regular 400 (Google Fonts)

---

## Contacto del proyecto

- **WhatsApp:** +52 33 3708 4290
- **Email:** hola@elevaviajes.mx
- **Instagram:** @elevaviajes
- **Web:** elevaviajes.mx
