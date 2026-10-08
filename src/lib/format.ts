const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const dateYear = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})
const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

/** Parse yyyy-mm-dd as a local date (avoids the UTC off-by-one). */
export function parseDay(day: string): Date {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(y!, (m ?? 1) - 1, d ?? 1)
}

export const formatDay = (day: string) => {
  const d = parseDay(day)
  return (d.getFullYear() === new Date().getFullYear() ? date : dateYear).format(d)
}

export const formatMonth = (day: string) => monthYear.format(parseDay(day))

export function formatRelativeDay(day: string, now = new Date()): string {
  const d = parseDay(day)
  const diff = Math.round(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - d.getTime()) /
      86_400_000,
  )
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff} days ago`
  if (diff < 14) return 'Last week'
  return formatDay(day)
}

export const priceLabel = (level: number) => '$'.repeat(level)

export function compactCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function joinNames(names: string[]): string {
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`
}

export function today(): string {
  const d = new Date()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}
