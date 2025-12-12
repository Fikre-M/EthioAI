import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { registerSchema, type RegisterFormData } from '../schemas/validation'
import { Input } from '@components/common/Input/Input'
import { Button } from '@components/common/Button/Button'
import { ROUTES } from '@utils/constants'

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export const RegisterForm = ({ onSubmit, isLoading, error }: RegisterFormProps) => {
  const { t } = useTranslation()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const handleFormSubmit = async (data: RegisterFormData) => {
    try {
      await onSubmit(data)
    } catch (err) {
      // Error handling is done by parent component
      console.error('Registration error:', err)
    }
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

      <Input
        {...register('name')}
        type="text"
        label={t('auth.register.name', 'Full Name')}
        placeholder="John Doe"
        error={errors.name?.message}
        disabled={isLoading}
        required
        autoComplete="name"
      />

      <Input
        {...register('email')}
        type="email"
        label={t('auth.register.email', 'Email Address')}
        placeholder="you@example.com"
        error={errors.email?.message}
        disabled={isLoading}
        required
        autoComplete="email"
      />

      <Input
        {...register('password')}
        type="password"
        label={t('auth.register.password', 'Password')}
        placeholder="••••••••"
        error={errors.password?.message}
        helperText="Must be at least 8 characters with uppercase, lowercase, and number"
        disabled={isLoading}
        required
        autoComplete="new-password"
      />

      <Input
        {...register('confirmPassword')}
        type="password"
        label={t('auth.register.confirmPassword', 'Confirm Password')}
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        disabled={isLoading}
        required
        autoComplete="new-password"
      />

      <Button
        type="submit"
        className="w-full"
        disabled={!isDirty || !isValid || isLoading}
        isLoading={isLoading}
      >
        {t('auth.register.submit', 'Create Account')}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {t('auth.register.hasAccount', 'Already have an account?')}{' '}
        <Link
          to={ROUTES.LOGIN}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          {t('auth.register.signIn', 'Sign In')}
        </Link>
      </div>
    </form>
  )
}
