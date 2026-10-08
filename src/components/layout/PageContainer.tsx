import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function PageContainer({
  children,
  width = 'wide',
  className,
}: {
  children: ReactNode
  width?: 'narrow' | 'wide'
  className?: string
}) {
  return (
    <div
      className={cn(
        'mx-auto animate-rise px-4 pt-6 pb-10 md:px-8 md:pt-10',
        width === 'wide' ? 'max-w-6xl' : 'max-w-2xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
