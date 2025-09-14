import localforage from 'localforage';
import { 
  User, 
  Lesson, 
  Attachment, 
  Job, 
  HighlightNote, 
  ProgressMetrics,
  AuthAdapter,
  StorageAdapter,
  ProcessingAdapter 
} from '@/types';

// Configure localforage stores
const userStore = localforage.createInstance({ name: 'users' });
const lessonStore = localforage.createInstance({ name: 'lessons' });
const attachmentStore = localforage.createInstance({ name: 'attachments' });
const jobStore = localforage.createInstance({ name: 'jobs' });
const highlightStore = localforage.createInstance({ name: 'highlights' });
const progressStore = localforage.createInstance({ name: 'progress' });
const fileStore = localforage.createInstance({ name: 'files' });

// Mock current user for local adapter
let currentUser: User | null = null;

// Auth Adapter Implementation
export const localAuthAdapter: AuthAdapter = {
  async signUp(email: string, password: string, userData: Partial<User>): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      email,
      name: userData.name || 'User',
      role: userData.role || 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await userStore.setItem(user.id, user);
    currentUser = user;
    return user;
  },

  async signIn(email: string, password: string): Promise<User> {
    // Mock authentication - in real app, validate credentials
    const users = await getAllUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    currentUser = user;
    return user;
  },

  async signOut(): Promise<void> {
    currentUser = null;
  },

  async getCurrentUser(): Promise<User | null> {
    return currentUser;
  },

  async resetPassword(email: string): Promise<void> {
    // Mock password reset
    console.log(`Password reset requested for ${email}`);
  },
};

