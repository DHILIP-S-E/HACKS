import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore, useUIStore } from '@/lib/store'
import Sidebar from './Sidebar'
import Header from './Header'
import { Menu, X } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header />

        {/* Mobile menu button */}
        <button
          type="button"
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg lg:hidden"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? t('common.close') : t('common.open')}
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 p-6"
          tabIndex={-1}
          role="main"
          aria-label={t('navigation.skipToContent')}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout