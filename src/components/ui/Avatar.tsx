import type { User } from '@/types'
import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'

const sizes = {
  sm: 'size-7 text-[0.6875rem]',
  md: 'size-10 text-sm',
  lg: 'size-16 text-xl',
}

export function Avatar({
  user,
  size = 'md',
  className,
}: {
  user: Pick<User, 'display_name' | 'avatar_url' | 'avatar_color'>
  size?: keyof typeof sizes
  className?: string
}) {
  return user.avatar_url ? (
    <img
      src={user.avatar_url}
      alt={user.display_name}
      className={cn('shrink-0 rounded-full object-cover', sizes[size], className)}
    />
  ) : (
    <span
      role="img"
      aria-label={user.display_name}
      style={{ backgroundColor: user.avatar_color }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-cream',
        sizes[size],
        className,
      )}
    >
      {initials(user.display_name)}
    </span>
  )
}

/** Overlapping avatars with a "+N" overflow. */
export function AvatarStack({
  users,
  max = 4,
  size = 'sm',
}: {
  users: User[]
  max?: number
  size?: 'sm' | 'md'
}) {
  const shown = users.slice(0, max)
  const extra = users.length - shown.length
  return (
    <span className="flex items-center -space-x-2">
      {shown.map((u) => (
        <Avatar key={u.id} user={u} size={size} className="ring-2 ring-cream" />
      ))}
      {extra > 0 && (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-ink text-[0.6875rem] font-semibold text-cream ring-2 ring-cream',
            size === 'sm' ? 'size-7' : 'size-10',
          )}
          aria-label={`and ${extra} more`}
        >
          +{extra}
        </span>
      )}
    </span>
  )
}
