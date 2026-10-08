export interface WishlistItem {
  id: string
  created_at: string
  user_id: string
  place_id: string
  source_url: string | null
  /** "Why I want to try it". */
  note: string
}
