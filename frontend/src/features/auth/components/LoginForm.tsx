import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loginSchema, type LoginFormData } from '../schemas/validation'
import { Input } from '@components/common/Input/Input'
import { Button } from '@components/common/Button/Button'
import { ROUTES } from '@utils/constants'

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>
  isLoading?: boolean
  error?: string | null
}

export const LoginForm = ({ onSubmit, isLoading, error }: LoginFormProps) => {
  const { t } = useTranslation()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data)
    } catch (err) {
      // Error handling is done by parent component
      console.error('Login error:', err)
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
        {...register('email')}
        type="email"
        label={t('auth.login.email', 'Email Address')}
        placeholder="you@example.com"
        error={errors.email?.message}
        disabled={isLoading}
        required
        autoComplete="email"
      />

      <Input
        {...register('password')}
        type="password"
        label={t('auth.login.password', 'Password')}
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isLoading}
        required
        autoComplete="current-password"
      />

      <div className="flex items-center justify-end">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
          tabIndex={0}
        >
          {t('auth.login.forgotPassword', 'Forgot Password?')}
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!isDirty || !isValid || isLoading}
        isLoading={isLoading}
      >
        {t('auth.login.submit', 'Sign In')}
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        {t('auth.login.noAccount', "Don't have an account?")}{' '}
        <Link
          to={ROUTES.REGISTER}
          className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
        >
          {t('auth.login.signUp', 'Sign Up')}
        </Link>
      </div>
    </form>
  )
}
