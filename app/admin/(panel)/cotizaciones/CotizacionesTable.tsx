'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format'
import type { CotizacionSerialized } from '@/types/cotizacion'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '523337084290'

const PRESUPUESTO_LABELS: Record<string, string> = {
  '20000-40000':  '$20k–$40k',
  '40000-80000':  '$40k–$80k',
  '80000-150000': '$80k–$150k',
  '150000+':      '+$150k',
  'flexible':     'Flexible',
}

interface CotizacionesTableProps {
  cotizaciones: CotizacionSerialized[]
}

export default function CotizacionesTable({ cotizaciones }: CotizacionesTableProps) {
  if (cotizaciones.length === 0) {
    return (
      <p className="text-plata/40 text-sm py-12 text-center tracking-wide">
        Aún no hay solicitudes de cotización.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-crema/10">
            {['Cliente', 'Destino', 'Viaje', 'Presupuesto', 'Estado', 'Fecha', 'Acciones'].map((h) => (
              <th
                key={h}
                className="pb-3 text-[9px] tracking-[0.3em] uppercase text-plata/40 font-normal pr-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cotizaciones.map((c) => (
            <CotizacionRow key={c.id} cotizacion={c} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Fila expandible ──────────────────────────────────────────────────────────

function CotizacionRow({ cotizacion: c }: { cotizacion: CotizacionSerialized }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [expanded, setExpanded]       = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const toggleEstado = () => {
    const nuevoEstado = c.estado === 'pendiente' ? 'atendida' : 'pendiente'
    startTransition(async () => {
      await fetch(`/api/cotizacion/${c.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ estado: nuevoEstado }),
      })
      router.refresh()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await fetch(`/api/cotizacion/${c.id}`, { method: 'DELETE' })
      router.refresh()
    })
  }

  const waText = `Hola ${c.nombre}, recibí tu solicitud de cotización para ${c.destino}. Me comunico para platicarte sobre tu viaje.`
  const waUrl  = `https://wa.me/${c.whatsapp.replace(/\D/g, '') || WA_NUMBER}?text=${encodeURIComponent(waText)}`

  return (
    <>
      <tr
        className={cn(
          'border-b border-crema/5 transition-colors cursor-pointer hover:bg-crema/[0.02]',
          isPending && 'opacity-50',
          expanded && 'bg-crema/[0.02]',
        )}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Cliente */}
        <td className="py-4 pr-4">
          <p className="text-crema/80 text-sm leading-none">{c.nombre}</p>
          <p className="text-plata/40 text-[10px] mt-1">{c.email}</p>
        </td>

        {/* Destino */}
        <td className="py-4 pr-4">
          <span className="text-crema/70 text-sm">{c.destino}</span>
        </td>

        {/* Tipo / Categoría */}
        <td className="py-4 pr-4">
          <span className="text-[10px] tracking-wide text-plata/50 uppercase whitespace-nowrap">
            {c.tipo_viaje}
          </span>
        </td>

        {/* Presupuesto */}
        <td className="py-4 pr-4 whitespace-nowrap">
          <span className="text-[10px] text-plata/50">
            {(PRESUPUESTO_LABELS[c.presupuesto] ?? c.presupuesto) || '–'}
          </span>
        </td>

        {/* Estado */}
        <td className="py-4 pr-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={toggleEstado}
            disabled={isPending}
            className={cn(
              'inline-block px-2 py-0.5 text-[9px] tracking-widest uppercase transition-colors',
              c.estado === 'pendiente'
                ? 'bg-dorado/10 text-dorado hover:bg-dorado/20'
                : 'bg-crema/5 text-plata/40 hover:bg-crema/10',
            )}
          >
            {c.estado}
          </button>
        </td>

        {/* Fecha */}
        <td className="py-4 pr-4 whitespace-nowrap">
          <span className="text-[10px] text-plata/40">
            {formatDate(c.creadoEn)}
          </span>
        </td>

        {/* Acciones */}
        <td className="py-4" onClick={(e) => e.stopPropagation()}>
          {confirmDelete ? (
            <span className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-red-400">¿Eliminar?</span>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="text-[9px] tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={isPending}
                className="text-[9px] tracking-widest uppercase text-plata/40 hover:text-plata transition-colors"
              >
                Cancelar
              </button>
            </span>
          ) : (
            <span className="flex items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] tracking-widest uppercase text-dorado/60 hover:text-dorado transition-colors"
              >
                WhatsApp
              </a>
              <button
                onClick={() => setConfirmDelete(true)}
                disabled={isPending}
                className="text-[9px] tracking-widest uppercase text-plata/30 hover:text-red-400 transition-colors"
              >
                Eliminar
              </button>
            </span>
          )}
        </td>
      </tr>

      {/* Fila expandida — detalles completos */}
      {expanded && (
        <tr className="border-b border-crema/5 bg-negro/40">
          <td colSpan={7} className="px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <DetailItem label="WhatsApp" value={c.whatsapp} />
              <DetailItem label="Categoría" value={c.categoria} />
              <DetailItem
                label="Viajeros"
                value={`${c.adultos} adultos${c.ninos !== '0' ? `, ${c.ninos} niños` : ''}`}
              />
              <DetailItem
                label="Fechas"
                value={[c.fecha_salida, c.fecha_regreso].filter(Boolean).join(' → ') || '–'}
              />
              {c.intereses.length > 0 && (
                <div className="col-span-2">
                  <DetailItem label="Intereses" value={c.intereses.join(', ')} />
                </div>
              )}
              {c.mensaje && (
                <div className="col-span-2 md:col-span-4">
                  <DetailItem label="Mensaje" value={c.mensaje} />
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[9px] tracking-[0.3em] uppercase text-plata/30 mb-1">{label}</p>
      <p className="text-crema/60 text-xs leading-snug">{value}</p>
    </div>
  )
}
