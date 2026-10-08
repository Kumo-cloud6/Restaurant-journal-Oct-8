import { ApiError } from './errors'

/**
 * Mock-only plumbing: artificial latency and a dev switch to force failures so error states
 * can be tested. Delete this file when the functions are backed by Supabase.
 */
const FAIL_KEY = 'rj:simulate-api-failure'

export function isFailureSimulated(): boolean {
  try {
    return localStorage.getItem(FAIL_KEY) === '1'
  } catch {
    return false
  }
}

export function setFailureSimulated(on: boolean): void {
  try {
    if (on) localStorage.setItem(FAIL_KEY, '1')
    else localStorage.removeItem(FAIL_KEY)
  } catch {
    /* storage unavailable — ignore */
  }
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

/** Runs `fn` after a small delay, like a network call. Throws `ApiError('network')` when failure is simulated. */
export async function simulate<T>(
  fn: () => T,
  ms = 300 + Math.random() * 300,
): Promise<T> {
  await sleep(ms)
  if (isFailureSimulated()) {
    throw new ApiError(
      'network',
      'Could not reach the server. Check your connection and try again.',
    )
  }
  return fn()
}
