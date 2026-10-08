/**
 * Data access layer — the ONLY module the rest of the app uses to read/write data.
 * Today every function is backed by in-memory mocks; to connect Supabase, replace the bodies
 * in this folder. Signatures and read models (./models) stay the same.
 */
export { ApiError, type ApiErrorCode } from './errors'
export { getCurrentUser, signInWithEmail, signOut } from './auth'
export { getCircle, getFriendActivity } from './circle'
export { getJournal, type JournalFilters } from './journal'
export { parseSocialLink } from './links'
export { isFailureSimulated, setFailureSimulated } from './mockRuntime'
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
