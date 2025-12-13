import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@components/common/Input'
import { Button } from '@components/common/Button'
import type { User } from '../types/auth.types'

// Validation schema for profile edit
const profileEditSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

export type ProfileEditFormData = z.infer<typeof profileEditSchema>

export interface ProfileEditFormProps {
  user: User
  onSubmit: (data: ProfileEditFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
}

export const ProfileEditForm = ({ user, onSubmit, onCancel, isLoading }: ProfileEditFormProps) => {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    mode: 'onBlur',
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: '',
      bio: '',
    },
  })

  const handleFormSubmit = async (data: ProfileEditFormData) => {
    try {
      setError(null)
      setSuccess(false)
      await onSubmit(data)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6" noValidate>
      {/* Success Message */}
      {success && (
        <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-md text-secondary-800">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Profile Picture */}
      <div className="flex items-center space-x-4">
        <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-semibold shadow-lg">
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <Button type="button" variant="outline" size="sm">
            Change Photo
          </Button>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG or GIF. Max size 2MB.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register('name')}
          label="Full Name"
          placeholder="John Doe"
          error={errors.name?.message}
          disabled={isLoading}
          required
        />

        <Input
          {...register('email')}
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          error={errors.email?.message}
          disabled={isLoading}
          required
          helperText="Changing email will require verification"
        />
      </div>

      <Input
        {...register('phone')}
        type="tel"
        label="Phone Number"
        placeholder="+251 91 234 5678"
        error={errors.phone?.message}
        disabled={isLoading}
        helperText="Optional - for booking confirmations"
      />

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-2">
          Bio
        </label>
        <textarea
          {...register('bio')}
          id="bio"
          rows={4}
          className="input w-full resize-none"
          placeholder="Tell us about yourself..."
          disabled={isLoading}
        />
        {errors.bio && (
          <p className="mt-2 text-sm text-destructive">{errors.bio.message}</p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Brief description for your profile. Maximum 500 characters.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          disabled={!isDirty || !isValid || isLoading}
          isLoading={isLoading}
          className="sm:flex-1"
        >
          Save Changes
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="sm:flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default ProfileEditForm
