import { db } from '@/mocks/db'
import {
  companionsForVisit,
  currentUserId,
  getPlace,
  newestFirst,
  tagsForVisit,
} from './internal'
import type { JournalEntry } from './models'
import { simulate } from './mockRuntime'

export interface JournalFilters {
  cuisine?: string
  tag_id?: string
  companion_id?: string
}

/** My logged meals, newest first. */
export async function getJournal(filters: JournalFilters = {}): Promise<JournalEntry[]> {
  return simulate(() =>
    db.visits
      .filter((v) => v.user_id === currentUserId())
      .sort(newestFirst)
      .map((visit): JournalEntry => ({
        visit,
        place: getPlace(visit.place_id),
        companions: companionsForVisit(visit.id),
        tags: tagsForVisit(visit.id),
      }))
      .filter((e) => !filters.cuisine || e.place.cuisine === filters.cuisine)
      .filter((e) => !filters.tag_id || e.tags.some((t) => t.id === filters.tag_id))
      .filter(
        (e) =>
          !filters.companion_id ||
          e.companions.some((c) => c.id === filters.companion_id),
      ),
  )
}
