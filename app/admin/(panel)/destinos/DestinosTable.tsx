'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { DestinoSerialized } from '@/types/destino'
import { ROUTES } from '@/lib/constants/routes'

interface DestinosTableProps {
  destinos: DestinoSerialized[]
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function DestinosTable({ destinos }: DestinosTableProps) {
  const router = useRouter()

  const refresh = () => router.refresh()

  if (destinos.length === 0) {
    return (
      <div className="border border-crema/10 px-8 py-16 text-center">
        <p className="text-plata text-sm">No hay destinos todavía.</p>
        <Link
          href={ROUTES.admin.destinoNuevo}
          className="mt-4 inline-block text-xs text-dorado hover:text-dorado-claro transition-colors tracking-widest uppercase"
        >
          + Agregar el primero
        </Link>
      </div>
    )
  }

  return (
    <div className="border border-crema/10 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-crema/10">
            {['Nombre', 'País', 'Tipo', 'Etiquetas', 'Estado', 'Acciones'].map((h) => (
              <th
                key={h}
                scope="col"
                className="text-left px-4 py-3 text-[9px] tracking-[0.3em] uppercase text-plata/50 font-light whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {destinos.map((d) => (
            <DestinoRow key={d.id} destino={d} onMutate={refresh} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Fila individual ─────────────────────────────────────────────────────────

interface DestinoRowProps {
  destino: DestinoSerialized
  onMutate: () => void
}

function DestinoRow({ destino: d, onMutate }: DestinoRowProps) {
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleToggle = () => {
    startTransition(async () => {
      await fetch(`/api/destinos/${d.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: !d.activo }),
      })
      onMutate()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await fetch(`/api/destinos/${d.id}`, { method: 'DELETE' })
      setConfirmDelete(false)
      onMutate()
    })
  }

  return (
    <tr
      className={cn(
        'border-b border-crema/5 transition-colors',
        isPending && 'opacity-50',
        !d.activo && 'bg-crema/[0.02]'
      )}
    >
      {/* Nombre */}
      <td className="px-4 py-3 text-crema font-light whitespace-nowrap">
        {d.nombre}
      </td>

      {/* País */}
      <td className="px-4 py-3 text-plata whitespace-nowrap">
        {d.pais}
      </td>

      {/* Tipo */}
      <td className="px-4 py-3 text-plata max-w-[160px] truncate">
        {d.tipo}
      </td>

      {/* Etiquetas */}
      <td className="px-4 py-3">
        <div className="flex gap-1 flex-wrap">
          {d.etiquetas.map((e) => (
            <span
              key={e}
              className="text-[8px] tracking-widest uppercase px-2 py-0.5 bg-dorado/10 text-dorado/70"
            >
              {e}
            </span>
          ))}
        </div>
      </td>

      {/* Estado */}
      <td className="px-4 py-3">
        <span
          className={cn(
            'text-[9px] tracking-widest uppercase px-2 py-1',
            d.activo
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-crema/5 text-plata/40'
          )}
        >
          {d.activo ? 'Activo' : 'Inactivo'}
        </span>
      </td>

      {/* Acciones */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">

          <Link
            href={ROUTES.admin.destinoEditar(d.id)}
            className={cn(
              'text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors duration-200',
              'border-dorado/30 text-dorado/70 hover:text-dorado hover:border-dorado/60',
              isPending && 'pointer-events-none opacity-40',
            )}
          >
            Editar
          </Link>

          <ActionButton
            onClick={handleToggle}
            disabled={isPending}
            aria-label={d.activo ? 'Desactivar destino' : 'Activar destino'}
          >
            {d.activo ? 'Desactivar' : 'Activar'}
          </ActionButton>

          {confirmDelete ? (
            <>
              <ActionButton
                onClick={handleDelete}
                disabled={isPending}
                variant="danger"
                aria-label="Confirmar eliminación"
              >
                {isPending ? '…' : 'Confirmar'}
              </ActionButton>
              <ActionButton
                onClick={() => setConfirmDelete(false)}
                disabled={isPending}
                aria-label="Cancelar eliminación"
              >
                Cancelar
              </ActionButton>
            </>
          ) : (
            <ActionButton
              onClick={() => setConfirmDelete(true)}
              disabled={isPending}
              variant="danger"
              aria-label="Eliminar destino"
            >
              Eliminar
            </ActionButton>
          )}
        </div>
      </td>
    </tr>
  )
}

// ─── Botón de acción reutilizable ────────────────────────────────────────────

interface ActionButtonProps {
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'danger'
  children: React.ReactNode
  'aria-label': string
}

function ActionButton({
  onClick,
  disabled,
  variant = 'default',
  children,
  'aria-label': ariaLabel,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-1',
        disabled && 'opacity-40 cursor-not-allowed',
        variant === 'danger'
          ? 'border-red-500/30 text-red-400 hover:bg-red-500/10 focus-visible:ring-red-500/50'
          : 'border-crema/15 text-plata/70 hover:text-crema hover:border-crema/40 focus-visible:ring-crema/30'
      )}
    >
      {children}
    </button>
  )
}
