import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Icon } from './Icon'

interface ToastApi {
  show: (message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const show = useCallback((msg: string) => {
    window.clearTimeout(timer.current)
    setMessage(msg)
    timer.current = window.setTimeout(() => setMessage(null), 3800)
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8"
      >
        {message && (
          <div className="pointer-events-auto flex animate-rise items-center gap-2.5 rounded-full bg-ink px-5 py-3 text-sm font-medium text-cream shadow-[var(--shadow-float)]">
            <Icon name="check" size={18} className="text-matcha-soft" />
            {message}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
