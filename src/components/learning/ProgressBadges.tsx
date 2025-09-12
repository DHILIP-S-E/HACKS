import React from 'react';
import { Badge, Achievement, LevelInfo } from '../../types/progress';
import { Trophy, Star, Zap, Target } from 'lucide-react';

interface ProgressBadgesProps {
  badges: Badge[];
  achievements: Achievement[];
  currentLevel: LevelInfo;
  xp: number;
}

export const ProgressBadges: React.FC<ProgressBadgesProps> = ({
  badges,
  achievements,
  currentLevel,
  xp
}) => {
  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Trophy className="w-4 h-4" />;
      case 'streak': return <Zap className="w-4 h-4" />;
      case 'learning': return <Target className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const progressToNext = currentLevel.xpForNext > 0 ? 
    ((xp - (currentLevel.xpRequired - currentLevel.xpForNext)) / currentLevel.xpForNext) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Level {currentLevel.level}</h3>
          <span className="text-sm text-gray-600">{xp} XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressToNext, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">{currentLevel.title}</p>
      </div>

      {/* Recent Badges */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold mb-3">Recent Badges</h3>
        <div className="grid grid-cols-2 gap-2">
          {badges.slice(0, 4).map(badge => (
            <div key={badge.id} className={`p-2 rounded-lg ${getRarityColor(badge.rarity)}`}>
              <div className="flex items-center gap-2">
                {getBadgeIcon(badge.category)}
                <span className="text-sm font-medium">{badge.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Progress */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="font-semibold mb-3">Achievements</h3>
        <div className="space-y-2">
          {achievements.slice(0, 3).map(achievement => (
            <div key={achievement.id} className="border rounded p-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{achievement.name}</span>
                <span className="text-xs text-gray-500">{achievement.difficulty}</span>
              </div>
              {achievement.progress && (
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${achievement.progress.percentage}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};