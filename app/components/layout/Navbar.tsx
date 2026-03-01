'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/destinos',    label: 'Destinos' },
  { href: '/cotizacion',  label: 'Cotizar' },
  { href: '/blog',        label: 'Blog' },
  { href: '/testimonios', label: 'Testimonios' },
  { href: '/contacto',    label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const pathname                = usePathname()
  const hamburgerRef            = useRef<HTMLButtonElement>(null)
  const menuRef                 = useRef<HTMLDivElement>(null)

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Keyboard + scroll-lock when menu is open
  useEffect(() => {
    if (!open) return

    // Move focus to first link inside the menu
    const firstLink = menuRef.current?.querySelector<HTMLElement>('a, button')
    firstLink?.focus()

    // Lock body scroll
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open])

  const closeMenu = () => {
    setOpen(false)
    hamburgerRef.current?.focus()
  }

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-negro/95 backdrop-blur-sm border-b border-dorado/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link
            href="/"
            aria-label="ÉLEVA Viajes de Autor — Inicio"
            className="flex flex-col items-start leading-none group"
          >
            <span
              className="text-crema group-hover:text-dorado transition-colors duration-300"
              style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300, letterSpacing: '6px' }}
            >
              ÉLEVA<span className="text-dorado">.</span>
            </span>
            <span className="text-dorado/50 mt-0.5" style={{ fontSize: '7px', letterSpacing: '5px' }}>
              VIAJES DE AUTOR
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? 'page' : undefined}
                className={`text-xs tracking-widest uppercase transition-colors duration-300 ${
                  pathname === l.href ? 'text-dorado' : 'text-crema/50 hover:text-crema'
                }`}
                style={{ fontSize: '9px', letterSpacing: '0.3em' }}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/cotizacion" className="btn-gold ml-4">
              Solicitar cotización
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            className="md:hidden flex flex-col gap-1.5 p-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dorado"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true" className={`block w-6 h-px bg-crema transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span aria-hidden="true" className={`block w-6 h-px bg-crema transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span aria-hidden="true" className={`block w-6 h-px bg-crema transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 bg-negro flex flex-col justify-center items-center gap-8 transition-all duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={closeMenu}
            tabIndex={open ? 0 : -1}
            aria-current={pathname === l.href ? 'page' : undefined}
            className="text-crema/70 hover:text-dorado transition-colors focus-visible:outline-none focus-visible:text-dorado"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300, letterSpacing: '6px' }}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/cotizacion"
          onClick={closeMenu}
          tabIndex={open ? 0 : -1}
          className="btn-gold mt-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-dorado"
        >
          Cotizar ahora
        </Link>
      </div>
    </>
  )
}