// Storage Adapter Implementation
export const localStorageAdapter: StorageAdapter = {
  async uploadFile(file: File, path: string): Promise<string> {
    const fileData = await fileToBase64(file);
    const fileId = crypto.randomUUID();
    const fileRecord = {
      id: fileId,
      path,
      data: fileData,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
    
    await fileStore.setItem(fileId, fileRecord);
    return `local://${fileId}`;
  },

  async deleteFile(path: string): Promise<void> {
    const fileId = path.replace('local://', '');
    await fileStore.removeItem(fileId);
  },

  async getFileUrl(path: string): Promise<string> {
    const fileId = path.replace('local://', '');
    const fileRecord = await fileStore.getItem<any>(fileId);
    
    if (!fileRecord) {
      throw new Error('File not found');
    }
    
    return fileRecord.data;
  },

  async initResumableUpload(file: File): Promise<{ uploadId: string; chunkSize: number }> {
    const uploadId = crypto.randomUUID();
    const chunkSize = 5 * 1024 * 1024; // 5MB chunks
    
    await fileStore.setItem(`upload_${uploadId}`, {
      uploadId,
      filename: file.name,
      totalSize: file.size,
      mimeType: file.type,
      chunks: [],
      status: 'initialized',
      createdAt: new Date().toISOString(),
    });
    
    return { uploadId, chunkSize };
  },

  async uploadChunk(uploadId: string, chunkIndex: number, chunkData: ArrayBuffer): Promise<{ progress: number }> {
    const uploadRecord = await fileStore.getItem<any>(`upload_${uploadId}`);
    
    if (!uploadRecord) {
      throw new Error('Upload not found');
    }
    
    const chunkBase64 = arrayBufferToBase64(chunkData);
    uploadRecord.chunks[chunkIndex] = chunkBase64;
    
    await fileStore.setItem(`upload_${uploadId}`, uploadRecord);
    
    const completedChunks = uploadRecord.chunks.filter(Boolean).length;
    const totalChunks = Math.ceil(uploadRecord.totalSize / (5 * 1024 * 1024));
    const progress = (completedChunks / totalChunks) * 100;
    
    return { progress };
  },

  async completeUpload(uploadId: string): Promise<{ attachment: Attachment }> {
    const uploadRecord = await fileStore.getItem<any>(`upload_${uploadId}`);
    
    if (!uploadRecord) {
      throw new Error('Upload not found');
    }
    
    // Combine chunks
    const combinedData = uploadRecord.chunks.join('');
    const fileId = crypto.randomUUID();
    
    await fileStore.setItem(fileId, {
      id: fileId,
      data: combinedData,
      mimeType: uploadRecord.mimeType,
      size: uploadRecord.totalSize,
      uploadedAt: new Date().toISOString(),
    });
    
    // Clean up upload record
    await fileStore.removeItem(`upload_${uploadId}`);
    
    const attachment: Attachment = {
      id: fileId,
      lessonId: '', // Will be set by caller
      filename: uploadRecord.filename,
      mimeType: uploadRecord.mimeType,
      size: uploadRecord.totalSize,
      url: `local://${fileId}`,
      processingStatus: 'queued',
      createdAt: new Date().toISOString(),
    };
    
    return { attachment };
  },
};

// Processing Adapter Implementation
export const localProcessingAdapter: ProcessingAdapter = {
  async enqueueProcessingJob(jobInput: Omit<Job, 'id' | 'status' | 'attempts' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    const job: Job = {
      ...jobInput,
      id: crypto.randomUUID(),
      status: 'queued',
      attempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await jobStore.setItem(job.id, job);
    
    // Simulate processing with timeout
    setTimeout(() => {
      this.processJob(job.id);
    }, 2000);
    
    return job;
  },

  async getJobStatus(jobId: string): Promise<Job> {
    const job = await jobStore.getItem<Job>(jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    return job;
  },

  async cancelJob(jobId: string): Promise<void> {
    await jobStore.removeItem(jobId);
  },

  async retryJob(jobId: string): Promise<Job> {
    const job = await jobStore.getItem<Job>(jobId);
    
    if (!job) {
      throw new Error('Job not found');
    }
    
    job.status = 'queued';
    job.attempts = 0;
    job.error = undefined;
    job.updatedAt = new Date().toISOString();
    
    await jobStore.setItem(jobId, job);
    
    // Simulate processing
    setTimeout(() => {
      this.processJob(jobId);
    }, 1000);
    
    return job;
  },

  async processJob(jobId: string): Promise<void> {
    const job = await jobStore.getItem<Job>(jobId);
    
    if (!job) return;
    
    job.status = 'processing';
    job.attempts += 1;
    job.updatedAt = new Date().toISOString();
    
    await jobStore.setItem(jobId, job);
    
    // Simulate processing time
    setTimeout(async () => {
      try {
        // Mock processing results
        const result = await this.mockProcessing(job);
        
        job.status = 'completed';
        job.result = result;
        job.updatedAt = new Date().toISOString();
        
        await jobStore.setItem(jobId, job);
        
        // Broadcast completion
        this.broadcastJobUpdate(job);
      } catch (error) {
        job.status = job.attempts >= job.maxAttempts ? 'failed' : 'retrying';
        job.error = error instanceof Error ? error.message : 'Processing failed';
        job.updatedAt = new Date().toISOString();
        
        await jobStore.setItem(jobId, job);
        
        if (job.status === 'retrying') {
          setTimeout(() => {
            this.processJob(jobId);
          }, Math.pow(2, job.attempts) * 1000); // Exponential backoff
        }
      }
    }, 3000 + Math.random() * 2000); // 3-5 seconds
  },

  async mockProcessing(job: Job): Promise<any> {
    switch (job.type) {
      case 'summarize':
        return { summary: 'This is a simplified summary of the content.' };
      case 'tts':
        return { audioUrl: 'local://mock-tts-audio' };
      case 'transcribe':
        return { transcript: 'This is a mock transcript of the audio.' };
      case 'image_description':
        return { description: 'This image shows educational content.' };
      case 'ocr':
        return { text: 'Extracted text from the document.' };
      case 'video_process':
        return { captions: [{ start: 0, end: 10, text: 'Mock caption', language: 'en' }] };
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  },

  broadcastJobUpdate(job: Job): void {
    // Use BroadcastChannel for cross-tab communication
    const channel = new BroadcastChannel('job-updates');
    channel.postMessage({ type: 'job-update', job });
  },
};

// Helper functions
async function getAllUsers(): Promise<User[]> {
  const users: User[] = [];
  await userStore.iterate((user: User) => {
    users.push(user);
  });
  return users;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Export store instances for direct access if needed
export {
  userStore,
  lessonStore,
  attachmentStore,
  jobStore,
  highlightStore,
  progressStore,
  fileStore,
};