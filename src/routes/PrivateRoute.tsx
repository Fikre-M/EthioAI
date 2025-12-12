import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { Loader } from '@components/common/Loader'
import { ROUTES } from '@utils/constants'

export interface PrivateRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * PrivateRoute Component
 * 
 * Protects routes that require authentication.
 * Redirects unauthenticated users to login page.
 * Preserves the intended destination for redirect after login.
 * 
 * @example
 * <PrivateRoute>
 *   <DashboardPage />
 * </PrivateRoute>
 */
export const PrivateRoute = ({ 
  children, 
  redirectTo = ROUTES.LOGIN 
}: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loader while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    )
  }

  // Redirect to login if not authenticated
  // Preserve the current location to redirect back after login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Render children if authenticated
  return <>{children}</>
}

export default PrivateRoute
