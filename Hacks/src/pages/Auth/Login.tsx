import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from '@/components/UI/LoadingSpinner'

const Login: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signIn, isLoading, error } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(formData.email, formData.password)
      navigate('/dashboard')
    } catch (error) {
      // Error is handled by the store
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            {t('auth.login')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              {t('auth.email')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              {t('auth.password')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="small" /> : t('auth.signIn')}
          </button>

          <div className="text-center">
            <Link to="/register" className="text-primary hover:underline">
              Don't have an account? {t('auth.signUp')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login