import type { Metadata } from 'next'
import { getAll, serialize } from '@/lib/data/cotizaciones-store'
import CotizacionesTable from './CotizacionesTable'

export const metadata: Metadata = { title: 'Cotizaciones — Panel ÉLEVA.' }

export const dynamic = 'force-dynamic'

export default async function AdminCotizacionesPage() {
  const cotizaciones = (await getAll()).map(serialize)

  const pendientes = cotizaciones.filter((c) => c.estado === 'pendiente').length
  const atendidas  = cotizaciones.length - pendientes

  return (
    <div className="p-6 md:p-10 max-w-7xl">

      {/* Encabezado ─────────────────────────────────────── */}
      <header className="mb-8">
        <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-2">
          Administración
        </p>
        <h1
          className="text-crema"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300 }}
        >
          Solicitudes de cotización
        </h1>
        <p className="text-plata/40 text-xs mt-2 tracking-wide">
          Haz clic en cualquier fila para ver todos los detalles · El botón de estado alterna entre pendiente y atendida
        </p>
      </header>

      {/* Métricas ───────────────────────────────────────── */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <Metric label="Total"      value={cotizaciones.length} />
        <Metric label="Pendientes" value={pendientes} highlight />
        <Metric label="Atendidas"  value={atendidas} />
      </div>

      {/* Tabla ──────────────────────────────────────────── */}
      <CotizacionesTable cotizaciones={cotizaciones} />

      {/* Nota ───────────────────────────────────────────── */}
      <p className="mt-6 text-[10px] text-plata/30 tracking-wide">
        Los datos se guardan en <code className="text-dorado/50">lib/data/cotizaciones.json</code>.
        Migra a Supabase para producción.
      </p>
    </div>
  )
}

// ─── Métrica ──────────────────────────────────────────────────────────────────

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
