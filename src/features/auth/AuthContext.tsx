import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { signInWithEmail, signOut as apiSignOut } from '@/lib/api'

/**
 * UI-only auth state. There is no real authentication: "signed in" is a flag in localStorage.
 * When Supabase Auth arrives, this context can wrap its session instead.
 */
const STORAGE_KEY = 'rj:signed-in'

interface AuthState {
  signedIn: boolean
  signIn: (email: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

function readFlag(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeFlag(on: boolean) {
  try {
    if (on) localStorage.setItem(STORAGE_KEY, '1')
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable — session lasts until reload */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(readFlag)
  const queryClient = useQueryClient()

  const signIn = useCallback(async (email: string) => {
    await signInWithEmail(email)
    writeFlag(true)
    setSignedIn(true)
  }, [])

  const signOut = useCallback(async () => {
    await apiSignOut()
    writeFlag(false)
    setSignedIn(false)
    queryClient.clear()
  }, [queryClient])

  const value = useMemo(
    () => ({ signedIn, signIn, signOut }),
    [signedIn, signIn, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
