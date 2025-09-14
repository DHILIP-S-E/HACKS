import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/lib/store'
import { User, Mail, Calendar, Shield, Edit } from 'lucide-react'

const ProfilePage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 capitalize">
              {user.role}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h2>
          <button className="inline-flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-500">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Full Name</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Role</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Member Since</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress (for students) */}
      {user.role === 'student' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Learning Progress
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Lessons Completed</span>
                <span className="text-gray-900 dark:text-white">8 / 12</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Average Score</span>
                <span className="text-gray-900 dark:text-white">85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teaching Stats (for teachers) */}
      {user.role === 'teacher' && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Teaching Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">12</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lessons Created</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">48</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students Taught</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">87%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Completion Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage