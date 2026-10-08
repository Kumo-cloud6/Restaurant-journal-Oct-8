import { db } from '@/mocks/db'
import { simulate } from './mockRuntime'
import { buildDetail, buildSummary, getPlace } from './internal'
import type { PlaceDetail, PlaceSummary, TrustLevel } from './models'

export interface PlaceFilters {
  cuisine?: string
  kind?: 'restaurant' | 'cafe'
  trust?: TrustLevel
  query?: string
}

const TRUST_ORDER: Record<TrustLevel, number> = { verified: 0, hyped: 1, unlogged: 2 }

/** Discover feed: places ranked by how much your circle backs them. */
export async function getPlaces(filters: PlaceFilters = {}): Promise<PlaceSummary[]> {
  return simulate(() => {
    const q = filters.query?.trim().toLowerCase()
    return db.places
      .filter((p) => !filters.cuisine || p.cuisine === filters.cuisine)
      .filter((p) => !filters.kind || p.kind === filters.kind)
      .filter(
        (p) =>
          !q ||
          [p.name, p.specialty, p.neighborhood, p.cuisine].some((s) =>
            s.toLowerCase().includes(q),
          ),
      )
      .map(buildSummary)
      .filter((s) => !filters.trust || s.trust === filters.trust)
      .sort(
        (a, b) =>
          TRUST_ORDER[a.trust] - TRUST_ORDER[b.trust] ||
          b.friends_visited.length - a.friends_visited.length ||
          b.circle_log_count - a.circle_log_count ||
          b.place.social_buzz - a.place.social_buzz,
      )
  })
}

export async function getPlaceById(id: string): Promise<PlaceDetail> {
  return simulate(() => buildDetail(getPlace(id)))
}

/** Plain list used by pickers (place search when logging a meal). */
export async function searchPlaces(query: string): Promise<PlaceSummary[]> {
  return getPlaces({ query })
}

export async function getCuisines(): Promise<string[]> {
  return simulate(() => [...new Set(db.places.map((p) => p.cuisine))].sort(), 150)
}
