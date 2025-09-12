export interface Highlight {
  id: string;
  userId: string;
  lessonId: string;
  startPosition: number;
  endPosition: number;
  text: string;
  color: string;
  note?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Note {
  id: string;
  userId: string;
  lessonId: string;
  highlightId?: string;
  content: string;
  type: 'text' | 'voice' | 'image';
  voiceUrl?: string;
  imageUrl?: string;
  position?: number; // position in lesson content
  tags?: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface VoiceNote {
  id: string;
  noteId: string;
  audioUrl: string;
  duration: number; // in seconds
  transcription?: string;
  waveform?: number[]; // audio waveform data
  createdAt: string;
}

export interface ContentAnnotation {
  id: string;
  userId: string;
  lessonId: string;
  type: 'highlight' | 'note' | 'bookmark' | 'question' | 'suggestion';
  position: ContentPosition;
  data: any;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ContentPosition {
  type: 'text' | 'image' | 'video' | 'audio';
  elementId?: string;
  startOffset?: number;
  endOffset?: number;
  timestamp?: number; // for video/audio
}

export interface ReadingSession {
  id: string;
  userId: string;
  lessonId: string;
  startTime: string;
  endTime?: string;
  readingSpeed?: number; // words per minute
  comprehensionScore?: number;
  accessibility: {
    ttsUsed: boolean;
    highlightsUsed: boolean;
    notesUsed: boolean;
    fontAdjusted: boolean;
    contrastAdjusted: boolean;
  };
  interactions: ReadingInteraction[];
}

export interface ReadingInteraction {
  type: 'highlight' | 'note' | 'tts_play' | 'tts_pause' | 'scroll' | 'zoom' | 'search';
  timestamp: string;
  position?: number;
  data?: any;
}

export interface ContentMetrics {
  totalViews: number;
  uniqueViewers: number;
  averageTimeSpent: number;
  completionRate: number;
  highlightCount: number;
  noteCount: number;
  averageRating?: number;
  accessibilityUsage: {
    tts: number;
    highContrast: number;
    dyslexicFont: number;
    largeText: number;
    captions: number;
  };
}

export interface SearchResult {
  id: string;
  type: 'lesson' | 'note' | 'highlight';
  title: string;
  snippet: string;
  score: number;
  lessonId: string;
  position?: number;
  metadata: {
    subject?: string;
    author?: string;
    createdAt: string;
    tags?: string[];
  };
}

export interface ContentFilter {
  subjects?: string[];
  authors?: string[];
  difficulty?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  hasNotes?: boolean;
  hasHighlights?: boolean;
  completionStatus?: 'completed' | 'in_progress' | 'not_started';
}