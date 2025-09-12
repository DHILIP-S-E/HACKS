// Base interfaces for all adapters
export interface AIAdapter {
  generateSummary(text: string, options?: {
    readingLevel?: string;
    maxLength?: number;
    language?: string;
  }): Promise<string>;
  
  simplifyText(text: string, readingLevel?: number): Promise<string>;
  
  generateQuestions(text: string, count?: number): Promise<Array<{
    question: string;
    options?: string[];
    answer?: string;
    type?: 'multiple_choice' | 'true_false' | 'short_answer';
  }>>;
  
  detectLanguage(text: string): Promise<string>;
  
  analyzeSentiment(text: string): Promise<{
    sentiment: 'positive' | 'negative' | 'neutral';
    confidence: number;
  }>;
}

export interface TTSAdapter {
  isSupported(): boolean;
  
  speak(text: string, options?: {
    voice?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<void>;
  
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<void>;
  
  getVoices(): Promise<Array<{
    name: string;
    language: string;
    gender?: 'male' | 'female';
  }>>;
}

export interface STTAdapter {
  isSupported(): boolean;
  
  startRecording(options?: {
    language?: string;
    continuous?: boolean;
    interimResults?: boolean;
  }): Promise<void>;
  
  stopRecording(): Promise<string>;
  
  onResult(callback: (text: string, isFinal: boolean) => void): void;
}

export interface OCRAdapter {
  extractText(imageData: File | string): Promise<string>;
  extractTextFromPDF(pdfData: File): Promise<string>;
}

export interface TranslationAdapter {
  translateText(
    text: string, 
    targetLanguage: string, 
    sourceLanguage?: string
  ): Promise<string>;
  
  detectLanguage(text: string): Promise<string>;
  
  getSupportedLanguages(): Promise<Array<{
    code: string;
    name: string;
  }>>;
}

export interface ProcessingAdapter {
  enqueueJob(job: ProcessingJob): Promise<Job>;
  getJobStatus(jobId: string): Promise<Job>;
  cancelJob(jobId: string): Promise<void>;
  retryJob(jobId: string): Promise<Job>;
}

export interface Job {
  id: string;
  type: JobType;
  lessonId: string;
  attachmentId?: string;
  status: JobStatus;
  attempts: number;
  maxAttempts: number;
  result?: any;
  error?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export type JobType = 
  | 'ocr'
  | 'tts'
  | 'transcribe'
  | 'summarize'
  | 'image_description'
  | 'video_process'
  | 'translation'
  | 'simplification';

export type JobStatus = 
  | 'queued'
  | 'processing'
  | 'retrying'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface ProcessingJob {
  type: JobType;
  lessonId: string;
  attachmentId?: string;
  options?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
}

export interface StorageAdapter {
  uploadFile(file: File, path: string): Promise<string>;
  downloadFile(path: string): Promise<Blob>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): Promise<string>;
  
  // Resumable upload methods
  initResumableUpload(file: File, path: string): Promise<{
    uploadId: string;
    chunkSize: number;
  }>;
  
  uploadChunk(uploadId: string, chunkIndex: number, chunk: Blob): Promise<{
    progress: number;
  }>;
  
  completeUpload(uploadId: string): Promise<{
    url: string;
  }>;
  
  cancelUpload(uploadId: string): Promise<void>;
}

export interface AuthAdapter {
  login(credentials: any): Promise<any>;
  register(userData: any): Promise<any>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<any>;
  refreshToken(): Promise<string>;
  updateProfile(updates: any): Promise<any>;
}

export interface NotificationAdapter {
  sendEmail(to: string, subject: string, content: string): Promise<void>;
  sendSMS(to: string, message: string): Promise<void>;
  sendPushNotification(userId: string, notification: any): Promise<void>;
}

export interface AnalyticsAdapter {
  track(event: string, properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  page(name: string, properties?: Record<string, any>): void;
}

export interface SignLanguageAdapter {
  generateSignLanguageVideo(
    text: string,
    language: string,
    options?: {
      speed?: number;
      avatarStyle?: string;
    }
  ): Promise<{
    url: string;
    duration: number;
  }>;
  
  getSupportedLanguages(): Promise<string[]>;
  getAvatarStyles(): Promise<string[]>;
}