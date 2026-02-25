import Link from 'next/link'
import type { Metadata } from 'next'
import { getAll, serialize } from '@/lib/data/testimonios-store'
import { ROUTES } from '@/lib/constants/routes'
import TestimoniosTable from './TestimoniosTable'

export const metadata: Metadata = { title: 'Testimonios — Panel ÉLEVA.' }

// force-dynamic para que router.refresh() en el cliente refleje cambios del JSON
export const dynamic = 'force-dynamic'

export default async function AdminTestimoniosPage() {
  const testimonios = (await getAll()).map(serialize)

  const visibles = testimonios.filter((t) => t.visible).length
  const ocultos  = testimonios.length - visibles

  return (
    <div className="p-6 md:p-10 max-w-6xl">

      {/* Encabezado ─────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-2">
            Administración
          </p>
          <h1
            className="text-crema"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300 }}
          >
            Testimonios
          </h1>
        </div>

        <Link
          href={ROUTES.admin.testimonioNuevo}
          className="self-start sm:self-auto inline-flex items-center gap-2 bg-dorado text-negro px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase font-normal hover:bg-dorado-claro transition-colors"
        >
          <span aria-hidden="true">+</span> Nuevo testimonio
        </Link>
      </header>

      {/* Métricas rápidas ───────────────────────────────── */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <Metric label="Total" value={testimonios.length} />
        <Metric label="Visibles" value={visibles} highlight />
        <Metric label="Ocultos" value={ocultos} />
      </div>

      {/* Tabla ──────────────────────────────────────────── */}
      <TestimoniosTable testimonios={testimonios} />

      {/* Nota de persistencia ───────────────────────────── */}
      <p className="mt-6 text-[10px] text-plata/30 tracking-wide">
        Los datos se guardan en <code className="text-dorado/50">lib/data/testimonios.json</code>.
        Migra a Supabase para producción.
      </p>
    </div>
  )
}

// ─── Sub-componente: métrica de resumen ──────────────────────────────────────

interface MetricProps {
  label:     string
  value:     number
  highlight?: boolean
}

function Metric({ label, value, highlight }: MetricProps) {
  return (
    <div className="border border-crema/10 px-5 py-3 flex items-baseline gap-3">
      <span
        className={highlight ? 'text-dorado' : 'text-crema'}
        style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 300 }}
      >
        {value}
      </span>
      <span className="text-[9px] tracking-widest uppercase text-plata/50">{label}</span>
    </div>
  )
}
