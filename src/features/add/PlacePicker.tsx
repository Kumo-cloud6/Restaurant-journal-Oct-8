import { useDeferredValue, useId, useState } from 'react'
import { PhotoImage } from '@/components/PhotoImage'
import { Icon } from '@/components/ui/Icon'
import { usePlace, usePlaceSearch } from '@/features/places/hooks'

export function PlacePicker({
  placeId,
  onChange,
}: {
  placeId: string | null
  onChange: (placeId: string | null) => void
}) {
  const inputId = useId()
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  const selected = usePlace(placeId ?? undefined)
  const results = usePlaceSearch(deferred)

  if (placeId) {
    const place = selected.data?.place
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-matcha bg-matcha-soft/50 p-2 pr-3">
        {place ? (
          <PhotoImage
            src={place.cover_photo_url}
            alt=""
            className="size-14 shrink-0 rounded-xl"
          />
        ) : (
          <div className="size-14 shrink-0 animate-shimmer rounded-xl bg-ink/10" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{place?.name ?? 'Loading…'}</p>
          {place && (
            <p className="truncate text-sm text-soy">
              {place.specialty} · {place.neighborhood}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="min-h-11 rounded-full px-3 text-sm font-medium text-persimmon-deep hover:bg-ink/5"
        >
          Change<span className="sr-only"> place</span>
        </button>
      </div>
    )
  }

  const list = results.data?.slice(0, 6) ?? []

  return (
    <div>
      <div className="relative">
        <Icon
          name="search"
          size={20}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-soy"
        />
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for the place…"
          aria-label="Search for the place"
          className="min-h-12 w-full rounded-2xl border border-ink/20 bg-cream pr-4 pl-12 text-base placeholder:text-soy/60 focus-visible:border-persimmon focus-visible:ring-4 focus-visible:ring-persimmon/25 focus-visible:outline-none"
        />
      </div>
      <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-cream">
        {results.isPending && (
          <li className="p-4 text-sm text-soy" role="status">
            Searching…
          </li>
        )}
        {results.isError && (
          <li className="p-4 text-sm text-persimmon-deep" role="alert">
            Couldn’t search places.{' '}
            <button
              type="button"
              className="underline"
              onClick={() => void results.refetch()}
            >
              Retry
            </button>
          </li>
        )}
        {results.isSuccess && list.length === 0 && (
          <li className="p-4 text-sm text-soy">No places match “{deferred}”.</li>
        )}
        {list.map(({ place }) => (
          <li key={place.id}>
            <button
              type="button"
              onClick={() => onChange(place.id)}
              className="flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left hover:bg-miso-soft/50"
            >
              <PhotoImage
                src={place.cover_photo_url}
                alt=""
                className="size-11 shrink-0 rounded-lg"
              />
              <span className="min-w-0">
                <span className="block truncate font-medium">{place.name}</span>
                <span className="block truncate text-sm text-soy">
                  {place.specialty} · {place.neighborhood}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
