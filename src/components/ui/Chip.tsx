import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  selected: boolean
  onToggle: () => void
}

/** Toggle chip for filters and form pickers (tags, companions). Minimum 44px tall. */
export function Chip({ selected, onToggle, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition active:scale-[0.97]',
        selected
          ? 'border-matcha bg-matcha text-cream'
          : 'border-ink/20 bg-cream text-ink hover:border-ink/45',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
