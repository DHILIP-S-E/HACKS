import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, ArrowLeft } from 'lucide-react'

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300 dark:text-gray-600">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="block w-full px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="inline mr-2 h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage