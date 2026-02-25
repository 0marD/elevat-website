import Link from 'next/link'
import type { Metadata } from 'next'
import { getAll, serialize } from '@/lib/data/destinos-store'
import { ROUTES } from '@/lib/constants/routes'
import DestinosTable from './DestinosTable'

export const metadata: Metadata = { title: 'Destinos — Panel ÉLEVA.' }

export const dynamic = 'force-dynamic'

export default async function AdminDestinosPage() {
  const destinos = (await getAll()).map(serialize)
  const activos  = destinos.filter((d) => d.activo).length

  return (
    <div className="p-6 md:p-10 max-w-5xl">

      {/* Encabezado ─────────────────────────────────────────── */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-[9px] tracking-[0.4em] uppercase text-dorado/60 mb-2">
            Gestión de destinos
          </p>
          <h1
            className="text-crema"
            style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, letterSpacing: '2px' }}
          >
            Destinos
          </h1>
          <p className="text-plata/50 text-[10px] tracking-widest uppercase mt-1">
            {destinos.length} en total · {activos} activos
          </p>
        </div>

        <Link
          href={ROUTES.admin.destinoNuevo}
          className="inline-flex items-center gap-2 border border-dorado/40 text-dorado hover:bg-dorado/5 px-5 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors duration-200"
        >
          <span aria-hidden="true">+</span>
          Nuevo destino
        </Link>
      </header>

      {/* Tabla de destinos ──────────────────────────────────── */}
      <DestinosTable destinos={destinos} />

    </div>
  )
}
