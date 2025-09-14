import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/lib/store'
import { localStorageAdapter } from '@/adapters/localStorageAdapter'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'
import { cn, generateId } from '@/lib/utils'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'teacher']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

const RegisterPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      // Check if user already exists
      const existingUser = await localStorageAdapter.getUserByEmail(data.email)
      if (existingUser) {
        setError('email', { message: 'User with this email already exists' })
        return
      }

      // Create new user
      const newUser = {
        id: generateId(),
        email: data.email,
        name: data.name,
        role: data.role,
        avatar: undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await localStorageAdapter.setUser(newUser)
      login(newUser)
      navigate('/dashboard')
    } catch (error) {
      setError('email', { message: 'Registration failed. Please try again.' })
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
            {t('auth.register')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                {...register('name')}
                type="text"
                autoComplete="name"
                className={cn(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
                  errors.name ? 'border-red-500' : 'border-gray-300'
                )}
                aria-invalid={errors.name ? 'true' : 'false'}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

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
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                {...register('role')}
                className={cn(
                  'mt-1 block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
                  errors.role ? 'border-red-500' : 'border-gray-300'
                )}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.role.message}
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
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('auth.confirmPassword')}
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={cn(
                    'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                    'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  )}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.confirmPassword.message}
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
              {isLoading ? t('common.loading') : t('auth.register')}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage