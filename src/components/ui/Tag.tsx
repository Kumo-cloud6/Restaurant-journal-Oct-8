import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Static label for an experience tag. */
export function Tag({
  children,
  count,
  tone = 'miso',
  className,
}: {
  children: ReactNode
  count?: number
  tone?: 'miso' | 'matcha' | 'plain'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.8125rem] leading-5 font-medium',
        tone === 'miso' && 'bg-miso-soft text-[#6b4a12]',
        tone === 'matcha' && 'bg-matcha-soft text-matcha-deep',
        tone === 'plain' && 'border border-line bg-cream text-soy',
        className,
      )}
    >
      {children}
      {count !== undefined && count > 1 && (
        <span className="rounded-full bg-ink/10 px-1.5 text-[0.6875rem] font-semibold">
          ×{count}
        </span>
      )}
    </span>
  )
}
