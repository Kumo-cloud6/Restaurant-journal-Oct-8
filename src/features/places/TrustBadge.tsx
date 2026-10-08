import { Icon } from '@/components/ui/Icon'
import type { PlaceSummary } from '@/lib/api'
import { cn } from '@/lib/cn'

/** "Hype vs. verified": verified = logged by real people in your circle. */
export function TrustBadge({
  summary,
  className,
}: {
  summary: Pick<PlaceSummary, 'trust' | 'friends_visited' | 'visited_by_me'>
  className?: string
}) {
  const friends = summary.friends_visited.length
  const base =
    'inline-flex min-h-7 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm'

  if (summary.trust === 'verified') {
    const label =
      friends > 0
        ? `Verified by ${friends} ${friends === 1 ? 'friend' : 'friends'}`
        : 'Verified by you'
    return (
      <span className={cn(base, 'bg-matcha text-cream', className)}>
        <Icon name="check" size={14} strokeWidth={2.4} />
        {label}
      </span>
    )
  }
  if (summary.trust === 'hyped') {
    return (
      <span
        className={cn(
          base,
          'hatch border border-miso bg-miso-soft text-[#6b4a12]',
          className,
        )}
      >
        <Icon name="sparkle" size={14} />
        Hyped · unverified
      </span>
    )
  }
  return (
    <span className={cn(base, 'border border-ink/25 bg-cream text-soy', className)}>
      No logs yet
    </span>
  )
}
