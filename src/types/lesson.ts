export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  authorId: string;
  authorName: string;
  subject: string;
  gradeLevel: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // in minutes
  tags: string[];
  attachments: Attachment[];
  accessibility: AccessibilityArtifacts;
  version: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  metadata: LessonMetadata;
}

export interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  processingStatus: ProcessingStatus;
  uploadedAt: string;
}

export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AccessibilityArtifacts {
  summary?: string;
  simplifiedText?: string;
  ttsAudioUrl?: string;
  captionsUrl?: string;
  altTexts: Record<string, string>; // imageId -> alt text
  signLanguageVideoUrl?: string;
  transcripts: Record<string, string>; // videoId -> transcript
  segmentMap?: ContentSegment[];
  lastProcessed?: string;
  verificationStatus: 'unverified' | 'verified_by_teacher' | 'needs_attention' | 'published';
}

export interface ContentSegment {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'quiz';
  startPosition: number;
  endPosition: number;
  content: string;
  metadata: Record<string, any>;
}

export interface LessonMetadata {
  readingLevel?: number;
  wordCount?: number;
  averageWordsPerSentence?: number;
  complexityScore?: number;
  topics?: string[];
  prerequisites?: string[];
  learningObjectives?: string[];
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'needs_review';
  completionPercentage: number;
  timeSpent: number; // in minutes
  startedAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  bookmarks: number[]; // position in content
  highlights: string[]; // highlight IDs
  notes: string[]; // note IDs
  quiz_attempts: QuizAttempt[];
  accessibility_used: string[]; // which accessibility features were used
}

export interface QuizAttempt {
  id: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  maxScore: number;
  answers: Record<string, any>;
  timeSpent: number;
}

export interface LessonVersion {
  id: string;
  lessonId: string;
  version: number;
  changes: string;
  createdBy: string;
  createdAt: string;
  snapshot: Partial<Lesson>;
}

export interface LessonTemplate {
  id: string;
  name: string;
  description: string;
  structure: any;
  authorId: string;
  isPublic: boolean;
  createdAt: string;
}