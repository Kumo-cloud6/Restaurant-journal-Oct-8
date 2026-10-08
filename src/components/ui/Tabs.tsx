import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { panelId, tabId } from './tabIds'

export interface TabItem<T extends string> {
  id: T
  label: string
  count?: number
  icon?: ReactNode
}

/** Accessible tablist (arrow keys / Home / End). Render your own `role="tabpanel"` with `panelId`. */
export function Tabs<T extends string>({
  group,
  label,
  tabs,
  value,
  onChange,
  className,
}: {
  group: string
  label: string
  tabs: TabItem<T>[]
  value: T
  onChange: (id: T) => void
  className?: string
}) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKeyDown = (e: KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === value)
    let next = i
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return
    e.preventDefault()
    const target = tabs[next]!
    onChange(target.id)
    refs.current[target.id]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn('inline-flex rounded-full bg-ink/8 p-1', className)}
    >
      {tabs.map((t) => {
        const selected = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el
            }}
            role="tab"
            id={tabId(group, t.id)}
            aria-selected={selected}
            aria-controls={panelId(group, t.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={onKeyDown}
            className={cn(
              'inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 text-[0.9375rem] font-medium whitespace-nowrap transition',
              selected ? 'bg-ink text-cream shadow-sm' : 'text-soy hover:text-ink',
            )}
          >
            {t.icon}
            {t.label}
            {t.count !== undefined && (
              <span
                className={cn(
                  'rounded-full px-2 text-xs font-semibold',
                  selected ? 'bg-cream/20' : 'bg-ink/10',
                )}
              >
                {t.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
