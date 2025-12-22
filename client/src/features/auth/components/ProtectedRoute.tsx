import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { Loader } from '@components/common/Loader/Loader'
import { ROUTES } from '@utils/constants'

export interface ProtectedRouteProps {
  children: React.ReactNode
  redirectTo?: string
}

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Preserves the intended destination for redirect after login
 */
export const ProtectedRoute = ({ 
  children, 
  redirectTo = ROUTES.LOGIN 
}: ProtectedRouteProps) => {
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

export default ProtectedRoute
