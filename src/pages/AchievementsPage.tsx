import React, { useEffect } from 'react';
import { Award, Trophy, Star, Target, Zap, BookOpen, Medal, Crown } from 'lucide-react';
import { useProgressStore } from '@/stores/progressStore';

const AchievementsPage: React.FC = () => {
  const { progress, initialize } = useProgressStore();
  
  useEffect(() => {
    initialize();
  }, []);
  
  // Sample achievements for demo
  const sampleAchievements = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first lesson',
      category: 'learning',
      difficulty: 'bronze',
      xpReward: 50,
      unlockedAt: new Date().toISOString(),
      isUnlocked: (progress?.completedLessons?.length || 0) > 0
    },
    {
      id: '2', 
      name: 'Dedicated Learner',
      description: 'Complete 5 lessons',
      category: 'learning',
      difficulty: 'silver',
      xpReward: 100,
      unlockedAt: new Date().toISOString(),
      isUnlocked: (progress?.completedLessons?.length || 0) >= 5
    },
    {
      id: '3',
      name: 'Knowledge Seeker', 
      description: 'Complete 10 lessons',
      category: 'learning',
      difficulty: 'gold',
      xpReward: 200,
      unlockedAt: new Date().toISOString(),
      isUnlocked: (progress?.completedLessons?.length || 0) >= 10
    },
    {
      id: '4',
      name: 'Note Taker',
      description: 'Add your first note',
      category: 'engagement',
      difficulty: 'bronze', 
      xpReward: 25,
      unlockedAt: new Date().toISOString(),
      isUnlocked: false
    },
    {
      id: '5',
      name: 'Highlighter',
      description: 'Highlight text for the first time',
      category: 'engagement',
      difficulty: 'bronze',
      xpReward: 25, 
      unlockedAt: new Date().toISOString(),
      isUnlocked: false
    }
  ];
  
  const unlockedAchievements = sampleAchievements.filter(a => a.isUnlocked);
  const lockedAchievements = sampleAchievements.filter(a => !a.isUnlocked);



  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return <Medal className="w-6 h-6 text-orange-600" />;
      case 'silver': return <Medal className="w-6 h-6 text-gray-400" />;
      case 'gold': return <Crown className="w-6 h-6 text-yellow-500" />;
      default: return <Trophy className="w-6 h-6 text-blue-500" />;
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze': return 'bg-orange-100 text-orange-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

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
            <div className="text-2xl font-bold text-green-500">
              {unlockedAchievements.length}
            </div>
            <div className="text-sm text-gray-600">
              Unlocked
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {progress?.completedLessons?.length || 0}
            </div>
            <div className="text-sm text-gray-600">
              Lessons Done
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
          Unlocked Achievements
        </h2>
        {unlockedAchievements.length > 0 ? (
          <div className="grid gap-4">
            {unlockedAchievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="mr-4">
                  {getDifficultyIcon(achievement.difficulty)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(achievement.difficulty)}`}>
                      {achievement.difficulty.toUpperCase()}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                </div>
                <Star className="w-6 h-6 text-yellow-500 fill-current" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Complete your first lesson to unlock achievements!
            </p>
          </div>
        )}
      </div>

      {/* Locked Achievements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Target className="w-6 h-6 mr-2 text-gray-500" />
          Available Achievements
        </h2>
        <div className="grid gap-4">
          {lockedAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75">
              <div className="mr-4 grayscale">
                {getDifficultyIcon(achievement.difficulty)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700">
                  {achievement.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {achievement.description}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    {achievement.difficulty.toUpperCase()}
                  </span>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    +{achievement.xpReward} XP
                  </span>
                </div>
              </div>
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-500" />
          Your Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {Math.round((unlockedAchievements.length / sampleAchievements.length) * 100)}%
            </div>
            <p className="text-sm text-gray-600">
              Achievements Unlocked
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0)}
            </div>
            <p className="text-sm text-gray-600">
              XP from Achievements
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {progress?.level || 1}
            </div>
            <p className="text-sm text-gray-600">
              Current Level
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;