export interface User {
  id: string
  created_at: string
  display_name: string
  handle: string
  avatar_url: string | null
  /** Tint used for the generated initials avatar. */
  avatar_color: string
  home_city: string
  bio: string
}
