import type { ExperienceTag, Place, User, Visit } from '@/types'
import { ApiError } from './errors'
import type { PlaceDetail, PlaceLog, PlaceSummary, TagCount, TrustLevel } from './models'
import type { Snapshot } from './snapshot'

/** Pure builders: Snapshot in, read models out. No I/O here. */

export function getUser(s: Snapshot, id: string): User {
  const user = s.users.find((u) => u.id === id)
  if (!user) throw new ApiError('not_found', `User ${id} not found`)
  return user
}

export function getPlace(s: Snapshot, id: string): Place {
  const place = s.places.find((p) => p.id === id)
  if (!place) throw new ApiError('not_found', 'We couldn’t find that place.')
  return place
}

/** Ids of accepted friends (either direction). */
export function friendIds(s: Snapshot): string[] {
  return s.friendships
    .filter(
      (f) => f.status === 'accepted' && (f.user_id === s.me || f.friend_id === s.me),
    )
    .map((f) => (f.user_id === s.me ? f.friend_id : f.user_id))
}

export const circleIds = (s: Snapshot) => new Set([s.me, ...friendIds(s)])

export function tagsForVisit(s: Snapshot, visitId: string): ExperienceTag[] {
  const ids = s.visitTags.filter((vt) => vt.visit_id === visitId).map((vt) => vt.tag_id)
  return s.tags.filter((t) => ids.includes(t.id))
}

export function companionsForVisit(s: Snapshot, visitId: string): User[] {
  return s.visitCompanions
    .filter((vc) => vc.visit_id === visitId)
    .map((vc) => s.users.find((u) => u.id === vc.user_id))
    .filter((u): u is User => Boolean(u))
}

export function toPlaceLog(s: Snapshot, visit: Visit): PlaceLog {
  return {
    visit,
    author: getUser(s, visit.user_id),
    companions: companionsForVisit(s, visit.id),
    tags: tagsForVisit(s, visit.id),
    is_mine: visit.user_id === s.me,
  }
}

export const newestFirst = (a: Visit, b: Visit) =>
  b.visited_on.localeCompare(a.visited_on) || b.created_at.localeCompare(a.created_at)

function countTags(s: Snapshot, visits: Visit[]): TagCount[] {
  const counts = new Map<string, number>()
  for (const v of visits) {
    for (const vt of s.visitTags.filter((x) => x.visit_id === v.id)) {
      counts.set(vt.tag_id, (counts.get(vt.tag_id) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .flatMap(([tagId, count]) => {
      const tag = s.tags.find((t) => t.id === tagId)
      return tag ? [{ tag, count }] : []
    })
    .sort((a, b) => b.count - a.count || a.tag.label.localeCompare(b.tag.label))
}

export function trustFor(place: Place, circleLogCount: number): TrustLevel {
  if (circleLogCount > 0) return 'verified'
  return place.social_buzz > 0 ? 'hyped' : 'unlogged'
}

/** Logs from people in the user's circle for one place, newest first. */
export function circleVisitsFor(s: Snapshot, placeId: string): Visit[] {
  const circle = circleIds(s)
  return s.visits
    .filter((v) => v.place_id === placeId && circle.has(v.user_id))
    .sort(newestFirst)
}

export function buildSummary(s: Snapshot, place: Place): PlaceSummary {
  const visits = circleVisitsFor(s, place.id)
  const friendIdsSeen = [...new Set(visits.map((v) => v.user_id))].filter(
    (id) => id !== s.me,
  )
  // Prefer a friend's note over my own for the card's pull quote.
  const quoteVisit =
    visits.find((v) => v.user_id !== s.me && v.note.trim()) ??
    visits.find((v) => v.note.trim()) ??
    null
  return {
    place,
    trust: trustFor(place, visits.length),
    friends_visited: friendIdsSeen.flatMap(
      (id) => s.users.find((u) => u.id === id) ?? [],
    ),
    visited_by_me: visits.some((v) => v.user_id === s.me),
    circle_log_count: visits.length,
    top_note: quoteVisit ? toPlaceLog(s, quoteVisit) : null,
    top_tags: countTags(s, visits).slice(0, 3),
    on_wishlist: s.wishlist.some((w) => w.place_id === place.id),
  }
}

export function buildDetail(s: Snapshot, place: Place): PlaceDetail {
  const visits = circleVisitsFor(s, place.id)
  return {
    ...buildSummary(s, place),
    all_tags: countTags(s, visits),
    logs: visits.map((v) => toPlaceLog(s, v)),
    wishlist_item: s.wishlist.find((w) => w.place_id === place.id) ?? null,
  }
}
