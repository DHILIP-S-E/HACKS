import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/lib/store'
import { localStorageAdapter } from '@/adapters/localStorageAdapter'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      // Check if user exists
      const user = await localStorageAdapter.getUserByEmail(data.email)
      
      if (!user) {
        // Create demo users if they don't exist
        const demoUsers = [
          {
            id: 'student-1',
            email: 'student@demo.com',
            name: 'Demo Student',
            role: 'student' as const,
            avatar: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'teacher-1',
            email: 'teacher@demo.com',
            name: 'Demo Teacher',
            role: 'teacher' as const,
            avatar: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'admin-1',
            email: 'admin@demo.com',
            name: 'Demo Admin',
            role: 'admin' as const,
            avatar: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

        for (const demoUser of demoUsers) {
          await localStorageAdapter.setUser(demoUser)
        }

        const foundUser = demoUsers.find(u => u.email === data.email)
        if (foundUser) {
          login(foundUser)
          navigate('/dashboard')
        } else {
          setError('email', { message: 'Invalid email or password' })
        }
      } else {
        login(user)
        navigate('/dashboard')
      }
    } catch (error) {
      setError('email', { message: 'Login failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <GraduationCap className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {t('auth.login')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Assistive Learning Platform
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.email')}
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className={cn(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
                  errors.email ? 'border-red-500' : 'border-gray-300'
                )}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.password')}
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={cn(
                    'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                    'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  )}
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'group relative w-full flex justify-center py-2 px-4 border border-transparent',
                'text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
                'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              )}
            >
              {isLoading ? t('common.loading') : t('auth.login')}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Demo accounts:
            </p>
            <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-500">
              <p>Student: student@demo.com</p>
              <p>Teacher: teacher@demo.com</p>
              <p>Admin: admin@demo.com</p>
              <p>Password: any password</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage