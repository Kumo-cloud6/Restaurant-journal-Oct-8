import type { ExperienceTag, Place, User, Visit, WishlistItem } from '@/types'

/**
 * Read models: what screens consume. These replace the joins/views Supabase will do later.
 */

/**
 * - `verified`: someone in your circle (or you) visited and logged it
 * - `hyped`: buzzing on social, but nobody you know has logged it
 * - `unlogged`: no buzz and no logs — a blank slate
 */
export type TrustLevel = 'verified' | 'hyped' | 'unlogged'

export interface TagCount {
  tag: ExperienceTag
  count: number
}

export interface PlaceLog {
  visit: Visit
  author: User
  companions: User[]
  tags: ExperienceTag[]
  is_mine: boolean
}

export interface PlaceSummary {
  place: Place
  trust: TrustLevel
  /** Distinct friends who have logged a visit (excludes the current user). */
  friends_visited: User[]
  visited_by_me: boolean
  /** Number of logs from the circle, including mine. */
  circle_log_count: number
  top_note: PlaceLog | null
  top_tags: TagCount[]
  on_wishlist: boolean
}

export interface PlaceDetail extends PlaceSummary {
  all_tags: TagCount[]
  logs: PlaceLog[]
  wishlist_item: WishlistItem | null
}

export interface JournalEntry {
  visit: Visit
  place: Place
  companions: User[]
  tags: ExperienceTag[]
}

export interface FriendActivity {
  visit: Visit
  friend: User
  place: Place
  companions: User[]
  tags: ExperienceTag[]
}

export interface FriendSummary {
  user: User
  log_count: number
  last_visit: { place: Place; visited_on: string } | null
  favorite_cuisine: string | null
}

export interface PendingRequest {
  friendship_id: string
  user: User
}

export interface CircleOverview {
  friends: FriendSummary[]
  /** Requests other people sent me. */
  pending: PendingRequest[]
  /** Requests I sent that haven't been accepted yet. */
  sent: PendingRequest[]
}

export interface WishlistEntry {
  item: WishlistItem
  place: Place
  summary: PlaceSummary
}

export interface ParsedLink {
  platform: 'tiktok' | 'instagram'
  url: string
  creator: string
  caption: string
  /** Best guess at the place the post is about. */
  place: Place
  /** Where the place stands with your circle right now. */
  summary: PlaceSummary
}
