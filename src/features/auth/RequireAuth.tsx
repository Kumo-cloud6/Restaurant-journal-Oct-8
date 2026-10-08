import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RequireAuth() {
  const { signedIn } = useAuth()
  const location = useLocation()
  if (!signedIn)
    return <Navigate to="/welcome" replace state={{ from: location.pathname }} />
  return <Outlet />
}
