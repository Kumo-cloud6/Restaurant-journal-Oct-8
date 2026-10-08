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
import { supabase } from './client'
import { ApiError, unwrap } from './errors'
import { placeholderPhotosFor } from './placeholderPhotos'

/**
 * Everything the read models are built from, as seen by the signed-in user (row-level security
 * already limits visits to you + accepted friends). The data set is small, so each screen loads a
 * snapshot and the pure builders in internal.ts derive summaries from it.
 *
 * When this outgrows the browser, replace the builders with SQL views or RPC functions and keep
 * the read models in models.ts unchanged.
 */
export interface Snapshot {
  me: string
  users: User[]
  tags: ExperienceTag[]
  places: Place[]
  visits: Visit[]
  visitTags: VisitTag[]
  visitCompanions: VisitCompanion[]
  wishlist: WishlistItem[]
  friendships: Friendship[]
}

export async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new ApiError('unauthorized', 'Please sign in again.')
  const id = data.session?.user.id
  if (!id) throw new ApiError('unauthorized', 'Please sign in to continue.')
  return id
}

function withPhotos(place: Place): Place {
  if (place.cover_photo_url && place.photo_urls.length > 0) return place
  const fallback = placeholderPhotosFor(place)
  return {
    ...place,
    cover_photo_url: place.cover_photo_url ?? fallback.cover,
    photo_urls: place.photo_urls.length > 0 ? place.photo_urls : fallback.gallery,
  }
}

async function load(): Promise<Snapshot> {
  const me = await requireUserId()
  const [users, tags, places, visits, visitTags, visitCompanions, wishlist, friendships] =
    await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('experience_tags').select('*').order('created_at'),
      supabase.from('places').select('*').order('created_at'),
      supabase.from('visits').select('*'),
      supabase.from('visit_tags').select('*'),
      supabase.from('visit_companions').select('*'),
      supabase.from('wishlist_items').select('*').eq('user_id', me),
      supabase.from('friendships').select('*'),
    ])
  return {
    me,
    users: unwrap(users) as User[],
    tags: unwrap(tags) as ExperienceTag[],
    places: (unwrap(places) as Place[]).map(withPhotos),
    visits: unwrap(visits) as Visit[],
    visitTags: unwrap(visitTags) as VisitTag[],
    visitCompanions: unwrap(visitCompanions) as VisitCompanion[],
    wishlist: unwrap(wishlist) as WishlistItem[],
    friendships: unwrap(friendships) as Friendship[],
  }
}

// Screens fire several queries at once; share one load between them for a moment.
let inflight: { at: number; promise: Promise<Snapshot> } | null = null
const SHARE_MS = 1500

export function loadSnapshot(): Promise<Snapshot> {
  if (inflight && Date.now() - inflight.at < SHARE_MS) return inflight.promise
  const promise = load()
  inflight = { at: Date.now(), promise }
  promise.catch(() => {
    if (inflight?.promise === promise) inflight = null
  })
  return promise
}

/** Call after any write so the next read sees it. */
export function invalidateSnapshot(): void {
  inflight = null
}
