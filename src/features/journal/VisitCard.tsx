import { Link } from 'react-router-dom'
import { PhotoImage } from '@/components/PhotoImage'
import { Tag } from '@/components/ui/Tag'
import type { JournalEntry } from '@/lib/api'
import { cn } from '@/lib/cn'
import { formatDay, joinNames } from '@/lib/format'

const ratios = ['aspect-[4/5]', 'aspect-square', 'aspect-[4/3]', 'aspect-[5/6]']

/** A tile in the visual timeline. `index` varies the photo ratio for a collage feel. */
export function VisitCard({ entry, index }: { entry: JournalEntry; index: number }) {
  const { visit, place, tags, companions } = entry
  const photo = visit.photo_urls[0]
  return (
    <article className="group relative mb-4 break-inside-avoid overflow-hidden rounded-[var(--radius-card)] bg-cream shadow-[var(--shadow-card)] md:mb-6">
      {photo && (
        <PhotoImage
          src={photo}
          alt={`Your meal at ${place.name}${visit.dishes.length ? `: ${visit.dishes.join(', ')}` : ''}`}
          className={cn('w-full', ratios[index % ratios.length])}
        />
      )}
      <div className="space-y-2 p-4">
        <p className="label-caps text-persimmon-deep">{formatDay(visit.visited_on)}</p>
        <h3 className="text-xl font-medium">
          <Link
            to={`/places/${place.id}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {place.name}
          </Link>
        </h3>
        {visit.note && (
          <p className="font-display text-[0.9375rem] leading-snug text-ink/90 italic">
            “{visit.note}”
          </p>
        )}
        {companions.length > 0 && (
          <p className="text-sm text-soy">
            With {joinNames(companions.map((c) => c.display_name.split(' ')[0]!))}
          </p>
        )}
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Experience tags">
            {tags.slice(0, 3).map((t) => (
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
