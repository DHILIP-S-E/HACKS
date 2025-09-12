export interface Progress {
  id: string;
  userId: string;
  level: number;
  totalXP: number;
  streak: number;
  lastActivity: string;
  completedLessons: string[];
  achievements: string[];
  weeklyGoal?: number;
  monthlyGoal?: number;
  stats: ProgressStats;
}

export interface ProgressStats {
  totalTimeSpent: number; // in minutes
  averageSessionTime: number;
  lessonsCompleted: number;
  quizzesCompleted: number;
  averageScore: number;
  highlightsMade: number;
  notesCreated: number;
  accessibilityFeaturesUsed: Record<string, number>;
  subjectProgress: Record<string, SubjectProgress>;
}

export interface SubjectProgress {
  subject: string;
  lessonsCompleted: number;
  totalLessons: number;
  averageScore: number;
  timeSpent: number;
  lastAccessed: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: 'learning' | 'achievement' | 'streak' | 'social' | 'accessibility';
  requirements: BadgeRequirement[];
  awardedAt: string;
}

export interface BadgeRequirement {
  type: 'lessons_completed' | 'streak_days' | 'xp_earned' | 'quiz_score' | 'feature_usage';
  value: number;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  xpReward: number;
  badgeReward?: string;
  requirements: AchievementRequirement[];
  unlockedAt: string;
  progress?: AchievementProgress;
}

export interface AchievementRequirement {
  id: string;
  type: string;
  targetValue: number;
  currentValue?: number;
  description: string;
}

export interface AchievementProgress {
  currentValue: number;
  targetValue: number;
  percentage: number;
  isCompleted: boolean;
}

export interface Leaderboard {
  id: string;
  name: string;
  description: string;
  type: 'global' | 'class' | 'school' | 'friends';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'all_time';
  metric: 'xp' | 'lessons_completed' | 'streak' | 'quiz_score';
  entries: LeaderboardEntry[];
  updatedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  change: number; // change in rank from previous period
}

export interface LevelInfo {
  level: number;
  xpRequired: number;
  xpForNext: number;
  title: string;
  description: string;
  rewards: LevelReward[];
}

export interface LevelReward {
  type: 'badge' | 'feature' | 'customization';
  id: string;
  name: string;
  description: string;
}

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  streakStartDate: string;
  milestones: StreakMilestone[];
}

export interface StreakMilestone {
  days: number;
  reward: string;
  achieved: boolean;
  achievedAt?: string;
}