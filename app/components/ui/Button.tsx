import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

// ─── Variantes y tamaños ────────────────────────────────────────────────────

const VARIANTS = {
  gold: cn(
    'border border-dorado text-dorado',
    'hover:bg-dorado hover:text-negro',
    'focus-visible:ring-dorado'
  ),
  solid: cn(
    'bg-dorado text-negro border border-dorado font-normal',
    'hover:bg-dorado-claro hover:border-dorado-claro',
    'focus-visible:ring-dorado'
  ),
  ghost: cn(
    'border border-crema/20 text-crema/70',
    'hover:border-crema/60 hover:text-crema',
    'focus-visible:ring-crema/40'
  ),
  danger: cn(
    'border border-red-500/50 text-red-400',
    'hover:bg-red-500/10 hover:border-red-500',
    'focus-visible:ring-red-500/50'
  ),
} as const

const SIZES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
} as const

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type ButtonVariant = keyof typeof VARIANTS
export type ButtonSize = keyof typeof SIZES

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: ReactNode
}

// ─── Componente ─────────────────────────────────────────────────────────────

export default function Button({
  variant = 'gold',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      disabled={isDisabled}
      aria-busy={isLoading}
      className={cn(
        // Base
        'inline-flex items-center justify-center gap-2',
        'tracking-widest2 uppercase font-light transition-colors duration-200',
        // Focus visible — nunca outline: none sin reemplazo
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-negro',
        VARIANTS[variant],
        SIZES[size],
        isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  )
}

// ─── Spinner interno ────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}
