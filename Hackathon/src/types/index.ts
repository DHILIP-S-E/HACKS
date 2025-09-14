export type UserRole = 'student' | 'teacher' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  userId: string
  disabilityTags: string[]
  preferences: AccessibilityPreferences
  learningPath?: string[]
  createdAt: string
  updatedAt: string
}

export interface AccessibilityPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  fontFamily: 'default' | 'dyslexia-friendly'
  highContrast: boolean
  darkMode: boolean
  reducedMotion: boolean
  screenReader: boolean
  ttsEnabled: boolean
  ttsSpeed: number
  ttsVoice?: string
  colorOverlay?: string
  lineSpacing: number
  letterSpacing: number
}

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  teacherId: string
  subject: string
  gradeLevel: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  attachments: Attachment[]
  accessibility: AccessibilityArtifact
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  lessonId: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  processingStatus: ProcessingStatus
  createdAt: string
}

export interface AccessibilityArtifact {
  id: string
  lessonId: string
  summary?: string
  ttsUrl?: string
  captions?: Caption[]
  altTexts?: Record<string, string>
  signLanguageUrl?: string
  simplifiedText?: string
  semanticSegments?: SemanticSegment[]
  status: 'unverified' | 'verified_by_teacher' | 'needs_attention' | 'published'
  createdAt: string
  updatedAt: string
}

export interface Caption {
  start: number
  end: number
  text: string
}

export interface SemanticSegment {
  id: string
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'video' | 'audio'
  content: string
  metadata?: Record<string, any>
}

export type ProcessingStatus = 'queued' | 'processing' | 'completed' | 'failed'

export type JobType = 'ocr' | 'tts' | 'transcribe' | 'summarize' | 'image_description' | 'video_process'

export interface Job {
  id: string
  type: JobType
  lessonId: string
  attachmentId?: string
  status: 'queued' | 'processing' | 'retrying' | 'completed' | 'failed'
  attempts: number
  maxAttempts: number
  result?: any
  error?: string
  createdAt: string
  updatedAt: string
}

export interface Assessment {
  id: string
  lessonId: string
  title: string
  questions: Question[]
  timeLimit?: number
  attempts: number
  createdAt: string
}

export interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay'
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
}

export interface Attempt {
  id: string
  assessmentId: string
  studentId: string
  answers: Record<string, any>
  score?: number
  feedback?: string
  startedAt: string
  completedAt?: string
}

export interface ProcessingAdapter {
  enqueue(job: {type: JobType; lessonId: string; attachmentId?: string; payload?: any}): Promise<Job>
  status(jobId: string): Promise<Job>
  cancel(jobId: string): Promise<void>
  retry(jobId: string): Promise<Job>
}

export interface UploadAdapter {
  initResumableUpload(file: File): Promise<{uploadId: string; chunkSize: number}>
  uploadChunk(uploadId: string, chunkIndex: number, chunkData: ArrayBuffer): Promise<{progress: number}>
  completeUpload(uploadId: string): Promise<{attachment: Attachment}>
}

export interface AIAdapter {
  generateText(prompt: string, options?: any): Promise<string>
  generateSummary(text: string): Promise<string>
  generateAltText(imageUrl: string): Promise<string>
  transcribeAudio(audioUrl: string): Promise<string>
  translateText(text: string, targetLang: string): Promise<string>
}

export interface TTSAdapter {
  synthesize(text: string, options?: {voice?: string; speed?: number; pitch?: number}): Promise<string>
  getVoices(): Promise<SpeechSynthesisVoice[]>
}

export interface STTAdapter {
  startRecording(): Promise<void>
  stopRecording(): Promise<string>
  isSupported(): boolean
}

export interface SearchFilters {
  subject?: string
  gradeLevel?: string
  difficulty?: string
  teacher?: string
  dateRange?: {start: string; end: string}
  hasAccessibility?: boolean
}