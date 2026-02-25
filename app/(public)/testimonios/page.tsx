import Link from 'next/link'
import type { Metadata } from 'next'
import { getVisible } from '@/lib/data/testimonios-store'
import type { Testimonio } from '@/types/testimonio'

export const metadata: Metadata = {
  title: 'Testimonios — ÉLEVA. Viajes de Autor',
  description: 'Lo que dicen nuestros viajeros sobre sus experiencias con ÉLEVA.',
}

// Siempre fresco: lee del JSON en cada request para reflejar cambios del admin
export const dynamic = 'force-dynamic'

export default async function TestimoniosPage() {
  const testimonios = await getVisible()

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Encabezado ─────────────────────────────────────── */}
        <header className="text-center mb-20">
          <div className="section-label">Lo que dicen nuestros viajeros</div>
          <h1
            className="display-heading mb-6"
            style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}
          >
            Experiencias que<br />
            <em className="text-dorado">hablan por sí solas</em>
          </h1>
          <p className="text-plata text-sm leading-loose max-w-lg mx-auto">
            No prometemos el viaje ideal. Se lo entregamos. Esto es lo que dicen quienes ya lo vivieron.
          </p>
        </header>

        {/* Estadísticas ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2 mb-20">
          {[
            { num: '100%', label: 'Satisfacción' },
            { num: '5★',   label: 'Calificación promedio' },
            { num: `+${testimonios.length}`, label: 'Viajeros felices' },
          ].map((s) => (
            <div key={s.label} className="card-dark p-8 text-center">
              <div
                className="text-dorado mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 300 }}
              >
                {s.num}
              </div>
              <div
                className="text-plata/50"
                style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase' }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Grid de testimonios ────────────────────────────── */}
        {testimonios.length > 0 ? (
          <ul
            aria-label="Testimonios de clientes"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
          >
            {testimonios.map((t) => (
              <TestimonioCard key={t.id} testimonio={t} />
            ))}
          </ul>
        ) : (
          <p className="text-center text-plata text-sm py-20">
            Pronto compartiremos las primeras experiencias.
          </p>
        )}

        {/* CTA ─────────────────────────────────────────────── */}
        <footer className="text-center mt-24">
          <div className="section-label mb-4">Únete a nuestros viajeros</div>
          <h2
            className="display-heading mb-8"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
          >
            Tu historia comienza<br />
            <em className="text-dorado">con una cotización</em>
          </h2>
          <Link href="/cotizacion" className="btn-gold">
            Solicitar mi viaje →
          </Link>
        </footer>

      </div>
    </div>
  )
}

// ─── Tarjeta de testimonio ───────────────────────────────────────────────────

function TestimonioCard({ testimonio: t }: { testimonio: Testimonio }) {
  return (
    <li className="card-dark p-8 flex flex-col">

      {/* Estrellas */}
      <div className="flex gap-1 mb-6" aria-label={`${t.calificacion} de 5 estrellas`}>
        {Array.from({ length: t.calificacion }).map((_, i) => (
          <span key={i} aria-hidden="true" className="text-dorado" style={{ fontSize: '12px' }}>
            ★
          </span>
        ))}
      </div>

      {/* Comilla decorativa */}
      <div
        aria-hidden="true"
        className="text-dorado/30 mb-4 leading-none"
        style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '64px', fontWeight: 300 }}
      >
        "
      </div>

      {/* Texto */}
      <blockquote
        className="text-crema/80 flex-1 mb-8 leading-loose"
        style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '17px', fontWeight: 300, fontStyle: 'italic' }}
      >
        {t.texto}
      </blockquote>

      {/* Autor */}
      <footer className="border-t border-dorado/10 pt-6">
        <p className="text-crema text-sm font-medium tracking-wider">{t.nombre}</p>
        <p
          className="text-plata/40 mt-1"
          style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase' }}
        >
          {t.ciudad} · {t.viaje}
        </p>
      </footer>
    </li>
  )
}
