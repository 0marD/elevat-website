'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import type { TestimonioSerialized } from '@/types/testimonio'
import { ROUTES } from '@/lib/constants/routes'


interface TestimoniosTableProps {
  testimonios: TestimonioSerialized[]
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function TestimoniosTable({ testimonios }: TestimoniosTableProps) {
  const router = useRouter()

  // Refresca los datos del server component tras una mutación
  const refresh = () => router.refresh()

  if (testimonios.length === 0) {
    return (
      <div className="border border-crema/10 px-8 py-16 text-center">
        <p className="text-plata text-sm">No hay testimonios todavía.</p>
        <Link
          href={ROUTES.admin.testimonioNuevo}
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
            {['Nombre', 'Ciudad', 'Viaje', 'Calif.', 'Estado', 'Acciones'].map((h) => (
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
          {testimonios.map((t) => (
            <TestimonioRow key={t.id} testimonio={t} onMutate={refresh} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Fila individual con acciones ────────────────────────────────────────────

interface TestimonioRowProps {
  testimonio: TestimonioSerialized
  onMutate: () => void
}

function TestimonioRow({ testimonio: t, onMutate }: TestimonioRowProps) {
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleToggle = () => {
    startTransition(async () => {
      await fetch(`/api/testimonios/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !t.visible }),
      })
      onMutate()
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      await fetch(`/api/testimonios/${t.id}`, { method: 'DELETE' })
      setConfirmDelete(false)
      onMutate()
    })
  }

  return (
    <tr
      className={cn(
        'border-b border-crema/5 transition-colors',
        isPending && 'opacity-50',
        !t.visible && 'bg-crema/[0.02]'
      )}
    >
      {/* Nombre */}
      <td className="px-4 py-3 text-crema font-light whitespace-nowrap">
        {t.nombre}
      </td>

      {/* Ciudad */}
      <td className="px-4 py-3 text-plata whitespace-nowrap">
        {t.ciudad}
      </td>

      {/* Viaje */}
      <td className="px-4 py-3 text-plata max-w-[200px] truncate">
        {t.viaje}
      </td>

      {/* Calificación */}
      <td className="px-4 py-3">
        <Stars value={t.calificacion} />
      </td>

      {/* Estado (badge visible / oculto) */}
      <td className="px-4 py-3">
        <span
          className={cn(
            'text-[9px] tracking-widest uppercase px-2 py-1',
            t.visible
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-crema/5 text-plata/40'
          )}
        >
          {t.visible ? 'Visible' : 'Oculto'}
        </span>
      </td>

      {/* Acciones */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Editar */}
          <Link
            href={ROUTES.admin.testimonioEditar(t.id)}
            className={cn(
              'text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors duration-200',
              'border-dorado/30 text-dorado/70 hover:text-dorado hover:border-dorado/60',
              isPending && 'pointer-events-none opacity-40',
            )}
          >
            Editar
          </Link>

          {/* Toggle visible */}
          <ActionButton
            onClick={handleToggle}
            disabled={isPending}
            aria-label={t.visible ? 'Ocultar testimonio' : 'Mostrar testimonio'}
          >
            {t.visible ? 'Ocultar' : 'Mostrar'}
          </ActionButton>

          {/* Eliminar — con confirmación inline */}
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
              aria-label="Eliminar testimonio"
            >
              Eliminar
            </ActionButton>
          )}
        </div>
      </td>
    </tr>
  )
}

// ─── Botón de acción reutilizable en la tabla ────────────────────────────────

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

// ─── Estrellas de solo lectura ───────────────────────────────────────────────

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`${value} de 5 estrellas`} className="text-dorado tracking-tight">
      {'★'.repeat(value)}
      <span className="text-plata/20">{'★'.repeat(5 - value)}</span>
    </span>
  )
}
