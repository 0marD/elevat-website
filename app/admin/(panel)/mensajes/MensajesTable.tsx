'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

interface MensajeRow {
  id:       string
  nombre:   string
  contacto: string
  mensaje:  string
  leido:    boolean
  creadoEn: string
}

interface Props {
  mensajes: MensajeRow[]
}

export default function MensajesTable({ mensajes }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  if (mensajes.length === 0) {
    return (
      <p className="text-plata/40 text-sm tracking-wide py-10 text-center">
        Aún no hay mensajes recibidos.
      </p>
    )
  }

  const toggleLeido = async (id: string, leido: boolean) => {
    setLoadingId(id)
    await fetch(`/api/contacto/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leido: !leido }),
    })
    setLoadingId(null)
    startTransition(() => router.refresh())
  }

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    setLoadingId(id)
    await fetch(`/api/contacto/${id}`, { method: 'DELETE' })
    setLoadingId(null)
    startTransition(() => router.refresh())
  }

  return (
    <div className="space-y-3" aria-busy={pending}>
      {mensajes.map(m => (
        <article
          key={m.id}
          className={cn(
            'border px-6 py-5 transition-colors',
            m.leido ? 'border-crema/10' : 'border-dorado/30 bg-dorado/[0.02]',
          )}
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {!m.leido && (
                  <span className="text-[9px] tracking-[0.3em] uppercase text-dorado border border-dorado/40 px-2 py-0.5">
                    Nuevo
                  </span>
                )}
                <p className="text-crema text-sm font-medium">{m.nombre}</p>
              </div>
              <p className="text-plata/60 text-xs">{m.contacto}</p>
              <p className="text-[10px] text-plata/30 tracking-wide">
                {new Date(m.creadoEn).toLocaleString('es-MX', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toggleLeido(m.id, m.leido)}
                disabled={loadingId === m.id}
                aria-label={m.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                className={cn(
                  'text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors',
                  m.leido
                    ? 'border-crema/20 text-plata/50 hover:text-crema hover:border-crema/40'
                    : 'border-dorado/30 text-dorado hover:bg-dorado/10',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                )}
              >
                {m.leido ? 'No leído' : 'Leído'}
              </button>

              <button
                onClick={() => eliminar(m.id)}
                disabled={loadingId === m.id}
                aria-label="Eliminar mensaje"
                className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-transparent text-plata/30 hover:text-red-400 hover:border-red-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Eliminar
              </button>
            </div>
          </div>

          <p className="mt-4 text-plata/70 text-sm leading-relaxed whitespace-pre-wrap">
            {m.mensaje}
          </p>
        </article>
      ))}
    </div>
  )
}
