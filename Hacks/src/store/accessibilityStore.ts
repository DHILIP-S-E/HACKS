import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AccessibilityPreferences } from '@/types'

interface AccessibilityState {
  preferences: AccessibilityPreferences
  isReadingMode: boolean
  currentReadingPosition: number
  
  // Actions
  updatePreferences: (preferences: Partial<AccessibilityPreferences>) => void
  toggleReadingMode: () => void
  setReadingPosition: (position: number) => void
  resetPreferences: () => void
}

const defaultPreferences: AccessibilityPreferences = {
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'default',
  lineHeight: 1.5,
  letterSpacing: 0,
  ttsSpeed: 1.0,
  ttsVoice: undefined,
  colorOverlay: undefined,
  readingRuler: false,
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      preferences: defaultPreferences,
      isReadingMode: false,
      currentReadingPosition: 0,

      updatePreferences: (newPreferences: Partial<AccessibilityPreferences>) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...newPreferences,
          },
        }))
      },

      toggleReadingMode: () => {
        set((state) => ({
          isReadingMode: !state.isReadingMode,
        }))
      },

      setReadingPosition: (position: number) => {
        set({ currentReadingPosition: position })
      },

      resetPreferences: () => {
        set({ preferences: defaultPreferences })
      },
    }),
    {
      name: 'accessibility-storage',
      partialize: (state) => ({ preferences: state.preferences }),
    }
  )
)