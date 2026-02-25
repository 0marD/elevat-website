import { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  /** id es obligatorio para vincular el <label> con htmlFor */
  id: string
  label: string
  error?: string
  hint?: string
  /** Aplica al <textarea>; usa wrapperClassName para el contenedor */
  className?: string
  wrapperClassName?: string
}

// ─── Componente ─────────────────────────────────────────────────────────────

export default function Textarea({
  id,
  label,
  error,
  hint,
  required,
  disabled,
  className,
  wrapperClassName,
  ...props
}: TextareaProps) {
  const errorId = `${id}-error`
  const hintId  = `${id}-hint`
  const hasDescription = !!error || !!hint

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>

      <label
        htmlFor={id}
        className={cn(
          'text-xs tracking-widest2 uppercase font-light',
          disabled ? 'text-plata/40' : 'text-plata'
        )}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-dorado">*</span>
        )}
      </label>

      <textarea
        id={id}
        required={required}
        disabled={disabled}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={hasDescription ? (error ? errorId : hintId) : undefined}
        className={cn(
          'bg-transparent border px-4 py-3 text-sm text-crema font-light resize-y',
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

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-400 mt-0.5">
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={hintId} className="text-xs text-plata mt-0.5">
          {hint}
        </p>
      )}
    </div>
  )
}
