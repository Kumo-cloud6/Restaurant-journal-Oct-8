import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { QueryBoundary } from '@/components/QueryBoundary'
import { ButtonLink } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { EmptyState } from '@/components/ui/EmptyState'
import { Skeleton } from '@/components/ui/Skeleton'
import { Tabs } from '@/components/ui/Tabs'
import { panelId, tabId } from '@/components/ui/tabIds'
import { Button } from '@/components/ui/Button'
import { useCircle } from '@/features/circle/hooks'
import { useCuisines, useExperienceTags } from '@/features/places/hooks'
import type { JournalEntry, JournalFilters } from '@/lib/api'
import { formatMonth } from '@/lib/format'
import { useJournal, useWishlist } from './hooks'
import { VisitCard } from './VisitCard'
import { WishlistView } from './WishlistView'

type TabKey = 'timeline' | 'wishlist'

function groupByMonth(entries: JournalEntry[]) {
  const groups: { month: string; entries: JournalEntry[] }[] = []
  for (const e of entries) {
    const month = formatMonth(e.visit.visited_on)
    const last = groups.at(-1)
    if (last?.month === month) last.entries.push(e)
    else groups.push({ month, entries: [e] })
  }
  return groups
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null
  return (
    <div role="group" aria-label={label} className="flex items-center gap-3">
      <span className="label-caps hidden w-24 shrink-0 text-soy md:block">{label}</span>
      <div className="-mx-4 flex scrollbar-none gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {children}
      </div>
    </div>
  )
}

export function JournalPage() {
  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const tab: TabKey = params.get('tab') === 'wishlist' ? 'wishlist' : 'timeline'
  const filters: JournalFilters = {
    cuisine: params.get('cuisine') ?? undefined,
    tag_id: params.get('tag') ?? undefined,
    companion_id: params.get('with') ?? undefined,
  }
  const hasFilters = Boolean(filters.cuisine || filters.tag_id || filters.companion_id)

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v)
      else next.delete(k)
    }
    setParams(next, { replace: true })
  }
  const toggle = (key: string, value: string) =>
    update({ [key]: params.get(key) === value ? undefined : value })

  const journal = useJournal(filters)
  const wishlist = useWishlist()
  const cuisines = useCuisines()
  const tags = useExperienceTags()
  const circle = useCircle()

  return (
    <PageContainer>
      <PageHeader
        eyebrow="My Journal"
        title="Every meal, remembered"
        action={
          <div className="hidden md:block">
            <ButtonLink to="/add?mode=log" icon="camera">
              Log a meal
            </ButtonLink>
          </div>
        }
      />

      <Tabs
        group="journal"
        label="Journal sections"
        value={tab}
        onChange={(id) => update({ tab: id === 'wishlist' ? 'wishlist' : undefined })}
        tabs={[
          {
            id: 'timeline',
            label: 'Timeline',
            count: journal.data && !hasFilters ? journal.data.length : undefined,
          },
          { id: 'wishlist', label: 'Wishlist', count: wishlist.data?.length },
        ]}
        className="mb-6 w-full md:w-auto"
      />

      {tab === 'timeline' ? (
        <div
          role="tabpanel"
          id={panelId('journal', 'timeline')}
          aria-labelledby={tabId('journal', 'timeline')}
        >
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            aria-controls="journal-filters"
            className="mb-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/20 bg-cream px-4 text-sm font-medium md:hidden"
          >
            Filters
            {hasFilters && (
              <span className="rounded-full bg-persimmon px-2 text-xs font-semibold text-cream">
                {
                  [filters.cuisine, filters.tag_id, filters.companion_id].filter(Boolean)
                    .length
                }
              </span>
            )}
          </button>
          <div
            id="journal-filters"
            className={`mb-6 space-y-3 md:block ${filtersOpen ? 'block' : 'hidden'}`}
          >
            <FilterRow label="Cuisine">
              {cuisines.data?.map((c) => (
                <Chip
                  key={c}
                  selected={filters.cuisine === c}
                  onToggle={() => toggle('cuisine', c)}
                >
                  {c}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="Vibe">
              {tags.data?.map((t) => (
                <Chip
                  key={t.id}
                  selected={filters.tag_id === t.id}
                  onToggle={() => toggle('tag', t.id)}
                >
                  {t.label}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="With">
              {circle.data?.friends.map((f) => (
                <Chip
                  key={f.user.id}
                  selected={filters.companion_id === f.user.id}
                  onToggle={() => toggle('with', f.user.id)}
                >
                  {f.user.display_name.split(' ')[0]}
                </Chip>
              ))}
            </FilterRow>
            {hasFilters && (
              <Button
                variant="ghost"
                onClick={() =>
                  update({ cuisine: undefined, tag: undefined, with: undefined })
                }
              >
                Clear filters
              </Button>
            )}
          </div>

          <QueryBoundary
            query={journal}
            loading={
              <div className="columns-2 gap-4 md:columns-3 md:gap-6">
                {[56, 72, 64, 80, 60, 70].map((h, i) => (
                  <Skeleton
                    key={i}
                    className="mb-4 w-full break-inside-avoid md:mb-6"
                    style={{ height: `${h * 4}px` }}
                  />
                ))}
              </div>
            }
            isEmpty={(d) => d.length === 0}
            empty={
              hasFilters ? (
                <EmptyState
                  icon="search"
                  title="No meals match those filters"
                  action={
                    <Button
                      variant="secondary"
                      onClick={() =>
                        update({ cuisine: undefined, tag: undefined, with: undefined })
                      }
                    >
                      Clear filters
                    </Button>
                  }
                >
                  Try loosening a filter to see more of your journal.
                </EmptyState>
              ) : (
                <EmptyState
                  icon="camera"
                  title="Your journal is waiting"
                  action={
                    <ButtonLink to="/add?mode=log" icon="camera">
                      Log your first meal
                    </ButtonLink>
                  }
                >
                  Snap a photo, tap a few tags, and it lives here, and helps your friends
                  decide.
                </EmptyState>
              )
            }
          >
            {(entries) => {
              let i = 0
              return (
                <div className="space-y-8">
                  {groupByMonth(entries).map((group) => (
                    <section key={group.month} aria-labelledby={`m-${group.month}`}>
                      <h2 id={`m-${group.month}`} className="mb-4 text-2xl font-medium">
                        {group.month}
                      </h2>
                      <ul className="columns-2 gap-4 md:columns-3 md:gap-6">
                        {group.entries.map((entry) => (
                          <li key={entry.visit.id}>
                            <VisitCard entry={entry} index={i++} />
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              )
            }}
          </QueryBoundary>
        </div>
      ) : (
        <div
          role="tabpanel"
          id={panelId('journal', 'wishlist')}
          aria-labelledby={tabId('journal', 'wishlist')}
        >
          <WishlistView />
        </div>
      )}
    </PageContainer>
  )
}
