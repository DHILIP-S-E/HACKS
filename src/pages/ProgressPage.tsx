import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Target, Clock, BookOpen, Award } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const ProgressPage: React.FC = () => {
  const { t } = useTranslation();
  const { progress, isLoading } = useProgressStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const progressStats = [
    {
      label: 'Current Level',
      value: progress?.level || 1,
      icon: Target,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100 dark:bg-primary-900/20'
    },
    {
      label: 'Total XP',
      value: progress?.totalXP || 0,
      icon: TrendingUp,
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/20'
    },
    {
      label: 'Lessons Completed',
      value: progress?.completedLessons?.length || 0,
      icon: BookOpen,
      color: 'text-accent-500',
      bgColor: 'bg-accent-100 dark:bg-accent-900/20'
    },
    {
      label: 'Study Streak',
      value: `${progress?.streak || 0} days`,
      icon: Clock,
      color: 'text-success-500',
      bgColor: 'bg-success-100 dark:bg-success-900/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Learning Progress
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Track your learning journey and see how far you've come
        </p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressStats.map((stat, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Level Progress */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-primary-500" />
          Level Progress
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Level {progress?.level || 1}
            </span>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              {progress?.totalXP || 0} / {((progress?.level || 1) * 100)} XP
            </span>
          </div>
          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-primary-500 to-secondary-500 h-4 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(((progress?.totalXP || 0) % 100), 100)}%` 
              }}
            />
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {100 - ((progress?.totalXP || 0) % 100)} XP needed to reach Level {(progress?.level || 1) + 1}
          </p>
        </div>
      </div>

      {/* Learning Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {progress?.completedLessons?.slice(0, 5).map((lessonId, index) => (
              <div key={index} className="flex items-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-primary-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                    Lesson {lessonId}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Completed
                  </p>
                </div>
                <div className="text-xs text-neutral-500">
                  +50 XP
                </div>
              </div>
            )) || (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  No lessons completed yet. Start learning to see your progress!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
            Study Streak
          </h2>
          <div className="text-center">
            <div className="text-6xl font-bold text-primary-500 mb-4">
              {progress?.streak || 0}
            </div>
            <p className="text-lg text-neutral-900 dark:text-neutral-100 mb-2">
              Days in a row
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {progress?.streak ? 
                "Great job! Keep up the momentum!" : 
                "Start your learning streak today!"
              }
            </p>
            <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                💡 Tip: Study for at least 10 minutes daily to maintain your streak
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;