import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/lib/store'
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const DashboardPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  const stats = [
    {
      name: 'Total Lessons',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: BookOpen,
    },
    {
      name: 'Active Students',
      value: '48',
      change: '+5',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Completion Rate',
      value: '87%',
      change: '+3%',
      changeType: 'increase',
      icon: TrendingUp,
    },
    {
      name: 'Avg. Study Time',
      value: '2.4h',
      change: '+0.2h',
      changeType: 'increase',
      icon: Clock,
    },
  ]

  const recentLessons = [
    {
      id: '1',
      title: 'Introduction to Mathematics',
      status: 'published',
      accessibility: 'verified',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Basic Reading Comprehension',
      status: 'draft',
      accessibility: 'processing',
      updatedAt: '2024-01-14',
    },
    {
      id: '3',
      title: 'Science Fundamentals',
      status: 'published',
      accessibility: 'verified',
      updatedAt: '2024-01-13',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100'
      case 'draft':
        return 'text-yellow-600 bg-yellow-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getAccessibilityIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {user?.role === 'student' && "Continue your learning journey with accessible content."}
          {user?.role === 'teacher' && "Manage your lessons and help students learn effectively."}
          {user?.role === 'admin' && "Oversee the platform and ensure quality education for all."}
        </p>
      </div>

      {/* Stats Grid */}
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className={cn(
                        'ml-2 text-sm font-medium',
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      )}>
                        {stat.change}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {user?.role === 'teacher' && (
            <Link
              to="/lessons/create"
              className={cn(
                'flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg',
                'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                'transition-colors group'
              )}
            >
              <Plus className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mr-3" />
              <span className="text-gray-600 dark:text-gray-400 group-hover:text-primary-600">
                Create New Lesson
              </span>
            </Link>
          )}
          
          <Link
            to="/lessons"
            className={cn(
              'flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'transition-colors group'
            )}
          >
            <Eye className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mr-3" />
            <span className="text-gray-600 dark:text-gray-400 group-hover:text-primary-600">
              Browse Lessons
            </span>
          </Link>

          <Link
            to="/settings"
            className={cn(
              'flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'transition-colors group'
            )}
          >
            <TrendingUp className="h-6 w-6 text-gray-400 group-hover:text-primary-600 mr-3" />
            <span className="text-gray-600 dark:text-gray-400 group-hover:text-primary-600">
              Accessibility Settings
            </span>
          </Link>
        </div>
      </div>

      {/* Recent Lessons */}
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Lessons
            </h2>
            <Link
              to="/lessons"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              View all
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Updated {lesson.updatedAt}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getStatusColor(lesson.status)
                  )}>
                    {lesson.status}
                  </span>
                  
                  <div className="flex items-center" title={`Accessibility: ${lesson.accessibility}`}>
                    {getAccessibilityIcon(lesson.accessibility)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Progress */}
      {user?.role === 'student' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Your Progress
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Lessons Completed
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                8 / 12
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Keep going! You're doing great.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage