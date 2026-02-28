import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import MensajesTable from './MensajesTable'

export const metadata: Metadata = { title: 'Mensajes — Panel ÉLEVA.' }

export const dynamic = 'force-dynamic'

export default async function AdminMensajesPage() {
  const mensajes = await prisma.mensajeRapido.findMany({
    orderBy: { creadoEn: 'desc' },
  })

  const serialized = mensajes.map(m => ({
    ...m,
    creadoEn: m.creadoEn.toISOString(),
  }))

  const noLeidos = serialized.filter(m => !m.leido).length

  return (
    <div className="p-6 md:p-10 max-w-5xl">

      <header className="mb-8">
        <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-2">
          Administración
        </p>
        <h1
          className="text-crema"
          style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300 }}
        >
          Mensajes rápidos
        </h1>
        <p className="text-plata/40 text-xs mt-2 tracking-wide">
          Mensajes recibidos desde el formulario de contacto
        </p>
      </header>

      <div className="flex gap-4 mb-8 flex-wrap">
        <Metric label="Total"    value={serialized.length} />
        <Metric label="No leídos" value={noLeidos} highlight />
      </div>

      <MensajesTable mensajes={serialized} />
    </div>
  )
}

interface MetricProps {
  label:      string
  value:      number
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
