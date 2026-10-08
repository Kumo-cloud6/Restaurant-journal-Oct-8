import { companionsForVisit, getPlace, newestFirst, tagsForVisit } from './internal'
import type { JournalEntry } from './models'
import { loadSnapshot } from './snapshot'

export interface JournalFilters {
  cuisine?: string
  tag_id?: string
  companion_id?: string
}

/** My logged meals, newest first. */
export async function getJournal(filters: JournalFilters = {}): Promise<JournalEntry[]> {
  const s = await loadSnapshot()
  return s.visits
    .filter((v) => v.user_id === s.me)
    .sort(newestFirst)
    .map((visit): JournalEntry => ({
      visit,
      place: getPlace(s, visit.place_id),
      companions: companionsForVisit(s, visit.id),
      tags: tagsForVisit(s, visit.id),
    }))
    .filter((e) => !filters.cuisine || e.place.cuisine === filters.cuisine)
    .filter((e) => !filters.tag_id || e.tags.some((t) => t.id === filters.tag_id))
    .filter(
      (e) =>
        !filters.companion_id || e.companions.some((c) => c.id === filters.companion_id),
    )
}
