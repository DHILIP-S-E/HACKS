import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAccessibilityStore } from '@/lib/store'
import { announceToScreenReader } from '@/lib/utils'

interface AccessibilityContextType {
  announce: (message: string) => void
  preferences: ReturnType<typeof useAccessibilityStore>['preferences']
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

interface AccessibilityProviderProps {
  children: ReactNode
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { preferences } = useAccessibilityStore()

  const announce = (message: string) => {
    announceToScreenReader(message)
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + 1: Skip to main content
      if (event.altKey && event.key === '1') {
        event.preventDefault()
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.focus()
        }
      }

      // Alt + 2: Skip to navigation
      if (event.altKey && event.key === '2') {
        event.preventDefault()
        const navigation = document.getElementById('main-navigation')
        if (navigation) {
          navigation.focus()
        }
      }

      // Escape: Close modals/dropdowns
      if (event.key === 'Escape') {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement && activeElement.closest('[role="dialog"]')) {
          const closeButton = activeElement.closest('[role="dialog"]')?.querySelector('[aria-label*="close"]') as HTMLElement
          if (closeButton) {
            closeButton.click()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Announce preference changes
  useEffect(() => {
    if (preferences.screenReader) {
      announce('Accessibility preferences updated')
    }
  }, [preferences])

  const contextValue: AccessibilityContextType = {
    announce,
    preferences,
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

export default AccessibilityProvider