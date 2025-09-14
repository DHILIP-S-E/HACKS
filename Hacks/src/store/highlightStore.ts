import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { HighlightNote } from '@/types'

interface HighlightState {
  highlights: HighlightNote[]
  
  // Actions
  addHighlight: (highlight: Omit<HighlightNote, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateHighlight: (id: string, updates: Partial<HighlightNote>) => void
  deleteHighlight: (id: string) => void
  getHighlightsForLesson: (lessonId: string) => HighlightNote[]
  clearHighlights: () => void
}

export const useHighlightStore = create<HighlightState>()(
  persist(
    (set, get) => ({
      highlights: [],

      addHighlight: (highlightData) => {
        const highlight: HighlightNote = {
          ...highlightData,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => ({
          highlights: [...state.highlights, highlight]
        }))
      },

      updateHighlight: (id: string, updates: Partial<HighlightNote>) => {
        set((state) => ({
          highlights: state.highlights.map(highlight =>
            highlight.id === id
              ? { ...highlight, ...updates, updatedAt: new Date().toISOString() }
              : highlight
          )
        }))
      },

      deleteHighlight: (id: string) => {
        set((state) => ({
          highlights: state.highlights.filter(highlight => highlight.id !== id)
        }))
      },

      getHighlightsForLesson: (lessonId: string) => {
        return get().highlights.filter(highlight => highlight.lessonId === lessonId)
      },

      clearHighlights: () => {
        set({ highlights: [] })
      },
    }),
    {
      name: 'highlight-storage',
    }
  )
)