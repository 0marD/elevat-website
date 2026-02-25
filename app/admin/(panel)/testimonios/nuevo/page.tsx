import Link from 'next/link'
import type { Metadata } from 'next'
import { ROUTES } from '@/lib/constants/routes'
import TestimonioForm from './TestimonioForm'

export const metadata: Metadata = { title: 'Nuevo testimonio — Panel ÉLEVA.' }

export default function AdminTestimonioNuevoPage() {
  return (
    <div className="p-6 md:p-10 max-w-2xl">

      {/* Breadcrumb ──────────────────────────────────────── */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 mb-8 text-[10px] tracking-widest uppercase">
        <Link
          href={ROUTES.admin.testimonios}
          className="text-plata/50 hover:text-dorado transition-colors"
        >
          Testimonios
        </Link>
        <span aria-hidden="true" className="text-plata/20">›</span>
        <span className="text-dorado/70">Nuevo</span>
      </nav>

      {/* Encabezado ──────────────────────────────────────── */}
      <header className="mb-8">
        <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-2">
          Administración
        </p>
        <h1
          className="text-crema"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300 }}
        >
          Agregar testimonio
        </h1>
        <p className="text-plata/60 text-sm font-light mt-2">
          El testimonio aparecerá en <span className="text-crema/70">/testimonios</span> inmediatamente tras publicarlo.
        </p>
        <div className="mt-4 h-px w-10 bg-dorado/30" />
      </header>

      {/* Formulario ──────────────────────────────────────── */}
      <TestimonioForm />
    </div>
  )
}
