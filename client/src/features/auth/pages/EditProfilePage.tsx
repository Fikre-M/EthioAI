import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import { ProfileEditForm, type ProfileEditFormData } from '../components/ProfileEditForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/common/Card'
import { Button } from '@components/common/Button'
import { Loader } from '@components/common/Loader'
import { ROUTES } from '@utils/constants'

export const EditProfilePage = () => {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ProfileEditFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to update profile
      console.log('Updating profile:', data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Navigate back to profile page after successful update
      setTimeout(() => {
        navigate(ROUTES.PROFILE)
      }, 1000)
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate(ROUTES.PROFILE)
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader size="lg" text="Loading..." />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No user data available</p>
            <Button onClick={() => navigate(ROUTES.LOGIN)}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient-ethiopian mb-2">
              Edit Profile
            </h1>
            <p className="text-muted-foreground">
              Update your personal information
            </p>
          </div>
          <Button variant="ghost" onClick={handleCancel}>
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </Button>
        </div>

        {/* Edit Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your profile details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileEditForm
              user={user}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isLoading={isSubmitting}
            />
          </CardContent>
        </Card>

        {/* Help Text */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <svg className="h-5 w-5 text-primary mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Profile Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use your real name to help tour guides identify you</li>
                  <li>• Add a phone number for booking confirmations</li>
                  <li>• Keep your email up to date for important notifications</li>
                  <li>• A complete profile helps us provide better recommendations</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditProfilePage
