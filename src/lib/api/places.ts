import { buildDetail, buildSummary, getPlace } from './internal'
import type { PlaceDetail, PlaceSummary, TrustLevel } from './models'
import { loadSnapshot } from './snapshot'

export interface PlaceFilters {
  cuisine?: string
  kind?: 'restaurant' | 'cafe'
  trust?: TrustLevel
  query?: string
}

const TRUST_ORDER: Record<TrustLevel, number> = { verified: 0, hyped: 1, unlogged: 2 }

/** Discover feed: places ranked by how much your circle backs them. */
export async function getPlaces(filters: PlaceFilters = {}): Promise<PlaceSummary[]> {
  const s = await loadSnapshot()
  const q = filters.query?.trim().toLowerCase()
  return s.places
    .filter((p) => !filters.cuisine || p.cuisine === filters.cuisine)
    .filter((p) => !filters.kind || p.kind === filters.kind)
    .filter(
      (p) =>
        !q ||
        [p.name, p.specialty, p.neighborhood, p.cuisine].some((x) =>
          x.toLowerCase().includes(q),
        ),
    )
    .map((p) => buildSummary(s, p))
    .filter((x) => !filters.trust || x.trust === filters.trust)
    .sort(
      (a, b) =>
        TRUST_ORDER[a.trust] - TRUST_ORDER[b.trust] ||
        b.friends_visited.length - a.friends_visited.length ||
        b.circle_log_count - a.circle_log_count ||
        b.place.social_buzz - a.place.social_buzz,
    )
}

export async function getPlaceById(id: string): Promise<PlaceDetail> {
  const s = await loadSnapshot()
  return buildDetail(s, getPlace(s, id))
}

/** Used by the place picker when logging a meal. */
export async function searchPlaces(query: string): Promise<PlaceSummary[]> {
  return getPlaces({ query })
}

export async function getCuisines(): Promise<string[]> {
  const s = await loadSnapshot()
  return [...new Set(s.places.map((p) => p.cuisine))].sort()
}
