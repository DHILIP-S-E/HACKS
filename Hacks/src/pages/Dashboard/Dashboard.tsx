import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/store/authStore'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div className="bg-background">
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome', { name: user?.name })}
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your learning dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.recentLessons')}</h2>
          <p className="text-muted-foreground">No recent lessons</p>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.progress')}</h2>
          <p className="text-muted-foreground">Progress tracking coming soon</p>
        </div>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">{t('dashboard.achievements')}</h2>
          <p className="text-muted-foreground">No achievements yet</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard