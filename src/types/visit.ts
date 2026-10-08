/** A logged meal. */
export interface Visit {
  id: string
  created_at: string
  user_id: string
  place_id: string
  /** ISO date (yyyy-mm-dd). */
  visited_on: string
  photo_urls: string[]
  dishes: string[]
  note: string
}

/** Join table: tags applied to a visit. */
export interface VisitTag {
  visit_id: string
  tag_id: string
}

/** Join table: who came along. */
export interface VisitCompanion {
  visit_id: string
  user_id: string
}
