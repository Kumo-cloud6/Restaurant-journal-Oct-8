import type { WishlistItem } from '@/types'
import { supabase } from './client'
import { unwrap } from './errors'
import { buildSummary, getPlace } from './internal'
import type { WishlistEntry } from './models'
import { invalidateSnapshot, loadSnapshot, requireUserId } from './snapshot'

export interface SaveToWishlistInput {
  place_id: string
  source_url?: string | null
  note?: string
}

export async function getWishlist(): Promise<WishlistEntry[]> {
  const s = await loadSnapshot()
  return [...s.wishlist]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((item) => {
      const place = getPlace(s, item.place_id)
      return { item, place, summary: buildSummary(s, place) }
    })
}

/** Idempotent: saving a place twice updates the note/link on the existing item. */
export async function saveToWishlist(input: SaveToWishlistInput): Promise<WishlistItem> {
  const me = await requireUserId()
  const existing = unwrap(
    await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', me)
      .eq('place_id', input.place_id)
      .maybeSingle(),
  ) as WishlistItem | null

  const note = input.note?.trim()
  let item: WishlistItem
  if (existing) {
    item = unwrap(
      await supabase
        .from('wishlist_items')
        .update({
          note: note || existing.note,
          source_url: input.source_url ?? existing.source_url,
        })
        .eq('id', existing.id)
        .select()
        .single(),
    ) as WishlistItem
  } else {
    item = unwrap(
      await supabase
        .from('wishlist_items')
        .insert({
          user_id: me,
          place_id: input.place_id,
          source_url: input.source_url ?? null,
          note: note ?? '',
        })
        .select()
        .single(),
    ) as WishlistItem
  }
  invalidateSnapshot()
  return item
}

export async function removeFromWishlist(placeId: string): Promise<void> {
  const me = await requireUserId()
  unwrap(
    await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', me)
      .eq('place_id', placeId)
      .select(),
  )
  invalidateSnapshot()
}
