import type { Metadata } from 'next'
import Link from 'next/link'
import { getActivos, serialize } from '@/lib/data/destinos-store'
import DestinosFilterGrid from './DestinosFilterGrid'

export const metadata: Metadata = {
  title: 'Destinos — ÉLEVA. Viajes de Autor',
  description: 'Destinos curados y visitados por el equipo de ÉLEVA. Playas de lujo, cultura, aventura y romance en México y el mundo.',
  alternates: { canonical: 'https://elevaviajes.shop/destinos' },
  openGraph: {
    title: 'Destinos — ÉLEVA. Viajes de Autor',
    description: 'Cada destino en nuestra cartera ha sido visitado, evaluado y curado personalmente.',
    url: 'https://elevaviajes.shop/destinos',
  },
}

export const dynamic = 'force-dynamic'

export default async function DestinosPage() {
  const destinos = (await getActivos()).map(serialize)

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20 animate-fade-in">
        <div className="section-label">Destinos curados</div>
        <h1 className="display-heading mb-6" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
          El mundo,<br /><em className="text-dorado">seleccionado para ti</em>
        </h1>
        <p className="text-plata text-sm leading-loose max-w-lg">
          Cada destino en nuestra cartera ha sido visitado, evaluado y curado personalmente. No recomendamos lo que no conocemos.
        </p>
      </div>

      {/* Filter + grid (client component) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <DestinosFilterGrid destinos={destinos} />
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-24 text-center">
        <div className="card-dark p-16">
          <div className="section-label mb-4">¿No encuentras tu destino?</div>
          <h2 className="display-heading mb-6" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
            Llevamos a nuestros clientes<br /><em className="text-dorado">a cualquier rincón del mundo</em>
          </h2>
          <p className="text-plata text-sm mb-10 max-w-md mx-auto leading-loose">
            Si tienes un destino en mente que no aparece aquí, cuéntanoslo. Nuestro trabajo es hacerlo posible.
          </p>
          <Link href="/cotizacion" className="btn-gold">Solicitar destino personalizado</Link>
        </div>
      </div>
    </div>
  )
}
