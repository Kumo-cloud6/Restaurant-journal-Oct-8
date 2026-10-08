import { Link } from 'react-router-dom'
import { PhotoImage } from '@/components/PhotoImage'
import { QueryBoundary } from '@/components/QueryBoundary'
import { Button, ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { TrustBadge } from '@/features/places/TrustBadge'
import { formatDay } from '@/lib/format'
import { useRemoveFromWishlist, useWishlist } from './hooks'

function sourceLabel(url: string | null): string | null {
  if (!url) return null
  if (url.includes('tiktok.com')) return 'TikTok'
  if (url.includes('instagram.com')) return 'Instagram'
  return 'Link'
}

export function WishlistView() {
  const query = useWishlist()
  const remove = useRemoveFromWishlist()
  const toast = useToast()

  return (
    <QueryBoundary
      query={query}
      loading={
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      }
      isEmpty={(d) => d.length === 0}
      empty={
        <EmptyState
          icon="bookmark"
          title="Your wishlist is empty"
          action={
            <ButtonLink to="/add?mode=save" icon="link">
              Save a spot
            </ButtonLink>
          }
        >
          Paste a TikTok or Instagram link and jot down why you want to try it.
        </EmptyState>
      }
    >
      {(items) => (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map(({ item, place, summary }) => {
            const source = sourceLabel(item.source_url)
            return (
              <li
                key={item.id}
                className="flex gap-4 rounded-[var(--radius-card)] bg-cream p-4 shadow-[var(--shadow-card)]"
              >
                <PhotoImage
                  src={place.cover_photo_url}
                  alt={`${place.name}: ${place.specialty}`}
                  className="size-28 shrink-0 rounded-2xl md:size-32"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <TrustBadge summary={summary} className="self-start" />
                  <h3 className="text-xl font-medium">
                    <Link to={`/places/${place.id}`} className="hover:underline">
                      {place.name}
                    </Link>
                  </h3>
                  {item.note && (
                    <p className="font-display text-[0.9375rem] leading-snug italic">
                      “{item.note}”
                    </p>
                  )}
                  <p className="text-xs text-soy">
                    Saved {formatDay(item.created_at.slice(0, 10))}
                    {source && ` from ${source}`}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-1">
                    <ButtonLink
                      to={`/add?mode=log&placeId=${place.id}`}
                      size="md"
                      icon="camera"
                      className="min-h-11"
                    >
                      Log it
                    </ButtonLink>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        remove.mutate(place.id, {
                          onSuccess: () => toast.show(`Removed ${place.name}`),
                        })
                      }
                      aria-label={`Remove ${place.name} from wishlist`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </QueryBoundary>
  )
}
