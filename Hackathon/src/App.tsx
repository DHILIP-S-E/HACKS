import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, useAccessibilityStore, useUIStore } from '@/lib/store'
import Layout from '@/components/Layout'
import LoginPage from '@/features/auth/LoginPage'
import RegisterPage from '@/features/auth/RegisterPage'
import DashboardPage from '@/features/dashboard/DashboardPage'
import LessonsPage from '@/features/lessons/LessonsPage'
import LessonDetailPage from '@/features/lessons/LessonDetailPage'
import CreateLessonPage from '@/features/lessons/CreateLessonPage'
import ProfilePage from '@/features/profile/ProfilePage'
import SettingsPage from '@/features/settings/SettingsPage'
import AdminPage from '@/features/admin/AdminPage'
import NotFoundPage from '@/components/NotFoundPage'
import SkipLink from '@/components/SkipLink'
import AccessibilityProvider from '@/components/AccessibilityProvider'

function App() {
  const { i18n } = useTranslation()
  const { isAuthenticated } = useAuthStore()
  const { preferences } = useAccessibilityStore()
  const { theme, language } = useUIStore()

  // Apply theme
  useEffect(() => {
    const root = document.documentElement
    
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Apply accessibility preferences
  useEffect(() => {
    const root = document.documentElement
    
    // Font size
    root.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px',
    }[preferences.fontSize]

    // Font family
    if (preferences.fontFamily === 'dyslexia-friendly') {
      root.classList.add('dyslexia-friendly')
    } else {
      root.classList.remove('dyslexia-friendly')
    }

    // High contrast
    if (preferences.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Reduced motion
    if (preferences.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Line spacing
    root.style.setProperty('--line-height', preferences.lineSpacing.toString())

    // Letter spacing
    root.style.setProperty('--letter-spacing', `${preferences.letterSpacing}em`)
  }, [preferences])

  // Apply language
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  if (!isAuthenticated) {
    return (
      <AccessibilityProvider>
        <SkipLink />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AccessibilityProvider>
    )
  }

  return (
    <AccessibilityProvider>
      <SkipLink />
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/create" element={<CreateLessonPage />} />
          <Route path="/lessons/:id" element={<LessonDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AccessibilityProvider>
  )
}

export default App