import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type TextSpacing = 'tight' | 'normal' | 'wide' | 'extra-wide';
export type FontSize = 14 | 16 | 18 | 20 | 24;

interface AccessibilityState {
  // Theme settings
  theme: Theme;
  highContrast: boolean;
  
  // Typography settings
  dyslexicFont: boolean;
  fontSize: FontSize;
  textSpacing: TextSpacing;
  
  // Motion settings
  reducedMotion: boolean;
  
  // Reading tools
  readingRuler: boolean;
  readingRulerPosition: number;
  
  // TTS settings
  ttsEnabled: boolean;
  ttsSpeed: number;
  ttsPitch: number;
  ttsVoice: string | null;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleHighContrast: () => void;
  toggleDyslexicFont: () => void;
  setFontSize: (size: FontSize) => void;
  setTextSpacing: (spacing: TextSpacing) => void;
  toggleReducedMotion: () => void;
  toggleReadingRuler: () => void;
  setReadingRulerPosition: (position: number) => void;
  setTTSSettings: (settings: { speed?: number; pitch?: number; voice?: string }) => void;
  initialize: () => Promise<void>;
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      highContrast: false,
      dyslexicFont: false,
      fontSize: 16,
      textSpacing: 'normal',
      reducedMotion: false,
      readingRuler: false,
      readingRulerPosition: 0,
      ttsEnabled: true,
      ttsSpeed: 1,
      ttsPitch: 1,
      ttsVoice: null,

      initialize: async () => {
        // Check for system preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        const state = get();
        
        // Apply system preferences if not already set
        if (state.theme === 'system') {
          document.documentElement.classList.toggle('dark', prefersDark);
        }
        
        if (!state.reducedMotion && prefersReducedMotion) {
          set({ reducedMotion: true });
        }

        // Check for TTS voices
        if ('speechSynthesis' in window) {
          const voices = speechSynthesis.getVoices();
          if (voices.length > 0 && !state.ttsVoice) {
            const defaultVoice = voices.find(voice => voice.default) || voices[0];
            set({ ttsVoice: defaultVoice.name });
          }
        }
      },

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', prefersDark);
        } else {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      toggleHighContrast: () => {
        set((state) => ({ highContrast: !state.highContrast }));
      },

      toggleDyslexicFont: () => {
        try {
          set((state) => ({ dyslexicFont: !state.dyslexicFont }));
        } catch (error) {
          console.error('Error toggling dyslexic font:', error);
        }
      },

      setFontSize: (fontSize) => {
        set({ fontSize });
      },

      setTextSpacing: (textSpacing) => {
        set({ textSpacing });
      },

      toggleReducedMotion: () => {
        set((state) => ({ reducedMotion: !state.reducedMotion }));
      },

      toggleReadingRuler: () => {
        set((state) => ({ readingRuler: !state.readingRuler }));
      },

      setReadingRulerPosition: (readingRulerPosition) => {
        set({ readingRulerPosition });
      },

      setTTSSettings: (settings) => {
        set((state) => ({
          ttsSpeed: settings.speed ?? state.ttsSpeed,
          ttsPitch: settings.pitch ?? state.ttsPitch,
          ttsVoice: settings.voice ?? state.ttsVoice,
        }));
      },
    }),
    {
      name: 'accessibility-storage',
    }
  )
);