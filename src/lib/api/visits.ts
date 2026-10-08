import type { Visit } from '@/types'
import { db } from '@/mocks/db'
import { ApiError } from './errors'
import { currentUserId, getPlace } from './internal'
import { simulate } from './mockRuntime'

export interface LogVisitInput {
  place_id: string
  /** yyyy-mm-dd; defaults to today. */
  visited_on?: string
  photo_urls: string[]
  dishes: string[]
  tag_ids: string[]
  companion_user_ids: string[]
  note?: string
}

const newId = () => `v-${crypto.randomUUID()}`

/** Log a meal. Also clears the place from the wishlist (you made it there!). */
export async function logVisit(input: LogVisitInput): Promise<Visit> {
  return simulate(() => {
    getPlace(input.place_id)
    if (input.photo_urls.length === 0) {
      throw new ApiError('invalid_input', 'Add at least one photo of your meal.')
    }
    const now = new Date()
    const visit: Visit = {
      id: newId(),
      created_at: now.toISOString(),
      user_id: currentUserId(),
      place_id: input.place_id,
      visited_on: input.visited_on ?? now.toISOString().slice(0, 10),
      photo_urls: input.photo_urls,
      dishes: input.dishes,
      note: input.note?.trim() ?? '',
    }
    db.visits.push(visit)
    for (const tag_id of new Set(input.tag_ids))
      db.visitTags.push({ visit_id: visit.id, tag_id })
    for (const user_id of new Set(input.companion_user_ids)) {
      db.visitCompanions.push({ visit_id: visit.id, user_id })
    }
    db.wishlist = db.wishlist.filter(
      (w) => !(w.user_id === currentUserId() && w.place_id === input.place_id),
    )
    return visit
  }, 500)
}
