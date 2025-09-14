import React from 'react'
import { Link } from 'react-router-dom'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/dashboard"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}

export default NotFound