import type { User } from '@/types'
import { simulate } from './mockRuntime'
import { getUser, currentUserId } from './internal'

/** Mock auth. Real auth (Supabase Auth) replaces these bodies later. */
export async function getCurrentUser(): Promise<User> {
  return simulate(() => getUser(currentUserId()), 150)
}

export async function signInWithEmail(email: string): Promise<User> {
  void email
  return simulate(() => getUser(currentUserId()), 500)
}

export async function signOut(): Promise<void> {
  return simulate(() => undefined, 150)
}
