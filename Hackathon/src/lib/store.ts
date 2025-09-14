import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AccessibilityPreferences } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

interface AccessibilityState {
  preferences: AccessibilityPreferences
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void
  resetPreferences: () => void
}

interface UIState {
  theme: 'light' | 'dark' | 'system'
  language: string
  sidebarOpen: boolean
  readingRuler: boolean
  ttsActive: boolean
  sttActive: boolean
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLanguage: (language: string) => void
  toggleSidebar: () => void
  toggleReadingRuler: () => void
  setTTSActive: (active: boolean) => void
  setSTTActive: (active: boolean) => void
}

const defaultAccessibilityPreferences: AccessibilityPreferences = {
  fontSize: 'medium',
  fontFamily: 'default',
  highContrast: false,
  darkMode: false,
  reducedMotion: false,
  screenReader: false,
  ttsEnabled: true,
  ttsSpeed: 1,
  ttsVoice: undefined,
  colorOverlay: undefined,
  lineSpacing: 1.5,
  letterSpacing: 0,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
)

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      preferences: defaultAccessibilityPreferences,
      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
      resetPreferences: () =>
        set({ preferences: defaultAccessibilityPreferences }),
    }),
    {
      name: 'accessibility-storage',
    }
  )
)

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'en',
      sidebarOpen: true,
      readingRuler: false,
      ttsActive: false,
      sttActive: false,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleReadingRuler: () => set((state) => ({ readingRuler: !state.readingRuler })),
      setTTSActive: (active) => set({ ttsActive: active }),
      setSTTActive: (active) => set({ sttActive: active }),
    }),
    {
      name: 'ui-storage',
    }
  )
)