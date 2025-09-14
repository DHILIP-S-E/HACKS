import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'

interface HeaderProps {
  onMenuToggle: () => void
  sidebarOpen: boolean
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, sidebarOpen }) => {
  const { t } = useTranslation()
  const { user, signOut } = useAuthStore()

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={sidebarOpen ? t('nav.closeSidebar') : t('nav.openSidebar')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-xl font-bold text-foreground">
            {t('app.title', 'Assistive Learning Platform')}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {user?.name}
          </span>
          
          <button
            onClick={signOut}
            className="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {t('auth.signOut')}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header