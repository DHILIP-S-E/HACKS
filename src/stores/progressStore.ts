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
          const progress = await localAdapter.getUserProgress();
          const badges = await localAdapter.getUserBadges();
          const achievements = await localAdapter.getUserAchievements();
          
          set({ progress, badges, achievements });
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
          const updatedProgress = await localAdapter.updateProgress({
            ...currentProgress,
            totalXP: currentProgress.totalXP + xp,
            lastActivity: new Date().toISOString(),
          });

          set({ progress: updatedProgress });

          // Check for level up
          const newLevel = Math.floor(updatedProgress.totalXP / 100) + 1;
          if (newLevel > currentProgress.level) {
            await get().awardBadge('level_up');
            // Could trigger celebration UI here
          }

          // Update streak
          const today = new Date().toDateString();
          const lastActivity = new Date(currentProgress.lastActivity).toDateString();
          if (today !== lastActivity) {
            const streak = currentProgress.streak + 1;
            await localAdapter.updateProgress({
              ...updatedProgress,
              streak,
            });
          }
        } catch (error) {
          console.error('Failed to update progress:', error);
        }
      },

      awardBadge: async (badgeId: string) => {
        const { badges } = get();
        if (badges.find(b => b.id === badgeId)) return; // Already has badge

        try {
          const badge = await localAdapter.awardBadge(badgeId);
          set({ badges: [...badges, badge] });
        } catch (error) {
          console.error('Failed to award badge:', error);
        }
      },

      unlockAchievement: async (achievementId: string) => {
        const { achievements } = get();
        if (achievements.find(a => a.id === achievementId)) return; // Already unlocked

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