import { Link } from 'react-router-dom'
import { PhotoImage } from '@/components/PhotoImage'
import { AvatarStack } from '@/components/ui/Avatar'
import { Tag } from '@/components/ui/Tag'
import type { PlaceSummary } from '@/lib/api'
import { compactCount, joinNames, priceLabel } from '@/lib/format'
import { TrustBadge } from './TrustBadge'
import { WishlistIconButton } from './WishlistButton'

export function PlaceCard({ summary }: { summary: PlaceSummary }) {
  const { place, trust, friends_visited, top_note, top_tags } = summary
  const friendNames = friends_visited.map((f) => f.display_name.split(' ')[0]!)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-cream shadow-[var(--shadow-card)] transition hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <PhotoImage
          src={place.cover_photo_url}
          alt={`${place.name}: ${place.specialty}`}
          className="size-full transition duration-500 group-hover:scale-[1.03]"
        />
        <TrustBadge summary={summary} className="absolute top-3 left-3" />
        <WishlistIconButton
          placeId={place.id}
          placeName={place.name}
          saved={summary.on_wishlist}
          className="absolute top-2 right-2"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="text-2xl font-medium">
            <Link
              to={`/places/${place.id}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {place.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-soy">
            {place.specialty} · {place.neighborhood} · {priceLabel(place.price_level)}
          </p>
        </div>

        {trust === 'verified' && (
          <div className="flex items-center gap-2.5">
            {friends_visited.length > 0 ? (
              <>
                <AvatarStack users={friends_visited} />
                <p className="text-sm text-ink">
                  <span className="font-semibold">
                    {joinNames(friendNames.slice(0, 2))}
                  </span>
                  {friendNames.length > 2 && ` +${friendNames.length - 2}`} been
                </p>
              </>
            ) : (
              <p className="text-sm text-ink">You’ve been</p>
            )}
          </div>
        )}

        {trust === 'verified' && top_note && (
          <blockquote className="border-l-2 border-persimmon/60 pl-3 font-display text-[1.0625rem] leading-snug text-ink italic">
            “{top_note.visit.note}”
            <footer className="mt-1 font-sans text-xs text-soy not-italic">
              {top_note.is_mine ? 'You' : top_note.author.display_name.split(' ')[0]}
            </footer>
          </blockquote>
        )}

        {trust === 'hyped' && (
          <p className="text-sm text-soy">
            Everywhere on your feed ({compactCount(place.social_buzz)} views), but{' '}
            <span className="font-semibold text-ink">
              no one in your circle has logged it.
            </span>
          </p>
        )}

        {trust === 'unlogged' && (
          <p className="text-sm text-soy">
            Nobody has logged this yet. Be the first from your circle.
          </p>
        )}

        {top_tags.length > 0 && (
          <ul
            className="mt-auto flex flex-wrap gap-1.5 pt-1"
            aria-label="Experience tags"
          >
            {top_tags.map(({ tag, count }) => (
              <li key={tag.id}>
                <Tag count={count}>{tag.label}</Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export function PlaceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-cream shadow-[var(--shadow-card)]">
      <div className="aspect-[4/3] animate-shimmer bg-ink/10" aria-hidden />
      <div className="space-y-3 p-5" aria-hidden>
        <div className="h-7 w-2/3 animate-shimmer rounded-lg bg-ink/10" />
        <div className="h-4 w-1/2 animate-shimmer rounded bg-ink/10" />
        <div className="h-12 animate-shimmer rounded-lg bg-ink/10" />
      </div>
    </div>
  )
}
