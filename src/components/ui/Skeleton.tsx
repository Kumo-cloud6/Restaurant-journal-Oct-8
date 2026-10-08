import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

/** Pulsing placeholder block. Decorative: pair with a live region saying "Loading". */
export function Skeleton({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      aria-hidden
      style={style}
      className={cn('animate-shimmer rounded-xl bg-ink/10', className)}
    />
  )
}
