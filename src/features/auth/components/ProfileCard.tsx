import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { ROUTES } from '@utils/constants'
import type { User } from '../types/auth.types'

export interface ProfileCardProps {
  user: User
  onEdit?: () => void
}

export const ProfileCard = ({ user, onEdit }: ProfileCardProps) => {
  return (
    <Card className="hover-lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <span>{user.email}</span>
                {user.emailVerified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary-100 text-secondary-800">
                    ✓ Verified
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Account Status */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Account Status</h4>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${user.emailVerified ? 'bg-secondary-500' : 'bg-warning-500'}`} />
              <span className="text-sm">
                {user.emailVerified ? 'Active' : 'Pending Verification'}
              </span>
            </div>
          </div>

          {/* Member Since */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Member Since</h4>
            <p className="text-sm">
              {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </p>
          </div>

          {/* Email Verification */}
          {!user.emailVerified && (
            <div className="md:col-span-2">
              <div className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-md">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-sm font-medium text-warning-800">
                    Please verify your email address
                  </span>
                </div>
                <Button variant="outline" size="sm" className="text-warning-700 border-warning-300 hover:bg-warning-100">
                  Resend Email
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Link to={ROUTES.SETTINGS}>
              <Button variant="ghost" size="sm">
                ⚙️ Settings
              </Button>
            </Link>
            <Link to={ROUTES.BOOKINGS}>
              <Button variant="ghost" size="sm">
                📅 My Bookings
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              🔒 Change Password
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
