export type FriendshipStatus = 'accepted' | 'pending'

export interface Friendship {
  id: string
  created_at: string
  user_id: string
  friend_id: string
  status: FriendshipStatus
}
