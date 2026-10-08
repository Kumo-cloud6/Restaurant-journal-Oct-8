import type { Friendship } from '@/types'
import { supabase } from './client'
import { ApiError, unwrap } from './errors'
import {
  companionsForVisit,
  friendIds,
  getPlace,
  getUser,
  newestFirst,
  tagsForVisit,
} from './internal'
import type { CircleOverview, FriendActivity, FriendSummary } from './models'
import {
  invalidateSnapshot,
  loadSnapshot,
  requireUserId,
  type Snapshot,
} from './snapshot'

function summarize(s: Snapshot, userId: string): FriendSummary {
  const visits = s.visits.filter((v) => v.user_id === userId).sort(newestFirst)
  const cuisineCounts = new Map<string, number>()
  for (const v of visits) {
    const c = getPlace(s, v.place_id).cuisine
    cuisineCounts.set(c, (cuisineCounts.get(c) ?? 0) + 1)
  }
  const favorite =
    [...cuisineCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
  const last = visits[0]
  return {
    user: getUser(s, userId),
    log_count: visits.length,
    last_visit: last
      ? { place: getPlace(s, last.place_id), visited_on: last.visited_on }
      : null,
    favorite_cuisine: favorite,
  }
}

export async function getCircle(): Promise<CircleOverview> {
  const s = await loadSnapshot()
  return {
    friends: friendIds(s)
      .map((id) => summarize(s, id))
      .sort((a, b) => b.log_count - a.log_count),
    pending: s.friendships
      .filter((f) => f.status === 'pending' && f.friend_id === s.me)
      .map((f) => ({ friendship_id: f.id, user: getUser(s, f.user_id) })),
    sent: s.friendships
      .filter((f) => f.status === 'pending' && f.user_id === s.me)
      .map((f) => ({ friendship_id: f.id, user: getUser(s, f.friend_id) })),
  }
}

/** Recent meals logged by friends (not me), newest first. */
export async function getFriendActivity(limit = 20): Promise<FriendActivity[]> {
  const s = await loadSnapshot()
  const friends = new Set(friendIds(s))
  return s.visits
    .filter((v) => friends.has(v.user_id))
    .sort(newestFirst)
    .slice(0, limit)
    .map((visit) => ({
      visit,
      friend: getUser(s, visit.user_id),
      place: getPlace(s, visit.place_id),
      companions: companionsForVisit(s, visit.id),
      tags: tagsForVisit(s, visit.id),
    }))
}

/** Ask someone to join your circle by their @handle. */
export async function sendFriendRequest(handle: string): Promise<void> {
  const me = await requireUserId()
  const clean = handle.trim().replace(/^@/, '').toLowerCase()
  if (!clean) throw new ApiError('invalid_input', 'Enter a handle, like @mollyeats.')

  const target = unwrap(
    await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('handle', clean)
      .maybeSingle(),
  ) as { id: string; display_name: string } | null
  if (!target)
    throw new ApiError('not_found', `We couldn’t find anyone with the handle @${clean}.`)
  if (target.id === me)
    throw new ApiError('invalid_input', 'That’s you! Add someone else.')

  const existing = unwrap(await supabase.from('friendships').select('*')) as Friendship[]
  const dupe = existing.find(
    (f) =>
      (f.user_id === me && f.friend_id === target.id) ||
      (f.user_id === target.id && f.friend_id === me),
  )
  if (dupe) {
    throw new ApiError(
      'invalid_input',
      dupe.status === 'accepted'
        ? `You and ${target.display_name} are already friends.`
        : 'There’s already a pending request with them.',
    )
  }

  unwrap(
    await supabase
      .from('friendships')
      .insert({ user_id: me, friend_id: target.id, status: 'pending' })
      .select(),
  )
  invalidateSnapshot()
}

export async function acceptFriendRequest(friendshipId: string): Promise<void> {
  unwrap(
    await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
      .select(),
  )
  invalidateSnapshot()
}
