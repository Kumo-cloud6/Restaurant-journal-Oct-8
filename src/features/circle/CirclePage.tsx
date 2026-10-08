import { Link } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { PhotoImage } from '@/components/PhotoImage'
import { QueryBoundary } from '@/components/QueryBoundary'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Tag } from '@/components/ui/Tag'
import { formatRelativeDay, joinNames } from '@/lib/format'
import { useCircle, useFriendActivity } from './hooks'

export function CirclePage() {
  const circle = useCircle()
  const activity = useFriendActivity()

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Circle"
        title="The people you trust"
        description="Their logs are what turn a hyped spot into a verified one."
      />

      <section aria-labelledby="friends-heading" className="mb-10">
        <h2 id="friends-heading" className="mb-4 text-2xl font-medium">
          Friends
        </h2>
        <QueryBoundary
          query={circle}
          loading={
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-28" />
              ))}
            </div>
          }
          isEmpty={(d) => d.friends.length === 0 && d.pending.length === 0}
          empty={
            <EmptyState icon="users" title="Your circle is empty">
              Invite friends to see where they eat.
            </EmptyState>
          }
        >
          {({ friends, pending }) => (
            <div className="space-y-4">
              {pending.map(({ friendship_id, user }) => (
                <div
                  key={friendship_id}
                  className="flex items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-miso bg-miso-soft/60 p-4"
                >
                  <Avatar user={user} />
                  <p className="min-w-0 flex-1 text-sm">
                    <span className="font-semibold">{user.display_name}</span> wants to
                    join your circle.
                  </p>
                  <Button
                    variant="secondary"
                    disabled
                    aria-label={`Accept ${user.display_name} (coming soon)`}
                  >
                    Accept
                  </Button>
                </div>
              ))}
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {friends.map((f) => (
                  <li
                    key={f.user.id}
                    className="rounded-[var(--radius-card)] bg-cream p-4 shadow-[var(--shadow-card)]"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar user={f.user} size="md" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{f.user.display_name}</p>
                        <p className="truncate text-xs text-soy">@{f.user.handle}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-soy">
                      <span className="font-semibold text-ink">{f.log_count}</span>{' '}
                      {f.log_count === 1 ? 'log' : 'logs'}
                      {f.favorite_cuisine && <> · mostly {f.favorite_cuisine}</>}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </QueryBoundary>
      </section>

      <section aria-labelledby="activity-heading">
        <h2 id="activity-heading" className="mb-4 text-2xl font-medium">
          Recent logs
        </h2>
        <QueryBoundary
          query={activity}
          loading={
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-40" />
              ))}
            </div>
          }
          isEmpty={(d) => d.length === 0}
          empty={
            <EmptyState icon="camera" title="No activity yet">
              When friends log a meal, it will show up here.
            </EmptyState>
          }
        >
          {(items) => (
            <ul className="grid gap-4 md:grid-cols-2">
              {items.map(({ visit, friend, place, companions, tags }) => (
                <li
                  key={visit.id}
                  className="flex gap-4 rounded-[var(--radius-card)] bg-cream p-4 shadow-[var(--shadow-card)]"
                >
                  {visit.photo_urls[0] && (
                    <PhotoImage
                      src={visit.photo_urls[0]}
                      alt={`${friend.display_name}’s meal at ${place.name}`}
                      className="size-28 shrink-0 rounded-2xl"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm">
                      <Avatar user={friend} size="sm" />
                      <span>
                        <span className="font-semibold">
                          {friend.display_name.split(' ')[0]}
                        </span>{' '}
                        <span className="text-soy">
                          · {formatRelativeDay(visit.visited_on)}
                        </span>
                      </span>
                    </p>
                    <h3 className="mt-1 text-xl font-medium">
                      <Link to={`/places/${place.id}`} className="hover:underline">
                        {place.name}
                      </Link>
                    </h3>
                    {visit.note && (
                      <p className="mt-1 line-clamp-2 font-display text-[0.9375rem] leading-snug italic">
                        “{visit.note}”
                      </p>
                    )}
                    {companions.length > 0 && (
                      <p className="mt-1 text-xs text-soy">
                        With{' '}
                        {joinNames(companions.map((c) => c.display_name.split(' ')[0]!))}
                      </p>
                    )}
                    {tags[0] && (
                      <div className="mt-2">
                        <Tag>{tags[0].label}</Tag>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </QueryBoundary>
      </section>
    </PageContainer>
  )
}
