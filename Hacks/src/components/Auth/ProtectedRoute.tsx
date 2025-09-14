import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LoadingSpinner from '@/components/UI/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string[]
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && !requiredRole.includes(user.role)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Access Denied
        </h2>
        <p className="text-muted-foreground">
          You don't have permission to access this page.
        </p>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute