import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { user, isInitialized } = useAuthStore();
  const location = useLocation();

  // Wait for auth initialization
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role requirements
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return (
      <Navigate 
        to="/dashboard" 
        replace 
      />
    );
  }

  return <>{children}</>;
};