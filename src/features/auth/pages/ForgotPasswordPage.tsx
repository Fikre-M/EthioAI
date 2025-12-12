import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/common/Card/Card'
import { authService } from '@services/authService'
import type { ForgotPasswordFormData } from '../schemas/validation'

export const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true)
      setError(null)
      await authService.forgotPassword(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email')
      throw err
    } finally {
      setIsLoading(false)
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
              Reset Password
            </CardTitle>
            <CardDescription>
              We'll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm
              onSubmit={handleForgotPassword}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
