import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  getSessionUserId,
  onAuthChange,
  signInWithPassword,
  signOut as apiSignOut,
  signUpWithEmail,
  type SignUpInput,
} from '@/lib/api'

type Status = 'loading' | 'signedOut' | 'signedIn'

interface AuthState {
  status: Status
  signedIn: boolean
  signIn: (email: string, password: string) => Promise<void>
  /** Resolves `needsConfirmation: true` when the project requires a confirmed email first. */
  signUp: (input: SignUpInput) => Promise<{ needsConfirmation: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

/** Mirrors the Supabase session (via the API layer) into React state. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('loading')
  const queryClient = useQueryClient()
  const lastUser = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    const apply = (userId: string | null) => {
      // A different person (or nobody) is signed in: never show the previous user's cached data.
      if (lastUser.current !== undefined && lastUser.current !== userId)
        queryClient.clear()
      lastUser.current = userId
      setStatus(userId ? 'signedIn' : 'signedOut')
    }
    void getSessionUserId()
      .then(apply)
      .catch(() => apply(null))
    return onAuthChange(apply)
  }, [queryClient])

  const signIn = useCallback(
    (email: string, password: string) => signInWithPassword(email, password),
    [],
  )
  const signUp = useCallback(async (input: SignUpInput) => {
    const { needs_confirmation } = await signUpWithEmail(input)
    return { needsConfirmation: needs_confirmation }
  }, [])
  const signOut = useCallback(() => apiSignOut(), [])

  const value = useMemo(
    () => ({ status, signedIn: status === 'signedIn', signIn, signUp, signOut }),
    [status, signIn, signUp, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
