import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { RegisterForm } from '../components/RegisterForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/common/Card/Card'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@utils/constants'
import type { RegisterFormData } from '../schemas/validation'

export const RegisterPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { register, isAuthenticated, isLoading, error } = useAuth()

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD)
    }
  }, [isAuthenticated, navigate])

  const handleRegister = async (data: RegisterFormData) => {
    try {
      await register(data)
      // Show success message or navigate to verification page
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">
              {t('auth.register.title', 'Create Account')}
            </CardTitle>
            <CardDescription>
              Enter your information to create a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
