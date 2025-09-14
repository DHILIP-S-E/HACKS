import React from 'react'
import { useTranslation } from 'react-i18next'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  label?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  className = '',
  label 
}) => {
  const { t } = useTranslation()
  
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const spinnerLabel = label || t('status.loading', 'Loading...')

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      role="status"
      aria-label={spinnerLabel}
    >
      <div
        className={`${sizeClasses[size]} border-2 border-muted border-t-primary rounded-full animate-spin`}
        aria-hidden="true"
      />
      <span className="sr-only">{spinnerLabel}</span>
    </div>
  )
}

export default LoadingSpinner