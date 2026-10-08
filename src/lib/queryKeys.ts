import type { JournalFilters, PlaceFilters } from '@/lib/api'

/** Central query keys so mutations can invalidate precisely. */
export const queryKeys = {
  currentUser: ['current-user'] as const,
  places: {
    all: ['places'] as const,
    list: (filters: PlaceFilters) => ['places', 'list', filters] as const,
    detail: (id: string) => ['places', 'detail', id] as const,
    search: (query: string) => ['places', 'search', query] as const,
    cuisines: ['places', 'cuisines'] as const,
  },
  tags: ['experience-tags'] as const,
  journal: {
    all: ['journal'] as const,
    list: (filters: JournalFilters) => ['journal', 'list', filters] as const,
  },
  wishlist: ['wishlist'] as const,
  circle: {
    overview: ['circle', 'overview'] as const,
    activity: ['circle', 'activity'] as const,
  },
}
