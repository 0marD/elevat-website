import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBySlug, serialize } from '@/lib/data/destinos-store'
import { prisma } from '@/lib/db'
import { ROUTES } from '@/lib/constants/routes'
import DestinoForm from '../DestinoForm'

interface AdminDestinoEditarParams {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: AdminDestinoEditarParams): Promise<Metadata> {
  const { id } = await params
  const destino = await prisma.destino.findUnique({ where: { id } })
  return {
    title: destino
      ? `Editar: ${destino.nombre} — Panel ÉLEVA.`
      : 'Destino no encontrado — Panel ÉLEVA.',
  }
}

export default async function AdminDestinoEditarPage({ params }: AdminDestinoEditarParams) {
  const { id } = await params
  const destino = await prisma.destino.findUnique({ where: { id } })
  if (!destino) notFound()

  const serialized = serialize(destino)

  return (
    <div className="p-6 md:p-10 max-w-3xl">

      {/* Breadcrumb */}
      <nav aria-label="Ruta de navegación" className="flex items-center gap-2 mb-8 text-[10px] tracking-widest uppercase">
        <Link href={ROUTES.admin.destinos} className="text-plata/50 hover:text-dorado transition-colors">
          Destinos
        </Link>
        <span aria-hidden="true" className="text-plata/20">›</span>
        <span className="text-dorado/70 line-clamp-1 max-w-[200px]">{destino.nombre}</span>
      </nav>

      {/* Encabezado */}
      <header className="mb-8">
        <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-2">Administración</p>
        <h1
          className="text-crema"
          style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300 }}
        >
          Editar destino
        </h1>
        <p className="text-plata/60 text-sm font-light mt-2">
          Slug: <code className="text-crema/50">{destino.slug}</code>
        </p>
        <div className="mt-4 h-px w-10 bg-dorado/30" />
      </header>

      {/* Formulario */}
      <DestinoForm initialData={serialized} />
    </div>
  )
}
