import type { AuthError } from '@supabase/supabase-js'
import type { User } from '@/types'
import { supabase } from './client'
import { ApiError, toApiError, unwrap } from './errors'
import { invalidateSnapshot, requireUserId } from './snapshot'

function authError(error: AuthError): ApiError {
  const known = [
    'invalid_credentials',
    'user_already_exists',
    'email_exists',
    'weak_password',
    'email_not_confirmed',
    'validation_failed',
    'over_request_rate_limit',
    'over_email_send_rate_limit',
  ]
  if (error.code && known.includes(error.code))
    return new ApiError('invalid_input', error.message)
  return toApiError(error)
}

export interface SignUpInput {
  email: string
  password: string
  display_name: string
  handle: string
}

/**
 * Create an account. If your Supabase project requires email confirmation, no session is
 * returned yet and `needs_confirmation` is true.
 */
export async function signUpWithEmail(
  input: SignUpInput,
): Promise<{ needs_confirmation: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
    options: {
      data: {
        display_name: input.display_name.trim(),
        handle: input.handle.trim().toLowerCase(),
      },
    },
  })
  if (error) throw authError(error)
  invalidateSnapshot()
  return { needs_confirmation: !data.session }
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
  if (error) throw authError(error)
  invalidateSnapshot()
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw authError(error)
  invalidateSnapshot()
}

/** Id of the signed-in user, or null. Reads the locally stored session (no network call). */
export async function getSessionUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession()
  return data.session?.user.id ?? null
}

/** Subscribe to sign-in / sign-out. Returns an unsubscribe function. */
export function onAuthChange(callback: (userId: string | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    invalidateSnapshot()
    callback(session?.user.id ?? null)
  })
  return () => data.subscription.unsubscribe()
}

export async function getCurrentUser(): Promise<User> {
  const me = await requireUserId()
  return unwrap<User>(await supabase.from('profiles').select('*').eq('id', me).single())
}
