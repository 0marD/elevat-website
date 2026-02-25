import { cn } from '@/lib/utils/cn'

// ─── Tipos ──────────────────────────────────────────────────────────────────

export interface GoldLineProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

// ─── Componente ─────────────────────────────────────────────────────────────

export default function GoldLine({
  orientation = 'horizontal',
  className,
}: GoldLineProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      aria-hidden="true"
      className={cn(
        'bg-dorado shrink-0',
        isHorizontal ? 'h-px w-16' : 'w-px h-16',
        className
      )}
    />
  )
}
