import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProgressMetrics, Badge } from '@/types'

interface ProgressState {
  metrics: ProgressMetrics | null
  
  // Actions
  updateProgress: (lessonId: string, timeSpent: number) => void
  awardBadge: (badge: Badge) => void
  calculateLevel: (xp: number) => number
  addXP: (amount: number) => void
}

const defaultMetrics: ProgressMetrics = {
  userId: '',
  totalLessonsCompleted: 0,
  totalTimeSpent: 0,
  currentLevel: 1,
  currentXP: 0,
  badges: [],
  streakDays: 0,
  lastActivityAt: new Date().toISOString(),
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      metrics: null,

      updateProgress: (lessonId: string, timeSpent: number) => {
        set((state) => {
          if (!state.metrics) return state

          const newXP = state.metrics.currentXP + Math.floor(timeSpent / 60) * 10 // 10 XP per minute
          const newLevel = get().calculateLevel(newXP)
          
          return {
            metrics: {
              ...state.metrics,
              totalLessonsCompleted: state.metrics.totalLessonsCompleted + 1,
              totalTimeSpent: state.metrics.totalTimeSpent + timeSpent,
              currentXP: newXP,
              currentLevel: newLevel,
              lastActivityAt: new Date().toISOString(),
            }
          }
        })
      },

      awardBadge: (badge: Badge) => {
        set((state) => {
          if (!state.metrics) return state

          const existingBadge = state.metrics.badges.find(b => b.id === badge.id)
          if (existingBadge) return state

          return {
            metrics: {
              ...state.metrics,
              badges: [...state.metrics.badges, badge]
            }
          }
        })
      },

      calculateLevel: (xp: number) => {
        return Math.floor(xp / 1000) + 1 // Level up every 1000 XP
      },

      addXP: (amount: number) => {
        set((state) => {
          if (!state.metrics) return state

          const newXP = state.metrics.currentXP + amount
          const newLevel = get().calculateLevel(newXP)

          return {
            metrics: {
              ...state.metrics,
              currentXP: newXP,
              currentLevel: newLevel,
            }
          }
        })
      },
    }),
    {
      name: 'progress-storage',
    }
  )
)