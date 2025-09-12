import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { localAdapter } from '@/lib/adapters/localAdapter';
import type { User, UserRole } from '@/types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isInitialized: false,

      initialize: async () => {
        if (get().isInitialized) return;
        
        set({ isLoading: true });
        try {
          // Initialize default users first
          await localAdapter.initializeDefaultUsers();
          const user = await localAdapter.getCurrentUser();
          set({ user, isInitialized: true });
        } catch (error) {
          console.error('Auth initialization failed:', error);
          set({ user: null, isInitialized: true });
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await localAdapter.login(email, password);
          set({ user });
          return user;
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (email: string, password: string, name: string, role: UserRole) => {
        set({ isLoading: true });
        try {
          const user = await localAdapter.register({ email, password, name, role });
          set({ user });
        } catch (error) {
          console.error('Registration failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await localAdapter.logout();
          set({ user: null });
        } catch (error) {
          console.error('Logout failed:', error);
          throw error;
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) throw new Error('No user to update');

        set({ isLoading: true });
        try {
          const updatedUser = await localAdapter.updateUser(user.id, updates);
          set({ user: updatedUser });
        } catch (error) {
          console.error('Profile update failed:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);