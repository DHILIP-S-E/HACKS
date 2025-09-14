import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'
import LoadingSpinner from '@/components/UI/LoadingSpinner'

const Register: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signUp, isLoading, error } = useAuthStore()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as User['role']
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      return
    }

    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        role: formData.role
      })
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
            {t('auth.register')}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              {t('auth.name')}
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

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
            <label htmlFor="role" className="block text-sm font-medium text-foreground">
              {t('auth.role')}
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
              className="mt-1 block w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="student">{t('role.student')}</option>
              <option value="teacher">{t('role.teacher')}</option>
              <option value="parent">{t('role.parent')}</option>
            </select>
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
              {t('auth.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {isLoading ? <LoadingSpinner size="small" /> : t('auth.signUp')}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-primary hover:underline">
              Already have an account? {t('auth.signIn')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register