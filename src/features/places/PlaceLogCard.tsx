import { PhotoImage } from '@/components/PhotoImage'
import { Avatar } from '@/components/ui/Avatar'
import { Tag } from '@/components/ui/Tag'
import type { PlaceLog } from '@/lib/api'
import { formatDay, joinNames } from '@/lib/format'

/** One friend's (or my) logged meal at a place. */
export function PlaceLogCard({ log, placeName }: { log: PlaceLog; placeName: string }) {
  const { visit, author, companions, tags, is_mine } = log
  const photo = visit.photo_urls[0]
  return (
    <article className="flex gap-4 rounded-[var(--radius-card)] bg-cream p-4 shadow-[var(--shadow-card)] md:p-5">
      {photo && (
        <PhotoImage
          src={photo}
          alt={`${is_mine ? 'Your' : `${author.display_name}’s`} meal at ${placeName}`}
          className="size-24 shrink-0 rounded-2xl md:size-32"
        />
      )}
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-2">
          <Avatar user={author} size="sm" />
          <p className="text-sm">
            <span className="font-semibold">{is_mine ? 'You' : author.display_name}</span>
            <span className="text-soy"> · {formatDay(visit.visited_on)}</span>
          </p>
        </header>
        {visit.note && (
          <p className="mt-2 font-display text-[1.0625rem] leading-snug text-ink italic">
            “{visit.note}”
          </p>
        )}
        {visit.dishes.length > 0 && (
          <p className="mt-2 text-sm text-soy">
            <span className="font-semibold text-ink">Ate:</span> {visit.dishes.join(', ')}
          </p>
        )}
        {companions.length > 0 && (
          <p className="mt-1 text-sm text-soy">
            <span className="font-semibold text-ink">With:</span>{' '}
            {joinNames(companions.map((c) => c.display_name.split(' ')[0]!))}
          </p>
        )}
        {tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Experience tags">
            {tags.map((t) => (
              <li key={t.id}>
                <Tag>{t.label}</Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
