import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getById, serialize } from '@/lib/data/testimonios-store'
import { ROUTES } from '@/lib/constants/routes'
import TestimonioForm from '../nuevo/TestimonioForm'

interface AdminTestimonioEditarParams {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AdminTestimonioEditarParams): Promise<Metadata> {
  const { id } = await params
  const t = await getById(id)
  return {
    title: t
      ? `Editar: ${t.nombre} — Panel ÉLEVA.`
      : 'Testimonio no encontrado — Panel ÉLEVA.',
  }
}

export default async function AdminTestimonioEditarPage({ params }: AdminTestimonioEditarParams) {
  const { id } = await params
  const testimonio = await getById(id)
  if (!testimonio) notFound()

  const serialized = serialize(testimonio)

  return (
    <div className="p-6 md:p-10 max-w-3xl">

      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 mb-8 text-[10px] tracking-widest uppercase">
        <Link href={ROUTES.admin.testimonios} className="text-plata/50 hover:text-dorado transition-colors">
          Testimonios
        </Link>
        <span aria-hidden="true" className="text-plata/20">›</span>
        <span className="text-dorado/70 line-clamp-1 max-w-[200px]">{testimonio.nombre}</span>
      </nav>

      {/* Encabezado */}
      <header className="mb-8">
        <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-2">Administración</p>
        <h1
          className="text-crema"
          style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300 }}
        >
          Editar testimonio
        </h1>
        <p className="text-plata/60 text-sm font-light mt-2">
          {testimonio.ciudad} · {testimonio.viaje}
        </p>
        <div className="mt-4 h-px w-10 bg-dorado/30" />
      </header>

      {/* Formulario */}
      <TestimonioForm initialData={serialized} />
    </div>
  )
}
