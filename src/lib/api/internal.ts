import type { ExperienceTag, Place, User, Visit } from '@/types'
import { CURRENT_USER_ID, db } from '@/mocks/db'
import { ApiError } from './errors'
import type { PlaceDetail, PlaceLog, PlaceSummary, TagCount, TrustLevel } from './models'

/** Helpers shared by the API functions. Not exported from the public index. */

export const currentUserId = () => CURRENT_USER_ID

export function getUser(id: string): User {
  const user = db.users.find((u) => u.id === id)
  if (!user) throw new ApiError('not_found', `User ${id} not found`)
  return user
}

export function getPlace(id: string): Place {
  const place = db.places.find((p) => p.id === id)
  if (!place) throw new ApiError('not_found', 'We couldn’t find that place.')
  return place
}

/** Ids of accepted friends (either direction). */
export function friendIds(userId = CURRENT_USER_ID): string[] {
  return db.friendships
    .filter(
      (f) => f.status === 'accepted' && (f.user_id === userId || f.friend_id === userId),
    )
    .map((f) => (f.user_id === userId ? f.friend_id : f.user_id))
}

export const circleIds = () => new Set([CURRENT_USER_ID, ...friendIds()])

export function tagsForVisit(visitId: string): ExperienceTag[] {
  const ids = db.visitTags.filter((vt) => vt.visit_id === visitId).map((vt) => vt.tag_id)
  return db.experienceTags.filter((t) => ids.includes(t.id))
}

export function companionsForVisit(visitId: string): User[] {
  return db.visitCompanions
    .filter((vc) => vc.visit_id === visitId)
    .map((vc) => db.users.find((u) => u.id === vc.user_id))
    .filter((u): u is User => Boolean(u))
}

export function toPlaceLog(visit: Visit): PlaceLog {
  return {
    visit,
    author: getUser(visit.user_id),
    companions: companionsForVisit(visit.id),
    tags: tagsForVisit(visit.id),
    is_mine: visit.user_id === CURRENT_USER_ID,
  }
}

const newestFirst = (a: Visit, b: Visit) =>
  b.visited_on.localeCompare(a.visited_on) || b.created_at.localeCompare(a.created_at)

function countTags(visits: Visit[]): TagCount[] {
  const counts = new Map<string, number>()
  for (const v of visits) {
    for (const vt of db.visitTags.filter((x) => x.visit_id === v.id)) {
      counts.set(vt.tag_id, (counts.get(vt.tag_id) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([tagId, count]) => ({
      tag: db.experienceTags.find((t) => t.id === tagId)!,
      count,
    }))
    .filter((x) => x.tag)
    .sort((a, b) => b.count - a.count || a.tag.label.localeCompare(b.tag.label))
}

export function trustFor(place: Place, circleLogCount: number): TrustLevel {
  if (circleLogCount > 0) return 'verified'
  return place.social_buzz > 0 ? 'hyped' : 'unlogged'
}

/** Logs from people in the user's circle for one place, newest first. */
export function circleVisitsFor(placeId: string): Visit[] {
  const circle = circleIds()
  return db.visits
    .filter((v) => v.place_id === placeId && circle.has(v.user_id))
    .sort(newestFirst)
}

export function buildSummary(place: Place): PlaceSummary {
  const visits = circleVisitsFor(place.id)
  const friendIdsSeen = [...new Set(visits.map((v) => v.user_id))].filter(
    (id) => id !== CURRENT_USER_ID,
  )
  // Prefer a friend's note over my own for the card's pull quote.
  const quoteVisit =
    visits.find((v) => v.user_id !== CURRENT_USER_ID && v.note.trim()) ??
    visits.find((v) => v.note.trim()) ??
    null
  return {
    place,
    trust: trustFor(place, visits.length),
    friends_visited: friendIdsSeen.map(getUser),
    visited_by_me: visits.some((v) => v.user_id === CURRENT_USER_ID),
    circle_log_count: visits.length,
    top_note: quoteVisit ? toPlaceLog(quoteVisit) : null,
    top_tags: countTags(visits).slice(0, 3),
    on_wishlist: db.wishlist.some(
      (w) => w.user_id === CURRENT_USER_ID && w.place_id === place.id,
    ),
  }
}

export function buildDetail(place: Place): PlaceDetail {
  const summary = buildSummary(place)
  const visits = circleVisitsFor(place.id)
  return {
    ...summary,
    all_tags: countTags(visits),
    logs: visits.map(toPlaceLog),
    wishlist_item:
      db.wishlist.find((w) => w.user_id === CURRENT_USER_ID && w.place_id === place.id) ??
      null,
  }
}

export { newestFirst }
