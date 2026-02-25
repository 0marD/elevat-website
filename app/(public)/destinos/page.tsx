'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface DestinoCard {
  nombre: string
  pais: string
  tipo: string
  descripcion: string
  img: string
  etiquetas: string[]
}

const DESTINOS: DestinoCard[] = [
  { nombre: 'Los Cabos', pais: 'México', tipo: 'Playa de lujo', descripcion: 'El Pacífico más exclusivo del país. Resorts de autor, avistamiento de ballenas y atardeceres únicos.', img: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=700&q=80', etiquetas: ['Playa', 'Lujo', 'Romance'] },
  { nombre: 'Riviera Maya', pais: 'México', tipo: 'Todo incluido premium', descripcion: 'Cenotes, selva maya y el Caribe turquesa. La experiencia mexicana más completa.', img: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=700&q=80', etiquetas: ['Playa', 'Familia', 'Cultura'] },
  { nombre: 'Ciudad de México', pais: 'México', tipo: 'Gastronomía & cultura', descripcion: 'Una de las ciudades más vibrantes del mundo. Arte, gastronomía de clase mundial y vida nocturna.', img: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=700&q=80', etiquetas: ['Cultura', 'Gastronomía', 'Arte'] },
  { nombre: 'Toscana', pais: 'Italia', tipo: 'Cultura & vino', descripcion: 'Viñedos centenarios, pueblos medievales y la cuna del Renacimiento. Para los que aprecian la belleza lenta.', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=700&q=80', etiquetas: ['Cultura', 'Gastronomía', 'Romance'] },
  { nombre: 'Kioto', pais: 'Japón', tipo: 'Experiencia cultural', descripcion: 'Jardines zen, templos milenarios y la ceremonia del té. Japón en su forma más espiritual y refinada.', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&q=80', etiquetas: ['Cultura', 'Espiritual', 'Fotografía'] },
  { nombre: 'Santorini', pais: 'Grecia', tipo: 'Romance & lujo', descripcion: 'Cúpulas azules sobre el Egeo. El destino más romántico de Europa, perfectamente curado para dos.', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80', etiquetas: ['Playa', 'Romance', 'Lujo'] },
  { nombre: 'Patagonia', pais: 'Argentina / Chile', tipo: 'Aventura & naturaleza', descripcion: 'El fin del mundo en toda su magnitud. Glaciares, torres de granito y silencio absoluto.', img: 'https://images.unsplash.com/photo-1531761535209-180857e963b9?w=700&q=80', etiquetas: ['Aventura', 'Naturaleza', 'Fotografía'] },
  { nombre: 'Nueva York', pais: 'EUA', tipo: 'Ciudad & cultura', descripcion: 'Broadway, los mejores restaurantes del mundo y compras ilimitadas. La ciudad que nunca duerme.', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=700&q=80', etiquetas: ['Ciudad', 'Arte', 'Compras'] },
  { nombre: 'Maldivas', pais: 'Océano Índico', tipo: 'Lujo absoluto', descripcion: 'Villas sobre el agua, arrecifes de coral vírgenes y el silencio del Índico. El lujo en su forma más pura.', img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=80', etiquetas: ['Playa', 'Lujo', 'Romance'] },
]

const CATEGORIAS = ['Todos', 'Playa', 'Cultura', 'Lujo', 'Aventura', 'Romance', 'Gastronomía']

export default function DestinosPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  const destinosFiltrados =
    categoriaActiva === 'Todos'
      ? DESTINOS
      : DESTINOS.filter((d) => d.etiquetas.includes(categoriaActiva))

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-20">
        <div className="section-label">Destinos curados</div>
        <h1 className="display-heading mb-6" style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>
          El mundo,<br /><em className="text-dorado">seleccionado para ti</em>
        </h1>
        <p className="text-plata text-sm leading-loose max-w-lg">
          Cada destino en nuestra cartera ha sido visitado, evaluado y curado personalmente. No recomendamos lo que no conocemos.
        </p>
      </div>

      {/* Filter pills */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex gap-2 flex-wrap">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoriaActiva(c)}
            aria-pressed={categoriaActiva === c}
            className={cn(
              'px-5 py-2 text-xs border transition-all duration-300',
              categoriaActiva === c
                ? 'border-dorado text-dorado'
                : 'border-dorado/15 text-plata/50 hover:border-dorado/40 hover:text-crema'
            )}
            style={{ letterSpacing: '0.2em' }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {destinosFiltrados.length === 0 ? (
          <p className="text-center text-plata text-sm py-20">
            No hay destinos en esta categoría todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {destinosFiltrados.map((d) => (
              <div key={d.nombre} className="group card-dark overflow-hidden">
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.img} alt={d.nombre}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-negro/80 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-1 flex-wrap">
                    {d.etiquetas.map((e) => (
                      <span key={e} className="px-2 py-1 bg-negro/60 text-dorado backdrop-blur-sm"
                        style={{ fontSize: '8px', letterSpacing: '3px' }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-8">
                  <div className="section-label mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>{d.tipo} · {d.pais}</div>
                  <h2 className="display-heading mb-3" style={{ fontSize: '28px' }}>{d.nombre}</h2>
                  <p className="text-plata/70 text-xs leading-loose mb-6">{d.descripcion}</p>
                  <Link
                    href={`/cotizacion?destino=${encodeURIComponent(d.nombre)}`}
                    className="btn-gold text-xs"
                  >
                    Cotizar este destino →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
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
