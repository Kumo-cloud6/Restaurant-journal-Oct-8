import type { Friendship } from '@/types'

const f = (
  id: string,
  user_id: string,
  friend_id: string,
  status: Friendship['status'],
): Friendship => ({
  id,
  created_at: '2026-02-15T12:00:00Z',
  user_id,
  friend_id,
  status,
})

export const friendships: Friendship[] = [
  f('fr-1', 'u-molly', 'u-priya', 'accepted'),
  f('fr-2', 'u-molly', 'u-jen', 'accepted'),
  f('fr-3', 'u-molly', 'u-marcus', 'accepted'),
  f('fr-4', 'u-molly', 'u-hana', 'accepted'),
  // Dev asked to join Molly's circle.
  f('fr-5', 'u-dev', 'u-molly', 'pending'),
]
