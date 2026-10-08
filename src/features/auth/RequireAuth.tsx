import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()
  if (status === 'loading') {
    return (
      <div role="status" className="grid min-h-dvh place-items-center">
        <span className="sr-only">Loading…</span>
        <span
          aria-hidden
          className="size-8 animate-spin rounded-full border-[3px] border-persimmon border-t-transparent"
        />
      </div>
    )
  }
  if (status === 'signedOut') {
    return <Navigate to="/welcome" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
