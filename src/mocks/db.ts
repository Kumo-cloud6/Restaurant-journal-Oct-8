import type {
  ExperienceTag,
  Friendship,
  Place,
  User,
  Visit,
  VisitCompanion,
  VisitTag,
  WishlistItem,
} from '@/types'
import { friendships } from './seed/friendships'
import { places } from './seed/places'
import { experienceTags } from './seed/tags'
import { CURRENT_USER_ID, users } from './seed/users'
import { visitCompanions, visitTags, visits } from './seed/visits'
import { wishlist } from './seed/wishlist'

/**
 * In-memory "database". Each array is a table, shaped like its future Supabase counterpart.
 * Mutations from src/lib/api/ push into these arrays; a page refresh resets them.
 */
export interface MockDb {
  users: User[]
  experienceTags: ExperienceTag[]
  places: Place[]
  visits: Visit[]
  visitTags: VisitTag[]
  visitCompanions: VisitCompanion[]
  wishlist: WishlistItem[]
  friendships: Friendship[]
}

export const db: MockDb = {
  users: [...users],
  experienceTags: [...experienceTags],
  places: [...places],
  visits: [...visits],
  visitTags: [...visitTags],
  visitCompanions: [...visitCompanions],
  wishlist: [...wishlist],
  friendships: [...friendships],
}

export { CURRENT_USER_ID }
