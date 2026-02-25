'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants/routes'

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  matchExact?: boolean
}

// ─── Iconos inline (sin dependencia externa) ────────────────────────────────

const IconDashboard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const IconBlog = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
    <path d="M9 12h6m-6 4h4M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
  </svg>
)

const IconTestimonios = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const IconDestinos = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
    <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const IconCotizaciones = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4" aria-hidden="true">
    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
)

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// ─── Items de navegación ─────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.admin.dashboard,    label: 'Dashboard',     icon: <IconDashboard />,    matchExact: true },
  { href: ROUTES.admin.blog,         label: 'Blog',          icon: <IconBlog /> },
  { href: ROUTES.admin.testimonios,  label: 'Testimonios',   icon: <IconTestimonios /> },
  { href: ROUTES.admin.destinos,     label: 'Destinos',      icon: <IconDestinos /> },
  { href: ROUTES.admin.cotizaciones, label: 'Cotizaciones',  icon: <IconCotizaciones /> },
]

// ─── Componente ─────────────────────────────────────────────────────────────

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  // Cierra el menú móvil al navegar
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (item: NavItem) =>
    item.matchExact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <>
      {/* ── Barra superior en móvil ─────────────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-negro border-b border-crema/10 flex items-center justify-between px-5">
        <BrandMark />
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menú de administración"
          className="text-plata hover:text-crema transition-colors p-1"
        >
          <IconMenu />
        </button>
      </div>

      {/* ── Backdrop móvil ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-negro/80 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Panel del sidebar ────────────────────────────────────────── */}
      <aside
        className={cn(
          // Mobile: overlay deslizable
          'fixed top-0 left-0 h-screen w-64 z-50 transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: sticky en el flujo flex, siempre visible
          'md:sticky md:translate-x-0 md:z-auto md:flex-shrink-0',
          'flex flex-col bg-negro border-r border-crema/10'
        )}
        aria-label="Navegación del panel de administración"
      >

        {/* Header del sidebar ──────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-crema/10">
          <BrandMark />
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
            className="md:hidden text-plata hover:text-crema transition-colors p-1"
          >
            <IconClose />
          </button>
        </div>

        {/* Etiqueta de sección ─────────────────────────────────────── */}
        <p className="px-5 pt-6 pb-2 text-[9px] tracking-[0.35em] uppercase text-dorado/60">
          Panel admin
        </p>

        {/* Navegación ──────────────────────────────────────────────── */}
        <nav aria-label="Secciones del panel">
          <ul className="flex flex-col px-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider transition-colors duration-200 rounded-sm',
                    isActive(item)
                      ? 'text-dorado bg-dorado/5 border-l-2 border-dorado pl-[10px]'
                      : 'text-plata hover:text-crema hover:bg-crema/5 border-l-2 border-transparent pl-[10px]'
                  )}
                  aria-current={isActive(item) ? 'page' : undefined}
                >
                  {item.icon}
                  <span style={{ letterSpacing: '0.12em' }}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Spacer ──────────────────────────────────────────────────── */}
        <div className="flex-1" />

        {/* Footer del sidebar: usuario + logout ────────────────────── */}
        <div className="border-t border-crema/10 p-4 space-y-3">
          {session?.user?.email && (
            <p className="text-[10px] text-plata/60 tracking-wider truncate px-1">
              {session.user.email}
            </p>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider',
              'text-plata/70 hover:text-red-400 hover:bg-red-500/5',
              'border border-crema/10 hover:border-red-500/30',
              'transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50'
            )}
          >
            <IconLogout />
            <span style={{ letterSpacing: '0.12em' }}>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}

// ─── Sub-componente: logotipo compacto ───────────────────────────────────────

function BrandMark() {
  return (
    <div className="leading-none">
      <span
        className="text-crema"
        style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', fontWeight: 300, letterSpacing: '4px' }}
      >
        ÉLEVA<span className="text-dorado">.</span>
      </span>
    </div>
  )
}
