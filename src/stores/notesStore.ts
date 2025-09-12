import { create } from 'zustand';
import { Highlight, Note } from '../types/notes';

interface NotesState {
  highlights: Record<string, Highlight[]>; // lessonId -> highlights
  notes: Record<string, Note[]>; // lessonId -> notes
  addHighlight: (lessonId: string, highlight: Highlight) => void;
  addNote: (lessonId: string, note: Note) => void;
  removeHighlight: (lessonId: string, highlightId: string) => void;
  removeNote: (lessonId: string, noteId: string) => void;
  getHighlights: (lessonId: string) => Highlight[];
  getNotes: (lessonId: string) => Note[];
}

export const useNotesStore = create<NotesState>((set, get) => ({
  highlights: {},
  notes: {},
  
  addHighlight: (lessonId, highlight) => set(state => ({
    highlights: {
      ...state.highlights,
      [lessonId]: [...(state.highlights[lessonId] || []), highlight]
    }
  })),
  
  addNote: (lessonId, note) => set(state => ({
    notes: {
      ...state.notes,
      [lessonId]: [...(state.notes[lessonId] || []), note]
    }
  })),
  
  removeHighlight: (lessonId, highlightId) => set(state => ({
    highlights: {
      ...state.highlights,
      [lessonId]: (state.highlights[lessonId] || []).filter(h => h.id !== highlightId)
    }
  })),
  
  removeNote: (lessonId, noteId) => set(state => ({
    notes: {
      ...state.notes,
      [lessonId]: (state.notes[lessonId] || []).filter(n => n.id !== noteId)
    }
  })),
  
  getHighlights: (lessonId) => get().highlights[lessonId] || [],
  getNotes: (lessonId) => get().notes[lessonId] || []
}));