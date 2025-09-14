import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { localAuthAdapter } from '@/lib/adapters/localAdapter'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  clearError: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        
        try {
          const user = await localAuthAdapter.signIn(email, password)
          set({ user, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign in failed',
            isLoading: false 
          })
          throw error
        }
      },

      signUp: async (email: string, password: string, userData: Partial<User>) => {
        set({ isLoading: true, error: null })
        
        try {
          const user = await localAuthAdapter.signUp(email, password, userData)
          set({ user, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign up failed',
            isLoading: false 
          })
          throw error
        }
      },

      signOut: async () => {
        set({ isLoading: true })
        
        try {
          await localAuthAdapter.signOut()
          set({ user: null, isLoading: false, error: null })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Sign out failed',
            isLoading: false 
          })
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null })
        
        try {
          await localAuthAdapter.resetPassword(email)
          set({ isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Password reset failed',
            isLoading: false 
          })
          throw error
        }
      },

      clearError: () => {
        set({ error: null })
      },

      checkAuth: async () => {
        set({ isLoading: true })
        
        try {
          const user = await localAuthAdapter.getCurrentUser()
          set({ user, isLoading: false })
        } catch (error) {
          set({ user: null, isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)