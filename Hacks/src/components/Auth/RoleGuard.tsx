import React from 'react'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: User['role'][]
  fallback?: React.ReactNode
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  fallback 
}) => {
  const { user } = useAuthStore()

  if (!user || !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>
    }
    
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

export default RoleGuard