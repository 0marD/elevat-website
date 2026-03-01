'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { DestinoSerialized } from '@/types/destino'

interface DestinosFilterGridProps {
  destinos: DestinoSerialized[]
}

const CATEGORIAS = ['Todos', 'Playa', 'Cultura', 'Lujo', 'Aventura', 'Romance', 'Gastronomía', 'Diversión', 'Descanso']

export default function DestinosFilterGrid({ destinos }: DestinosFilterGridProps) {
  const [categoriaActiva, setCategoriaActiva] = useState('Todos')

  const destinosFiltrados =
    categoriaActiva === 'Todos'
      ? destinos
      : destinos.filter((d) => d.etiquetas.includes(categoriaActiva))

  return (
    <>
      {/* Filter pills */}
      <div className="mb-8 sm:mb-12 flex gap-2 flex-wrap">
        {CATEGORIAS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategoriaActiva(c)}
            aria-pressed={categoriaActiva === c}
            className={cn(
              'px-3 sm:px-5 py-1.5 sm:py-2 text-xs border transition-all duration-300',
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
      {destinosFiltrados.length === 0 ? (
        <p className="text-center text-plata text-sm py-20">
          No hay destinos en esta categoría todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-3">
          {destinosFiltrados.map((d) => (
            <article key={d.id} className="group card-dark overflow-hidden animate-fade-in-up">
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.imagenPrincipal}
                  alt={d.nombre}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-negro/80 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-1 flex-wrap">
                  {d.etiquetas.map((e) => (
                    <span
                      key={e}
                      className="px-2 py-1 bg-negro/60 text-dorado backdrop-blur-sm"
                      style={{ fontSize: '8px', letterSpacing: '3px' }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5 sm:p-8">
                <div className="section-label mb-2" style={{ color: 'rgba(201,168,76,0.6)' }}>
                  {d.tipo} · {d.pais}
                </div>
                <h2 className="display-heading mb-3" style={{ fontSize: 'clamp(22px, 4vw, 28px)' }}>{d.nombre}</h2>
                <p className="text-plata/70 text-xs leading-loose mb-6">{d.descripcion}</p>
                <Link
                  href={`/cotizacion?destino=${encodeURIComponent(d.nombre)}`}
                  className="btn-gold text-xs"
                >
                  Cotizar este destino →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
