import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Trophy, Star, Target, Zap, BookOpen } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const AchievementsPage: React.FC = () => {
  const { t } = useTranslation();
  const { achievements, badges, isLoading } = useProgressStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const achievementCategories = [
    {
      title: 'Learning Milestones',
      icon: BookOpen,
      achievements: achievements.filter(a => a.category === 'learning'),
      color: 'text-primary-500',
      bgColor: 'bg-primary-100 dark:bg-primary-900/20'
    },
    {
      title: 'Skill Mastery',
      icon: Target,
      achievements: achievements.filter(a => a.category === 'skill'),
      color: 'text-secondary-500',
      bgColor: 'bg-secondary-100 dark:bg-secondary-900/20'
    },
    {
      title: 'Special Awards',
      icon: Trophy,
      achievements: achievements.filter(a => a.category === 'special'),
      color: 'text-accent-500',
      bgColor: 'bg-accent-100 dark:bg-accent-900/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Achievements
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Track your learning progress and celebrate your accomplishments
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-500">
              {achievements.length}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Achievements
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary-500">
              {badges.length}
            </div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Badges
            </div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center">
          <Award className="w-6 h-6 mr-2 text-accent-500" />
          Your Badges
        </h2>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="text-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100">
                  {badge.name}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No badges yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Complete lessons and challenges to earn your first badge!
            </p>
          </div>
        )}
      </div>

      {/* Achievements by Category */}
      {achievementCategories.map((category) => (
        <div key={category.title} className="card p-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center">
            <div className={`w-8 h-8 ${category.bgColor} rounded-lg flex items-center justify-center mr-3`}>
              <category.icon className={`w-5 h-5 ${category.color}`} />
            </div>
            {category.title}
          </h2>
          
          {category.achievements.length > 0 ? (
            <div className="space-y-4">
              {category.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/20 rounded-full flex items-center justify-center mr-4">
                    <Trophy className="w-6 h-6 text-accent-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {achievement.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-1 rounded">
                        +{achievement.xpReward} XP
                      </span>
                      <span className="text-xs text-neutral-500">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <category.icon className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600 dark:text-neutral-400">
                No achievements in this category yet. Keep learning to unlock them!
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Overall Progress */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-500" />
          Achievement Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-500 mb-2">
              {Math.round((achievements.length / 20) * 100)}%
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Overall Progress
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary-500 mb-2">
              {achievements.reduce((sum, a) => sum + a.xpReward, 0)}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Total XP from Achievements
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent-500 mb-2">
              {achievements.filter(a => a.rarity === 'rare').length}
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Rare Achievements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;