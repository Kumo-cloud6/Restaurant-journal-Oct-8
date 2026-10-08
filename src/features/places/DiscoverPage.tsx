import { useDeferredValue, useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryBoundary } from '@/components/QueryBoundary'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Icon } from '@/components/ui/Icon'
import type { PlaceFilters } from '@/lib/api'
import { PlaceCard, PlaceCardSkeleton } from './PlaceCard'
import { useCuisines, usePlaces } from './hooks'

export function DiscoverPage() {
  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState<string | undefined>()
  const [kind, setKind] = useState<PlaceFilters['kind']>()
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const deferredQuery = useDeferredValue(query)

  const filters: PlaceFilters = {
    query: deferredQuery || undefined,
    cuisine,
    kind,
    trust: verifiedOnly ? 'verified' : undefined,
  }
  const places = usePlaces(filters)
  const cuisines = useCuisines()
  const hasFilters = Boolean(query || cuisine || kind || verifiedOnly)

  const clear = () => {
    setQuery('')
    setCuisine(undefined)
    setKind(undefined)
    setVerifiedOnly(false)
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Boston · Asian restaurants & cafes"
        title="Where your people actually eat"
        description="Skip the hype. See who in your circle has been, what they said, and what it felt like."
      />

      <div className="mb-6 space-y-3">
        <div className="relative max-w-xl">
          <label htmlFor="discover-search" className="sr-only">
            Search places, cuisines or neighborhoods
          </label>
          <Icon
            name="search"
            size={20}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-soy"
          />
          <input
            id="discover-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ramen, Chinatown, matcha…"
            className="min-h-12 w-full rounded-full border border-ink/20 bg-cream pr-4 pl-12 text-base placeholder:text-soy/60 focus-visible:border-persimmon focus-visible:ring-4 focus-visible:ring-persimmon/25 focus-visible:outline-none"
          />
        </div>

        <div
          role="group"
          aria-label="Filters"
          className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
        >
          <Chip selected={verifiedOnly} onToggle={() => setVerifiedOnly((v) => !v)}>
            <Icon name="check" size={16} />
            Verified by friends
          </Chip>
          <Chip
            selected={kind === 'cafe'}
            onToggle={() => setKind(kind === 'cafe' ? undefined : 'cafe')}
          >
            <Icon name="cup" size={16} />
            Cafes
          </Chip>
          {cuisines.data?.map((c) => (
            <Chip
              key={c}
              selected={cuisine === c}
              onToggle={() => setCuisine(cuisine === c ? undefined : c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </div>

      <QueryBoundary
        query={places}
        loading={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <PlaceCardSkeleton key={i} />
            ))}
          </div>
        }
        isEmpty={(d) => d.length === 0}
        empty={
          <EmptyState
            icon="search"
            title="No spots match"
            action={
              hasFilters ? (
                <Button variant="secondary" onClick={clear}>
                  Clear filters
                </Button>
              ) : undefined
            }
          >
            Try a different cuisine, or save a spot you saw on TikTok or Instagram.
          </EmptyState>
        }
      >
        {(data) => (
          <>
            <p className="sr-only" role="status">
              {data.length} places
            </p>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((s) => (
                <li key={s.place.id} className="flex">
                  <div className="flex-1">
                    <PlaceCard summary={s} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </QueryBoundary>
    </PageContainer>
  )
}
