/**
 * Data access layer — the ONLY module the rest of the app uses to read/write data, and the only
 * place that talks to Supabase. Components call these through TanStack Query hooks.
 */
export { ApiError, type ApiErrorCode } from './errors'
export { isSupabaseConfigured } from './client'
export {
  getCurrentUser,
  getSessionUserId,
  onAuthChange,
  signInWithPassword,
  signOut,
  signUpWithEmail,
  type SignUpInput,
} from './auth'
export {
  acceptFriendRequest,
  getCircle,
  getFriendActivity,
  sendFriendRequest,
} from './circle'
export { getJournal, type JournalFilters } from './journal'
export { parseSocialLink } from './links'
export type * from './models'
export {
  getCuisines,
  getPlaceById,
  getPlaces,
  searchPlaces,
  type PlaceFilters,
} from './places'
export { getExperienceTags } from './tags'
export { logVisit, type LogVisitInput } from './visits'
export {
  getWishlist,
  removeFromWishlist,
  saveToWishlist,
  type SaveToWishlistInput,
} from './wishlist'
