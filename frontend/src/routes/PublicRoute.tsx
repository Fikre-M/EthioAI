import { Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { Loader } from '@components/common/Loader'
import { ROUTES } from '@utils/constants'

export interface PublicRouteProps {
  children: React.ReactNode
  redirectTo?: string
  restricted?: boolean
}

/**
 * PublicRoute Component
 * 
 * For routes that should only be accessible to unauthenticated users.
 * Useful for login, register pages - authenticated users get redirected.
 * 
 * @param restricted - If true, authenticated users will be redirected
 * @param redirectTo - Where to redirect authenticated users (default: dashboard)
 * 
 * @example
 * // Login page - redirect authenticated users
 * <PublicRoute restricted>
 *   <LoginPage />
 * </PublicRoute>
 * 
 * @example
 * // Public page - accessible to everyone
 * <PublicRoute>
 *   <HomePage />
 * </PublicRoute>
 */
export const PublicRoute = ({ 
  children, 
  redirectTo = ROUTES.DASHBOARD,
  restricted = false 
}: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    )
  }

  // If route is restricted and user is authenticated, redirect
  if (restricted && isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // Render children
  return <>{children}</>
}

export default PublicRoute
