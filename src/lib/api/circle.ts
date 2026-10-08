import { db } from '@/mocks/db'
import {
  companionsForVisit,
  currentUserId,
  friendIds,
  getPlace,
  getUser,
  newestFirst,
  tagsForVisit,
} from './internal'
import type { CircleOverview, FriendActivity, FriendSummary } from './models'
import { simulate } from './mockRuntime'

function summarize(userId: string): FriendSummary {
  const visits = db.visits.filter((v) => v.user_id === userId).sort(newestFirst)
  const cuisineCounts = new Map<string, number>()
  for (const v of visits) {
    const c = getPlace(v.place_id).cuisine
    cuisineCounts.set(c, (cuisineCounts.get(c) ?? 0) + 1)
  }
  const favorite =
    [...cuisineCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  const last = visits[0]
  return {
    user: getUser(userId),
    log_count: visits.length,
    last_visit: last
      ? { place: getPlace(last.place_id), visited_on: last.visited_on }
      : null,
    favorite_cuisine: favorite,
  }
}

export async function getCircle(): Promise<CircleOverview> {
  return simulate(() => ({
    friends: friendIds()
      .map(summarize)
      .sort((a, b) => b.log_count - a.log_count),
    pending: db.friendships
      .filter((f) => f.status === 'pending' && f.friend_id === currentUserId())
      .map((f) => ({ friendship_id: f.id, user: getUser(f.user_id) })),
  }))
}

/** Recent meals logged by friends (not me), newest first. */
export async function getFriendActivity(limit = 20): Promise<FriendActivity[]> {
  return simulate(() => {
    const friends = new Set(friendIds())
    return db.visits
      .filter((v) => friends.has(v.user_id))
      .sort(newestFirst)
      .slice(0, limit)
      .map((visit) => ({
        visit,
        friend: getUser(visit.user_id),
        place: getPlace(visit.place_id),
        companions: companionsForVisit(visit.id),
        tags: tagsForVisit(visit.id),
      }))
  })
}
