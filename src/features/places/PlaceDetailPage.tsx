import { Link, useParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PhotoImage } from '@/components/PhotoImage'
import { QueryBoundary } from '@/components/QueryBoundary'
import { AvatarStack } from '@/components/ui/Avatar'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import { Skeleton } from '@/components/ui/Skeleton'
import { Tag } from '@/components/ui/Tag'
import { useToast } from '@/components/ui/Toast'
import { useRemoveFromWishlist, useSaveToWishlist } from '@/features/journal/hooks'
import type { PlaceDetail } from '@/lib/api'
import { compactCount, joinNames, priceLabel } from '@/lib/format'
import { usePlace } from './hooks'
import { PlaceLogCard } from './PlaceLogCard'
import { TrustBadge } from './TrustBadge'

export function PlaceDetailPage() {
  const { placeId } = useParams()
  const query = usePlace(placeId)

  return (
    <PageContainer>
      <Link
        to="/"
        className="mb-4 -ml-2 inline-flex min-h-11 items-center gap-1 rounded-full px-2 text-sm font-medium text-soy hover:text-ink"
      >
        <Icon name="chevron-left" size={20} />
        Discover
      </Link>
      <QueryBoundary query={query} loading={<DetailSkeleton />} isEmpty={() => false}>
        {(detail) => <PlaceDetailView detail={detail} />}
      </QueryBoundary>
    </PageContainer>
  )
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="aspect-[4/3] w-full md:aspect-[16/7]" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}

function PlaceDetailView({ detail }: { detail: PlaceDetail }) {
  const { place, friends_visited, visited_by_me, logs, all_tags, trust, on_wishlist } =
    detail
  const save = useSaveToWishlist()
  const remove = useRemoveFromWishlist()
  const toast = useToast()
  const busy = save.isPending || remove.isPending

  const toggleWishlist = () => {
    if (on_wishlist) {
      remove.mutate(place.id, {
        onSuccess: () => toast.show('Removed from your wishlist'),
      })
    } else {
      save.mutate(
        { place_id: place.id, source_url: place.source_url },
        { onSuccess: () => toast.show(`Saved ${place.name} to your wishlist`) },
      )
    }
  }

  const friendNames = friends_visited.map((f) => f.display_name.split(' ')[0]!)

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
      <div>
        <div
          className="-mx-4 flex snap-x snap-mandatory scrollbar-none gap-3 overflow-x-auto px-4 md:mx-0 md:px-0"
          role="group"
          aria-label={`Photos of ${place.name}`}
          // Scrollable region must be keyboard reachable.
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          {place.photo_urls.map((url, i) => (
            <PhotoImage
              key={url}
              src={url}
              eager={i === 0}
              alt={
                i === 0
                  ? `${place.name}: ${place.specialty}`
                  : `${place.name}, photo ${i + 1} of ${place.photo_urls.length}`
              }
              className="aspect-[4/3] w-[88%] shrink-0 snap-center rounded-[var(--radius-card)] shadow-[var(--shadow-card)] md:w-[70%] lg:w-[88%]"
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <header>
          <TrustBadge summary={detail} />
          <h1 className="mt-3 text-4xl font-medium md:text-5xl">{place.name}</h1>
          <p className="mt-2 text-lg text-soy">
            {place.specialty} · {priceLabel(place.price_level)}
          </p>
          <p className="mt-3 flex items-start gap-2 text-sm text-soy">
            <Icon name="pin" size={18} className="mt-0.5 shrink-0" />
            <span>
              {place.address}
              <span className="block">{place.neighborhood}</span>
            </span>
          </p>
        </header>

        <div className="sticky bottom-20 z-20 flex gap-3 rounded-full bg-paper/90 p-1 backdrop-blur md:static md:bg-transparent md:p-0">
          <ButtonLink
            to={`/add?mode=log&placeId=${place.id}`}
            icon="camera"
            size="lg"
            className="flex-1"
          >
            Log a visit
          </ButtonLink>
          <Button
            variant={on_wishlist ? 'matcha' : 'secondary'}
            size="lg"
            icon="bookmark"
            onClick={toggleWishlist}
            loading={busy}
            aria-pressed={on_wishlist}
            className="flex-1"
          >
            {on_wishlist ? 'Saved' : 'Save to wishlist'}
          </Button>
        </div>

        <section
          aria-labelledby="trust-heading"
          className="rounded-[var(--radius-card)] bg-cream p-5 shadow-[var(--shadow-card)]"
        >
          <h2 id="trust-heading" className="label-caps mb-3 font-sans text-soy">
            From your circle
          </h2>
          {trust === 'verified' ? (
            <div className="flex items-center gap-3">
              {friends_visited.length > 0 && (
                <AvatarStack users={friends_visited} max={5} size="md" />
              )}
              <p>
                {friends_visited.length > 0 ? (
                  <>
                    <span className="font-semibold">{joinNames(friendNames)}</span> have
                    been
                    {visited_by_me && ', and so have you'}.
                  </>
                ) : (
                  <>You’ve been here. No friends have logged it yet.</>
                )}
              </p>
            </div>
          ) : trust === 'hyped' ? (
            <p>
              <span className="font-semibold">Hyped, not verified.</span> It has{' '}
              {compactCount(place.social_buzz)} views online but no one you know has
              logged a visit.
              {place.source_url && (
                <>
                  {' '}
                  <a
                    href={place.source_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-persimmon-deep underline underline-offset-2"
                  >
                    See the original post
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </>
              )}
            </p>
          ) : (
            <p>
              <span className="font-semibold">A blank slate.</span> No one has logged this
              place yet, and it isn’t blowing up online. Could be a hidden gem.
            </p>
          )}

          {all_tags.length > 0 && (
            <ul
              className="mt-4 flex flex-wrap gap-2"
              aria-label="Experience tags from your circle"
            >
              {all_tags.map(({ tag, count }) => (
                <li key={tag.id}>
                  <Tag count={count}>{tag.label}</Tag>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="text-ink/90">{place.description}</p>
      </div>

      <section aria-labelledby="logs-heading" className="lg:col-span-2">
        <h2 id="logs-heading" className="mb-4 text-3xl font-medium">
          Logs & notes
        </h2>
        {logs.length === 0 ? (
          <EmptyState
            icon="camera"
            title="Be the first from your circle"
            action={
              <ButtonLink to={`/add?mode=log&placeId=${place.id}`} icon="camera">
                Log a visit
              </ButtonLink>
            }
          >
            None of your friends have logged {place.name} yet. Your note could help the
            next person decide.
          </EmptyState>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {logs.map((log) => (
              <li key={log.visit.id}>
                <PlaceLogCard log={log} placeName={place.name} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
