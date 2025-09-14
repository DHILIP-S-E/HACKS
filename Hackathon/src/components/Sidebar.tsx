import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/lib/store'
import { 
  Home, 
  BookOpen, 
  ClipboardList, 
  User, 
  Settings, 
  Shield,
  LogOut,
  GraduationCap
} from 'lucide-react'
import { cn } from '@/lib/utils'

const Sidebar: React.FC = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const navigation = [
    {
      name: t('navigation.dashboard'),
      href: '/dashboard',
      icon: Home,
      roles: ['student', 'teacher', 'admin'],
    },
    {
      name: t('navigation.lessons'),
      href: '/lessons',
      icon: BookOpen,
      roles: ['student', 'teacher', 'admin'],
    },
    {
      name: t('navigation.assessments'),
      href: '/assessments',
      icon: ClipboardList,
      roles: ['student', 'teacher', 'admin'],
    },
    {
      name: t('navigation.profile'),
      href: '/profile',
      icon: User,
      roles: ['student', 'teacher', 'admin'],
    },
    {
      name: t('navigation.settings'),
      href: '/settings',
      icon: Settings,
      roles: ['student', 'teacher', 'admin'],
    },
    {
      name: t('navigation.admin'),
      href: '/admin',
      icon: Shield,
      roles: ['admin'],
    },
  ]

  const filteredNavigation = navigation.filter(item => 
    user && item.roles.includes(user.role)
  )

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-lg">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ALP
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav
        id="main-navigation"
        className="flex-1 px-4 py-6 space-y-2"
        aria-label={t('navigation.dashboard')}
        tabIndex={-1}
      >
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href || 
            (item.href !== '/dashboard' && location.pathname.startsWith(item.href))

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                isActive
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="mr-3 h-5 w-5" aria-hidden="true" />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md',
            'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'transition-colors'
          )}
        >
          <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
          {t('navigation.logout')}
        </button>
      </div>
    </div>
  )
}

export default Sidebar