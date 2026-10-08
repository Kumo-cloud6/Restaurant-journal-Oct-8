import type { Visit } from '@/types'
import { PHOTO_BUCKET, supabase } from './client'
import { ApiError, toApiError, unwrap } from './errors'
import { invalidateSnapshot, requireUserId } from './snapshot'

export interface LogVisitInput {
  place_id: string
  /** yyyy-mm-dd; defaults to today. */
  visited_on?: string
  /** Data URLs from the photo picker. They are uploaded to Storage and replaced with public URLs. */
  photo_urls: string[]
  dishes: string[]
  tag_ids: string[]
  companion_user_ids: string[]
  note?: string
}

async function uploadPhoto(userId: string, dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('data:')) return dataUrl // already a hosted URL
  const blob = await (await fetch(dataUrl)).blob()
  const path = `${userId}/${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, {
    contentType: blob.type || 'image/jpeg',
    cacheControl: '31536000',
  })
  if (error) throw toApiError(error)
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
}

/** Log a meal. Also clears the place from the wishlist (you made it there!). */
export async function logVisit(input: LogVisitInput): Promise<Visit> {
  if (input.photo_urls.length === 0) {
    throw new ApiError('invalid_input', 'Add at least one photo of your meal.')
  }
  const me = await requireUserId()
  const photo_urls = await Promise.all(input.photo_urls.map((p) => uploadPhoto(me, p)))

  const visit = unwrap(
    await supabase
      .from('visits')
      .insert({
        user_id: me,
        place_id: input.place_id,
        visited_on: input.visited_on,
        photo_urls,
        dishes: input.dishes,
        note: input.note?.trim() ?? '',
      })
      .select()
      .single(),
  ) as Visit

  try {
    const tags = [...new Set(input.tag_ids)].map((tag_id) => ({
      visit_id: visit.id,
      tag_id,
    }))
    const companions = [...new Set(input.companion_user_ids)].map((user_id) => ({
      visit_id: visit.id,
      user_id,
    }))
    if (tags.length) unwrap(await supabase.from('visit_tags').insert(tags).select())
    if (companions.length)
      unwrap(await supabase.from('visit_companions').insert(companions).select())
  } catch (e) {
    // Don't leave a half-saved visit behind.
    await supabase.from('visits').delete().eq('id', visit.id)
    invalidateSnapshot()
    throw e
  }

  await supabase
    .from('wishlist_items')
    .delete()
    .eq('user_id', me)
    .eq('place_id', input.place_id)
  invalidateSnapshot()
  return visit
}
