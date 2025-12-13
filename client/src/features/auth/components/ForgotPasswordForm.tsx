import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/validation'
import { Input } from '@components/common/Input/Input'
import { Button } from '@components/common/Button/Button'
import { ROUTES } from '@utils/constants'

export interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export const ForgotPasswordForm = ({ onSubmit, isLoading, error }: ForgotPasswordFormProps) => {
  const { t } = useTranslation()
  const [isSuccess, setIsSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  })

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await onSubmit(data)
      setIsSuccess(true)
    } catch (err) {
      // Error handling is done by parent component
      console.error('Forgot password error:', err)
    }
  }

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div
          className="p-4 text-sm text-primary bg-primary/10 border border-primary/20 rounded-md"
          role="status"
        >
          <p className="font-medium mb-2">Check your email</p>
          <p className="text-muted-foreground">
            We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
          </p>
        </div>

        <div className="text-center">
          <Link
            to={ROUTES.LOGIN}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
      {error && (
        <div
          className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="text-sm text-muted-foreground mb-4">
        Enter your email address and we'll send you instructions to reset your password.
      </div>

      <Input
        {...register('email')}
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        error={errors.email?.message}
        disabled={isLoading}
        required
        autoComplete="email"
      />

      <Button
        type="submit"
        className="w-full"
        disabled={!isDirty || !isValid || isLoading}
        isLoading={isLoading}
      >
        Send Reset Instructions
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          Sign In
        </Link>
      </div>
    </form>
  )
}
