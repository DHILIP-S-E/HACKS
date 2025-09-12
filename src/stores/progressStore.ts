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
          const updatedProgress = await localAdapter.updateProgress({
            ...currentProgress,
            totalXP: currentProgress.totalXP + xp,
            lastActivity: new Date().toISOString(),
            level: Math.floor((currentProgress.totalXP + xp) / 100) + 1,
          });

          set({ progress: updatedProgress });

          // Check for level up
          const newLevel = Math.floor(updatedProgress.totalXP / 100) + 1;
          if (newLevel > currentProgress.level) {
            await get().awardBadge('level_up');
          }

          // Update streak
          const today = new Date().toDateString();
          const lastActivity = new Date(currentProgress.lastActivity).toDateString();
          if (today !== lastActivity) {
            const streak = currentProgress.streak + 1;
            const finalProgress = await localAdapter.updateProgress({
              ...updatedProgress,
              streak,
            });
            set({ progress: finalProgress });
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

      markLessonComplete: async (lessonId: string) => {
        const { progress: currentProgress } = get();
        console.log('markLessonComplete called with:', lessonId);
        console.log('Current progress in store:', currentProgress);
        
        if (!currentProgress) {
          console.error('No progress found in store');
          return;
        }
        
        if (currentProgress.completedLessons?.includes(lessonId)) {
          console.log('Lesson already completed');
          return;
        }

        try {
          const updatedProgress = {
            ...currentProgress,
            completedLessons: [...(currentProgress.completedLessons || []), lessonId],
          };
          
          console.log('Updating progress with:', updatedProgress);
          const savedProgress = await localAdapter.updateProgress(updatedProgress);
          
          set({ progress: savedProgress });
          console.log('Progress updated successfully');
          
          // Award XP for completion
          await get().updateProgress(50, `Completed lesson ${lessonId}`);
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