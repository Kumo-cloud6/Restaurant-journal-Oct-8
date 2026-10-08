import type { WishlistItem } from '@/types'
import { db } from '@/mocks/db'
import { ApiError } from './errors'
import { buildSummary, currentUserId, getPlace } from './internal'
import type { WishlistEntry } from './models'
import { simulate } from './mockRuntime'

export interface SaveToWishlistInput {
  place_id: string
  source_url?: string | null
  note?: string
}

export async function getWishlist(): Promise<WishlistEntry[]> {
  return simulate(() =>
    db.wishlist
      .filter((w) => w.user_id === currentUserId())
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((item) => {
        const place = getPlace(item.place_id)
        return { item, place, summary: buildSummary(place) }
      }),
  )
}

/** Idempotent: saving a place twice updates the note/link on the existing item. */
export async function saveToWishlist(input: SaveToWishlistInput): Promise<WishlistItem> {
  return simulate(() => {
    getPlace(input.place_id)
    const existing = db.wishlist.find(
      (w) => w.user_id === currentUserId() && w.place_id === input.place_id,
    )
    if (existing) {
      existing.note = input.note?.trim() || existing.note
      existing.source_url = input.source_url ?? existing.source_url
      return existing
    }
    const item: WishlistItem = {
      id: `w-${crypto.randomUUID()}`,
      created_at: new Date().toISOString(),
      user_id: currentUserId(),
      place_id: input.place_id,
      source_url: input.source_url ?? null,
      note: input.note?.trim() ?? '',
    }
    db.wishlist.push(item)
    return item
  }, 350)
}

export async function removeFromWishlist(placeId: string): Promise<void> {
  return simulate(() => {
    const before = db.wishlist.length
    db.wishlist = db.wishlist.filter(
      (w) => !(w.user_id === currentUserId() && w.place_id === placeId),
    )
    if (db.wishlist.length === before)
      throw new ApiError('not_found', 'That spot isn’t saved.')
  }, 300)
}
