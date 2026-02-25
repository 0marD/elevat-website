import { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

// ─── Variantes ──────────────────────────────────────────────────────────────

const VARIANTS = {
  default: 'border border-crema/10 bg-negro/50',
  elevated: 'border border-crema/10 bg-negro/80 shadow-xl shadow-negro/80',
  interactive: cn(
    'border border-crema/10 bg-negro/50',
    'hover:border-dorado/40 hover:bg-negro/80',
    'cursor-pointer transition-colors duration-300'
  ),
  gold: cn(
    'border border-dorado/30 bg-negro/50',
    'hover:border-dorado/70 transition-colors duration-300'
  ),
} as const

// ─── Tipos ──────────────────────────────────────────────────────────────────

export type CardVariant = keyof typeof VARIANTS

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  /**
   * Permite cambiar el elemento raíz para semántica correcta.
   * @example as="article" para tarjetas de contenido editorial
   */
  as?: ElementType
  children: ReactNode
  className?: string
}

// ─── Componente ─────────────────────────────────────────────────────────────

export default function Card({
  variant = 'default',
  as: Tag = 'div',
  children,
  className,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn('p-6', VARIANTS[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
