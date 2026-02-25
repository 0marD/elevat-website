import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  /** id es obligatorio para vincular el <label> con htmlFor */
  id: string
  label: string
  error?: string
  hint?: string
  /** Aplica al <input>; usa wrapperClassName para el contenedor */
  className?: string
  wrapperClassName?: string
}

// ─── Componente ─────────────────────────────────────────────────────────────

export default function Input({
  id,
  label,
  error,
  hint,
  required,
  disabled,
  className,
  wrapperClassName,
  ...props
}: InputProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const hasDescription = !!error || !!hint

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>

      {/* Label ─────────────────────────────────────────────────────────── */}
      <label
        htmlFor={id}
        className={cn(
          'text-xs tracking-widest2 uppercase font-light',
          disabled ? 'text-plata/40' : 'text-plata'
        )}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-dorado">
            *
          </span>
        )}
      </label>

      {/* Input ──────────────────────────────────────────────────────────── */}
      <input
        id={id}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={hasDescription ? (error ? errorId : hintId) : undefined}
        className={cn(
          'bg-transparent border px-4 py-3 text-sm text-crema font-light',
          'transition-colors duration-200',
          'focus-visible:outline-none focus-visible:border-dorado focus-visible:ring-1 focus-visible:ring-dorado',
          'placeholder:text-plata/40',
          error
            ? 'border-red-500/60 focus-visible:border-red-500 focus-visible:ring-red-500/50'
            : 'border-crema/20 hover:border-crema/40',
          disabled && 'opacity-40 cursor-not-allowed',
          className
        )}
        {...props}
      />

      {/* Mensaje de error ───────────────────────────────────────────────── */}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400 mt-0.5">
          {error}
        </p>
      )}

      {/* Texto de ayuda (solo cuando no hay error) ─────────────────────── */}
      {hint && !error && (
        <p id={hintId} className="text-xs text-plata mt-0.5">
          {hint}
        </p>
      )}
    </div>
  )
}
