import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'

// Layout Components
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

// Auth Components
import AuthGuard from './components/Auth/AuthGuard'
import RoleGuard from './components/Auth/RoleGuard'

// Lazy-loaded Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard/Dashboard'))
const LessonViewer = React.lazy(() => import('./pages/LessonViewer/LessonViewer'))
const LessonEditor = React.lazy(() => import('./pages/LessonEditor/LessonEditor'))
const Profile = React.lazy(() => import('./pages/Profile/Profile'))
const Settings = React.lazy(() => import('./pages/Settings/Settings'))
const AdminPanel = React.lazy(() => import('./pages/AdminPanel/AdminPanel'))
const Login = React.lazy(() => import('./pages/Auth/Login'))
const Register = React.lazy(() => import('./pages/Auth/Register'))
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'))

// Hooks
import { useAuthStore } from './store/authStore'
import { useAccessibilityStore } from './store/accessibilityStore'

function App() {
  const { t } = useTranslation()
  const { user, isLoading } = useAuthStore()
  const { preferences } = useAccessibilityStore()

  // Apply accessibility preferences to document
  React.useEffect(() => {
    const root = document.documentElement
    
    // Apply theme
    root.setAttribute('data-theme', preferences.theme)
    
    // Apply font preferences
    root.style.setProperty('--font-size-base', getFontSizeValue(preferences.fontSize))
    root.style.setProperty('--font-family-base', getFontFamilyValue(preferences.fontFamily))
    root.style.setProperty('--line-height-base', preferences.lineHeight.toString())
    root.style.setProperty('--letter-spacing-base', `${preferences.letterSpacing}px`)
    
    // Apply color overlay if set
    if (preferences.colorOverlay) {
      root.style.setProperty('--color-overlay', preferences.colorOverlay)
    }
    
    // Apply reading ruler
    root.classList.toggle('reading-ruler', preferences.readingRuler)
  }, [preferences])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        }>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              user ? <Navigate to="/dashboard" replace /> : <Login />
            } />
            <Route path="/register" element={
              user ? <Navigate to="/dashboard" replace /> : <Register />
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Student & Teacher Routes */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="lesson/:id" element={<LessonViewer />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Teacher Routes */}
              <Route path="lesson/:id/edit" element={
                <RoleGuard allowedRoles={['teacher', 'admin']}>
                  <LessonEditor />
                </RoleGuard>
              } />
              <Route path="lesson/new" element={
                <RoleGuard allowedRoles={['teacher', 'admin']}>
                  <LessonEditor />
                </RoleGuard>
              } />
              
              {/* Admin Routes */}
              <Route path="admin/*" element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminPanel />
                </RoleGuard>
              } />
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-background)',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-success)',
                secondary: 'var(--color-background)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--color-error)',
                secondary: 'var(--color-background)',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  )
}

// Helper functions for accessibility preferences
function getFontSizeValue(size: string): string {
  const sizes = {
    small: '14px',
    medium: '16px',
    large: '18px',
    'extra-large': '22px',
  }
  return sizes[size as keyof typeof sizes] || sizes.medium
}

function getFontFamilyValue(family: string): string {
  const families = {
    default: 'system-ui, -apple-system, sans-serif',
    'dyslexia-friendly': 'OpenDyslexic, "Comic Sans MS", cursive, sans-serif',
  }
  return families[family as keyof typeof families] || families.default
}

export default App