import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * The one Supabase client. Only files in src/lib/api/ may import it (ESLint enforces this).
 * Rows are typed by hand against src/types; swap in `supabase gen types` output later if you like.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient = createClient(
  url || 'http://localhost:54321',
  anonKey || 'missing-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true } },
)

export const PHOTO_BUCKET = 'visit-photos'
