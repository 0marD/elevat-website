import { ElementType, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface SectionLabelProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  /**
   * Permite usar el elemento semánticamente correcto según el contexto.
   * @example as="p" cuando es descriptivo, as="span" cuando es inline
   */
  as?: ElementType
  className?: string
}

// ─── Componente ─────────────────────────────────────────────────────────────

export default function SectionLabel({
  children,
  as: Tag = 'span',
  className,
  ...props
}: SectionLabelProps) {
  return (
    <Tag
      className={cn(
        'text-xs tracking-widest2 uppercase font-light text-dorado',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
