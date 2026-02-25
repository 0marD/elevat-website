import Link from 'next/link'
import type { Metadata } from 'next'
import { ROUTES } from '@/lib/constants/routes'
import BlogForm from '../BlogForm'

export const metadata: Metadata = { title: 'Nuevo artículo — Panel ÉLEVA.' }

export default function AdminBlogNuevoPage() {
  return (
    <div className="p-6 md:p-10 max-w-3xl">

      {/* Breadcrumb ──────────────────────────────────────── */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 mb-8 text-[10px] tracking-widest uppercase">
        <Link
          href={ROUTES.admin.blog}
          className="text-plata/50 hover:text-dorado transition-colors"
        >
          Blog
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
          Nuevo artículo
        </h1>
        <p className="text-plata/60 text-sm font-light mt-2">
          Los artículos publicados aparecen en <span className="text-crema/70">/blog</span> inmediatamente.
        </p>
        <div className="mt-4 h-px w-10 bg-dorado/30" />
      </header>

      {/* Formulario ──────────────────────────────────────── */}
      <BlogForm />
    </div>
  )
}
