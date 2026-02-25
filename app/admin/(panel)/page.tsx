import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import type { Metadata } from 'next'
import { getAll as getCotizaciones } from '@/lib/data/cotizaciones-store'
import { getPublished } from '@/lib/data/blog-store'
import { getVisible } from '@/lib/data/testimonios-store'
import { getActivos } from '@/lib/data/destinos-store'

export const metadata: Metadata = { title: 'Dashboard — Panel ÉLEVA.' }

// ─── Tipos locales ───────────────────────────────────────────────────────────

interface StatCardProps {
  label:    string
  value:    number | string
  sublabel: string
  href:     string
  icon:     React.ReactNode
}

interface QuickActionProps {
  label: string
  href:  string
}

// ─── Iconos inline ───────────────────────────────────────────────────────────

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
    <path d="M9 12h6m-6 4h4M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
  </svg>
)

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
    <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 shrink-0" aria-hidden="true">
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

// ─── Componentes de tarjeta y acción rápida ──────────────────────────────────

function StatCard({ label, value, sublabel, href, icon }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group block border border-crema/10 bg-negro/50 p-6 hover:border-dorado/30 transition-colors duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-dorado/60 group-hover:text-dorado transition-colors duration-300">
          {icon}
        </span>
        <span
          className="text-dorado"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '40px', fontWeight: 300, lineHeight: 1 }}
        >
          {value}
        </span>
      </div>

      <p className="text-crema text-sm font-light">{label}</p>
      <p className="text-plata/50 text-[10px] tracking-widest uppercase mt-1">{sublabel}</p>
    </Link>
  )
}

function QuickAction({ label, href }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 border border-crema/15 text-crema/60 hover:border-dorado/40 hover:text-dorado px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
    >
      <span aria-hidden="true">+</span>
      {label}
    </Link>
  )
}

// ─── Carga de métricas reales ─────────────────────────────────────────────────

async function loadStats() {
  const [cotizaciones, posts, testimonios, destinos] = await Promise.all([
    getCotizaciones(),
    getPublished(),
    getVisible(),
    getActivos(),
  ])
  return {
    cotizacionesPendientes: cotizaciones.filter((c) => c.estado === 'pendiente').length,
    postsPublicados:        posts.length,
    testimoniosVisibles:    testimonios.length,
    destinosActivos:        destinos.length,
  }
}

const QUICK_ACTIONS: QuickActionProps[] = [
  { label: 'Nuevo post',        href: ROUTES.admin.blogNuevo },
  { label: 'Nuevo testimonio',  href: ROUTES.admin.testimonioNuevo },
  { label: 'Nuevo destino',     href: ROUTES.admin.destinoNuevo },
]

// ─── Página ──────────────────────────────────────────────────────────────────

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  const stats   = await loadStats()

  const STAT_CARDS: StatCardProps[] = [
    {
      label:    'Cotizaciones pendientes',
      value:    stats.cotizacionesPendientes,
      sublabel: 'Ver bandeja',
      href:     ROUTES.admin.cotizaciones,
      icon:     <IconMail />,
    },
    {
      label:    'Posts publicados',
      value:    stats.postsPublicados,
      sublabel: 'Ir al blog',
      href:     ROUTES.admin.blog,
      icon:     <IconDoc />,
    },
    {
      label:    'Testimonios activos',
      value:    stats.testimoniosVisibles,
      sublabel: 'Ver testimonios',
      href:     ROUTES.admin.testimonios,
      icon:     <IconChat />,
    },
    {
      label:    'Destinos en catálogo',
      value:    stats.destinosActivos,
      sublabel: 'Ver destinos',
      href:     ROUTES.admin.destinos,
      icon:     <IconPin />,
    },
  ]

  return (
    <div className="p-6 md:p-10 max-w-5xl">

      {/* Encabezado ────────────────────────────────────────── */}
      <header className="mb-10">
        <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-3">
          Panel de administración
        </p>
        <h1
          className="text-crema mb-2"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 300, letterSpacing: '2px' }}
        >
          Bienvenido de vuelta
        </h1>
        {session?.user?.email && (
          <p className="text-plata text-sm font-light tracking-wide">
            {session.user.email}
          </p>
        )}
        <div className="mt-5 h-px w-12 bg-dorado/40" />
      </header>

      {/* Métricas ──────────────────────────────────────────── */}
      <section aria-labelledby="metricas-heading">
        <h2
          id="metricas-heading"
          className="text-[9px] tracking-[0.35em] uppercase text-plata/50 mb-4"
        >
          Resumen
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Nota informativa ─────────────────────────────── */}
        <div className="flex items-start gap-2 mt-3 px-1 text-plata/40">
          <IconInfo />
          <p className="text-[10px] tracking-wide leading-relaxed">
            Datos en tiempo real desde almacenamiento local JSON.
          </p>
        </div>
      </section>

      {/* Divisor ───────────────────────────────────────────── */}
      <hr className="my-10 border-none h-px bg-gradient-to-r from-transparent via-crema/10 to-transparent" />

      {/* Accesos rápidos ───────────────────────────────────── */}
      <section aria-labelledby="accesos-heading">
        <h2
          id="accesos-heading"
          className="text-[9px] tracking-[0.35em] uppercase text-plata/50 mb-4"
        >
          Accesos rápidos
        </h2>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <QuickAction key={action.href} {...action} />
          ))}
        </div>
      </section>

      {/* Divisor ───────────────────────────────────────────── */}
      <hr className="my-10 border-none h-px bg-gradient-to-r from-transparent via-crema/10 to-transparent" />

      {/* Estado del sistema ────────────────────────────────── */}
      <section aria-labelledby="sistema-heading">
        <h2
          id="sistema-heading"
          className="text-[9px] tracking-[0.35em] uppercase text-plata/50 mb-4"
        >
          Estado del sistema
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <StatusRow label="NextAuth"   status="ok"      detail="Sesión JWT activa" />
          <StatusRow label="Datos JSON" status="ok"      detail="Almacenamiento local activo" />
          <StatusRow label="Resend"     status="pending" detail="Email no configurado" />
          <StatusRow label="Cloudinary" status="pending" detail="Imágenes no configurado" />
        </div>
      </section>

    </div>
  )
}

// ─── Sub-componente: fila de estado del sistema ──────────────────────────────

type StatusLevel = 'ok' | 'pending' | 'error'

interface StatusRowProps {
  label:  string
  status: StatusLevel
  detail: string
}

const STATUS_STYLES: Record<StatusLevel, string> = {
  ok:      'bg-emerald-500/20 text-emerald-400',
  pending: 'bg-dorado/10 text-dorado/70',
  error:   'bg-red-500/20 text-red-400',
}

const STATUS_LABELS: Record<StatusLevel, string> = {
  ok:      'Activo',
  pending: 'Pendiente',
  error:   'Error',
}

function StatusRow({ label, status, detail }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between border border-crema/8 px-4 py-3 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`text-[9px] tracking-widest uppercase px-2 py-0.5 shrink-0 ${STATUS_STYLES[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
        <span className="text-xs text-crema/70 font-light">{label}</span>
      </div>
      <span className="text-[10px] text-plata/40 tracking-wide truncate text-right">{detail}</span>
    </div>
  )
}
