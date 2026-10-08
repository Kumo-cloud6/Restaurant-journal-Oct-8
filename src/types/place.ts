export type PlaceKind = 'restaurant' | 'cafe'
export type PlaceSource = 'social' | 'user'

export interface Place {
  id: string
  created_at: string
  name: string
  /** Cuisine family used for filtering: Chinese, Japanese, Korean, ... */
  cuisine: string
  /** Free-text specialty shown on cards, e.g. "Lanzhou noodles". */
  specialty: string
  kind: PlaceKind
  address: string
  neighborhood: string
  lat: number
  lng: number
  /** 1 = $, 4 = $$$$ */
  price_level: 1 | 2 | 3 | 4
  cover_photo_url: string
  photo_urls: string[]
  description: string
  source: PlaceSource
  /** Original TikTok/Instagram link, when the place was discovered on social. */
  source_url: string | null
  /** How the place surfaced in social feeds; drives the "hype" signal. */
  social_buzz: number
}

/** Join table: aggregated experience tags per place. */
export interface PlaceTag {
  place_id: string
  tag_id: string
  vote_count: number
}
