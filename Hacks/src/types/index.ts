// Core Entity Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin' | 'parent';
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  disabilityTags: DisabilityTag[];
  preferences: AccessibilityPreferences;
  language: string;
  createdAt: string;
  updatedAt: string;
}

export interface DisabilityTag {
  type: 'dyslexia' | 'adhd' | 'visual' | 'hearing' | 'motor' | 'cognitive';
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface AccessibilityPreferences {
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  fontFamily: 'default' | 'dyslexia-friendly';
  lineHeight: number;
  letterSpacing: number;
  ttsSpeed: number;
  ttsVoice?: string;
  colorOverlay?: string;
  readingRuler: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  body: string;
  teacherId: string;
  subject: string;
  grade: string;
  tags: string[];
  attachments: Attachment[];
  accessibility: AccessibilityArtifact;
  status: 'draft' | 'published' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  lessonId: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  processingStatus: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface AccessibilityArtifact {
  summary?: string;
  ttsUrl?: string;
  captions?: Caption[];
  altTexts?: Record<string, string>;
  signVideoUrl?: string;
  segmentMap?: ContentSegment[];
  verificationStatus: 'unverified' | 'verified_by_teacher' | 'needs_attention' | 'published';
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Caption {
  start: number;
  end: number;
  text: string;
  language: string;
}

export interface ContentSegment {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
  startOffset?: number;
  endOffset?: number;
  metadata?: Record<string, any>;
}

export interface Attempt {
  id: string;
  studentId: string;
  lessonId: string;
  answers: Record<string, any>;
  score?: number;
  feedback?: string;
  status: 'in_progress' | 'submitted' | 'graded';
  startedAt: string;
  submittedAt?: string;
  gradedAt?: string;
}

// Job Queue Types
export type JobType = 'ocr' | 'tts' | 'transcribe' | 'summarize' | 'image_description' | 'video_process';

export interface Job {
  id: string;
  type: JobType;
  lessonId: string;
  attachmentId?: string;
  status: 'queued' | 'processing' | 'retrying' | 'completed' | 'failed';
  attempts: number;
  maxAttempts: number;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

// Adapter Interfaces
export interface AIAdapter {
  summarizeText(text: string, options?: { language?: string; complexity?: 'simple' | 'moderate' }): Promise<string>;
  generateTTS(text: string, options?: { voice?: string; speed?: number; language?: string }): Promise<string>;
  transcribeAudio(audioUrl: string, options?: { language?: string }): Promise<string>;
  generateImageDescription(imageUrl: string, options?: { language?: string }): Promise<string>;
  translateText(text: string, targetLanguage: string): Promise<string>;
}

export interface StorageAdapter {
  uploadFile(file: File, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
  initResumableUpload(file: File): Promise<{ uploadId: string; chunkSize: number }>;
  uploadChunk(uploadId: string, chunkIndex: number, chunkData: ArrayBuffer): Promise<{ progress: number }>;
  completeUpload(uploadId: string): Promise<{ attachment: Attachment }>;
}

export interface AuthAdapter {
  signUp(email: string, password: string, userData: Partial<User>): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  resetPassword(email: string): Promise<void>;
}

export interface ProcessingAdapter {
  enqueueProcessingJob(jobInput: Omit<Job, 'id' | 'status' | 'attempts' | 'createdAt' | 'updatedAt'>): Promise<Job>;
  getJobStatus(jobId: string): Promise<Job>;
  cancelJob(jobId: string): Promise<void>;
  retryJob(jobId: string): Promise<Job>;
}

// UI State Types
export interface HighlightNote {
  id: string;
  lessonId: string;
  userId: string;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  note: string;
  voiceNote?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressMetrics {
  userId: string;
  totalLessonsCompleted: number;
  totalTimeSpent: number;
  currentLevel: number;
  currentXP: number;
  badges: Badge[];
  streakDays: number;
  lastActivityAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: string;
  category: 'completion' | 'streak' | 'improvement' | 'special';
}

export interface SearchFilters {
  query?: string;
  subject?: string;
  grade?: string;
  teacher?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  status?: 'draft' | 'published' | 'archived';
}