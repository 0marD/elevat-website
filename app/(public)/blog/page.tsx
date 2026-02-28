import type { Metadata } from 'next'
import { getPublished, serialize } from '@/lib/data/blog-store'
import BlogFilterGrid from './BlogFilterGrid'

export const metadata: Metadata = {
  title: 'Blog de Viajes — ÉLEVA. Guías, Consejos y Destinos',
  description: 'Guías de destino, consejos de viaje y contenido exclusivo del equipo de ÉLEVA. Aprende a viajar mejor con nuestros artículos.',
  alternates: { canonical: 'https://elevaviajes.shop/blog' },
  openGraph: {
    title: 'Blog de Viajes — ÉLEVA.',
    description: 'Guías de destino, consejos y contenido exclusivo para viajeros.',
    url: 'https://elevaviajes.shop/blog',
    locale: 'es_MX',
  },
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = (await getPublished()).map(serialize)

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Encabezado ─────────────────────────────────────── */}
        <div className="mb-16">
          <div className="section-label">Conocimiento que transforma viajes</div>
          <h1 className="display-heading" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
            El blog de<br /><em className="text-dorado">ÉLEVA.</em>
          </h1>
        </div>

        {/* Filtro + grid (client) ──────────────────────────── */}
        <BlogFilterGrid posts={posts} />

        {/* Newsletter CTA ──────────────────────────────────── */}
        <div className="mt-20 card-dark p-12 text-center">
          <div className="section-label mb-4">Contenido exclusivo cada semana</div>
          <h2
            className="display-heading mb-4"
            style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}
          >
            Suscríbete al newsletter<br /><em className="text-dorado">de ÉLEVA.</em>
          </h2>
          <p className="text-plata text-sm mb-8 max-w-sm mx-auto leading-loose">
            Guías de destino, ofertas exclusivas y consejos que no encontrarás en ningún otro lado.
          </p>
          <div className="flex gap-0 max-w-md mx-auto">
            <label htmlFor="newsletter-email" className="sr-only">Correo electrónico</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="tu@correo.com"
              className="flex-1 bg-transparent border border-dorado/20 px-5 py-3 text-crema text-sm outline-none focus:border-dorado/50 transition-colors placeholder:text-plata/30"
            />
            <button className="btn-gold border-l-0" style={{ whiteSpace: 'nowrap' }}>
              Suscribirme
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
