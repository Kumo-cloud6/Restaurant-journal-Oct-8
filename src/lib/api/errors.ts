import type { PostgrestError } from '@supabase/supabase-js'

export type ApiErrorCode =
  'not_found' | 'invalid_input' | 'network' | 'unauthorized' | 'unknown'

export class ApiError extends Error {
  readonly code: ApiErrorCode

  constructor(code: ApiErrorCode, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

interface SupabaseLikeError {
  message: string
  code?: string
  status?: number
  name?: string
}

/** Translate any Supabase/Postgres/network error into an ApiError the UI can show. */
export function toApiError(error: PostgrestError | SupabaseLikeError | Error): ApiError {
  if (error instanceof ApiError) return error
  const e = error as SupabaseLikeError
  const code = e.code ?? ''
  if (/failed to fetch|network|load failed/i.test(e.message)) {
    return new ApiError(
      'network',
      'Could not reach the server. Check your connection and try again.',
    )
  }
  if (e.status === 401 || e.status === 403 || code === 'PGRST301' || code === '42501') {
    return new ApiError(
      'unauthorized',
      'You’re signed out or not allowed to do that. Sign in and try again.',
    )
  }
  if (code === '23505') return new ApiError('invalid_input', 'That already exists.')
  if (code === '23503' || code === 'PGRST116') {
    return new ApiError('not_found', 'We couldn’t find that.')
  }
  if (code.startsWith('23'))
    return new ApiError('invalid_input', 'Some of that information isn’t valid.')
  return new ApiError('unknown', 'Something went wrong. Please try again.')
}

/** Throw if a Supabase response carries an error; otherwise return its data. */
export function unwrap<T>(res: { data: T | null; error: PostgrestError | null }): T {
  if (res.error) throw toApiError(res.error)
  return res.data as T
}
