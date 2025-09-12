import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { localAdapter } from '@/lib/adapters/localAdapter';
import type { Progress, Badge, Achievement } from '@/types/progress';

interface ProgressState {
  progress: Progress | null;
  badges: Badge[];
  achievements: Achievement[];
  isLoading: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  updateProgress: (xp: number, activity: string) => Promise<void>;
  awardBadge: (badgeId: string) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  getProgressForLesson: (lessonId: string) => Promise<any>;
  updateLessonProgress: (lessonId: string, progress: any) => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: null,
      badges: [],
      achievements: [],
      isLoading: false,

      initialize: async () => {
        set({ isLoading: true });
        try {
          let progress = await localAdapter.getUserProgress();
          
          // If no progress exists, create initial progress
          if (!progress) {
            const currentUser = await localAdapter.getCurrentUser();
            if (currentUser) {
              progress = {
                id: `progress_${currentUser.id}`,
                userId: currentUser.id,
                level: 1,
                totalXP: 0,
                streak: 0,
                lastActivity: new Date().toISOString(),
                completedLessons: [],
                achievements: [],
              };
              await localAdapter.updateProgress(progress);
            }
          }
          
          const badges = await localAdapter.getUserBadges();
          const achievements = await localAdapter.getUserAchievements();
          
          set({ progress, badges, achievements });
          console.log('Progress store initialized:', { progress, badges: badges.length, achievements: achievements.length });
        } catch (error) {
          console.error('Failed to initialize progress:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateProgress: async (xp: number, activity: string) => {
        const { progress: currentProgress } = get();
        if (!currentProgress) return;

        try {
          const newTotalXP = currentProgress.totalXP + xp;
          const newLevel = Math.floor(newTotalXP / 100) + 1;
          const today = new Date().toDateString();
          const lastActivity = new Date(currentProgress.lastActivity).toDateString();
          const newStreak = today !== lastActivity ? currentProgress.streak + 1 : currentProgress.streak;
          
          const updatedProgress = await localAdapter.updateProgress({
            ...currentProgress,
            totalXP: newTotalXP,
            level: newLevel,
            streak: newStreak,
            lastActivity: new Date().toISOString(),
          });

          set({ progress: updatedProgress });

          // Check for level up badge
          if (newLevel > currentProgress.level) {
            await get().awardBadge('level_up');
          }
          
          // Check for streak badges
          if (newStreak === 7) {
            await get().awardBadge('streak_7');
          }
          if (newStreak === 30) {
            await get().awardBadge('streak_30');
          }
        } catch (error) {
          console.error('Failed to update progress:', error);
        }
      },

      awardBadge: async (badgeId: string) => {
        const { badges } = get();
        if (badges.find(b => b.id === badgeId)) return;

        try {
          const badge = await localAdapter.awardBadge(badgeId);
          set({ badges: [...badges, badge] });
        } catch (error) {
          console.error('Failed to award badge:', error);
        }
      },

      unlockAchievement: async (achievementId: string) => {
        const { achievements } = get();
        if (achievements.find(a => a.id === achievementId)) return;

        try {
          const achievement = await localAdapter.unlockAchievement(achievementId);
          set({ achievements: [...achievements, achievement] });
        } catch (error) {
          console.error('Failed to unlock achievement:', error);
        }
      },

      getProgressForLesson: async (lessonId: string) => {
        try {
          return await localAdapter.getLessonProgress(lessonId);
        } catch (error) {
          console.error('Failed to get lesson progress:', error);
          return null;
        }
      },

      updateLessonProgress: async (lessonId: string, progress: any) => {
        try {
          await localAdapter.updateLessonProgress(lessonId, progress);
        } catch (error) {
          console.error('Failed to update lesson progress:', error);
        }
      },

      markLessonComplete: async (lessonId: string) => {
        const { progress: currentProgress } = get();
        
        if (!currentProgress || currentProgress.completedLessons?.includes(lessonId)) {
          return;
        }

        try {
          const updatedProgress = {
            ...currentProgress,
            completedLessons: [...(currentProgress.completedLessons || []), lessonId],
          };
          
          const savedProgress = await localAdapter.updateProgress(updatedProgress);
          set({ progress: savedProgress });
          
          // Award XP for completion
          await get().updateProgress(50, `Completed lesson ${lessonId}`);
          
          // Check for achievements
          const completedCount = updatedProgress.completedLessons.length;
          if (completedCount === 1) {
            await get().awardBadge('first_lesson');
          }
          if (completedCount === 10) {
            await get().unlockAchievement('perfectionist');
          }
          if (completedCount === 100) {
            await get().unlockAchievement('scholar');
          }
        } catch (error) {
          console.error('Failed to mark lesson as complete:', error);
          throw error;
        }
      },
    }),
    {
      name: 'progress-storage',
      partialize: (state) => ({
        progress: state.progress,
        badges: state.badges,
        achievements: state.achievements,
      }),
    }
  )
);