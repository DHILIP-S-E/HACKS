import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Target, Award, TrendingUp, Clock, Users } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useProgressStore } from '@/stores/progressStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { progress, badges, achievements, isLoading } = useProgressStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Lessons Completed',
      value: progress?.completedLessons?.length || 0,
      icon: BookOpen,
      color: 'text-primary-500',
      bgColor: 'bg-primary-100 dark:bg-primary-900/20',
    },
    {
      label: 'Current Level',
      value: progress?.level || 1,
      icon: Target,
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/20',
    },
    {
      label: 'Badges Earned',
      value: badges.length,
      icon: Award,
      color: 'text-accent-500',
      bgColor: 'bg-accent-100 dark:bg-accent-900/20',
    },
    {
      label: 'Study Streak',
      value: `${progress?.streak || 0} days`,
      icon: TrendingUp,
      color: 'text-success-500',
      bgColor: 'bg-success-100 dark:bg-success-900/20',
    },
  ];

  const recentAchievements = achievements.slice(0, 3);
  const recentBadges = badges.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-lg opacity-90">
          Ready to continue your learning journey? You're doing great!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Level Progress */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Level Progress
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Level {progress?.level || 1}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {progress?.totalXP || 0} XP
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${((progress?.totalXP || 0) % 100)}%` 
                  }}
                />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {100 - ((progress?.totalXP || 0) % 100)} XP to next level
              </p>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Recent Achievements
            </h2>
            {recentAchievements.length > 0 ? (
              <div className="space-y-3">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <div className="w-10 h-10 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center mr-3">
                      <Award className="w-5 h-5 text-accent-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        +{achievement.xpReward} XP
                      </p>
                    </div>
                    <div className="text-xs text-neutral-500">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600 dark:text-neutral-400">
                  Complete lessons to unlock achievements!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full btn-primary justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Continue Learning
              </button>
              <button className="w-full btn-outline justify-start">
                <Users className="w-4 h-4 mr-2" />
                View Classmates
              </button>
              <button className="w-full btn-outline justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Study Schedule
              </button>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Latest Badges
            </h2>
            {recentBadges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {recentBadges.map((badge) => (
                  <div key={badge.id} className="text-center p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                      {badge.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Award className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Earn badges by learning!
                </p>
              </div>
            )}
          </div>

          {/* Study Streak */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Study Streak 🔥
            </h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {progress?.streak || 0}
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Days in a row
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                Keep it up! Study tomorrow to continue your streak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;