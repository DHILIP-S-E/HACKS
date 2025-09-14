import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/lib/store'
import { Navigate } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  Shield, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react'

const AdminPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  const stats = [
    {
      name: 'Total Users',
      value: '156',
      change: '+12',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Total Lessons',
      value: '89',
      change: '+8',
      changeType: 'increase',
      icon: BookOpen,
    },
    {
      name: 'Accessibility Score',
      value: '94%',
      change: '+2%',
      changeType: 'increase',
      icon: Shield,
    },
    {
      name: 'Platform Usage',
      value: '87%',
      change: '+5%',
      changeType: 'increase',
      icon: TrendingUp,
    },
  ]

  const pendingReviews = [
    {
      id: '1',
      type: 'lesson',
      title: 'Advanced Mathematics',
      teacher: 'Dr. Smith',
      status: 'pending_review',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      type: 'accessibility',
      title: 'Science Fundamentals',
      teacher: 'Ms. Johnson',
      status: 'needs_attention',
      createdAt: '2024-01-14',
    },
  ]

  const recentUsers = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'student',
      joinedAt: '2024-01-15',
      status: 'active',
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'teacher',
      joinedAt: '2024-01-14',
      status: 'active',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage users, content, and platform settings
        </p>
      </div>

      {/* Stats Grid */}
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
                    <p className="ml-2 text-sm font-medium text-green-600">
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pending Reviews */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Reviews
          </h2>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            {pendingReviews.length} pending
          </span>
        </div>
        
        <div className="space-y-3">
          {pendingReviews.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {item.status === 'needs_attention' ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                ) : (
                  <Clock className="h-5 w-5 text-blue-600" />
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    by {item.teacher} • {item.createdAt}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'needs_attention' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
                
                <button className="p-1 text-gray-400 hover:text-primary-600">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Users
          </h2>
          <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View all users
          </button>
        </div>
        
        <div className="space-y-3">
          {recentUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email} • {user.role}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {user.status}
                </span>
                
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {user.joinedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Users className="h-6 w-6 text-primary-600 mb-2" />
            <div className="font-medium text-gray-900 dark:text-white">Manage Users</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove users</div>
          </button>
          
          <button className="p-4 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <BookOpen className="h-6 w-6 text-primary-600 mb-2" />
            <div className="font-medium text-gray-900 dark:text-white">Content Review</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Review and approve content</div>
          </button>
          
          <button className="p-4 text-left border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Shield className="h-6 w-6 text-primary-600 mb-2" />
            <div className="font-medium text-gray-900 dark:text-white">System Settings</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Configure platform settings</div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminPage