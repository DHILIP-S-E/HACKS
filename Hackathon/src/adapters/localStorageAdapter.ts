import localforage from 'localforage'
import type { User, Lesson, Profile, Attachment, Job, ProcessingAdapter, UploadAdapter } from '@/types'

// Configure localforage
localforage.config({
  name: 'AssistiveLearningPlatform',
  version: 1.0,
  storeName: 'alp_data',
})

class LocalStorageAdapter {
  // User management
  async getUser(id: string): Promise<User | null> {
    return await localforage.getItem(`user:${id}`)
  }

  async setUser(user: User): Promise<void> {
    await localforage.setItem(`user:${user.id}`, user)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = await this.getAllUsers()
    return users.find(user => user.email === email) || null
  }

  async getAllUsers(): Promise<User[]> {
    const keys = await localforage.keys()
    const userKeys = keys.filter(key => key.startsWith('user:'))
    const users = await Promise.all(
      userKeys.map(key => localforage.getItem<User>(key))
    )
    return users.filter(Boolean) as User[]
  }

  // Profile management
  async getProfile(userId: string): Promise<Profile | null> {
    return await localforage.getItem(`profile:${userId}`)
  }

  async setProfile(profile: Profile): Promise<void> {
    await localforage.setItem(`profile:${profile.userId}`, profile)
  }

  // Lesson management
  async getLesson(id: string): Promise<Lesson | null> {
    return await localforage.getItem(`lesson:${id}`)
  }

  async setLesson(lesson: Lesson): Promise<void> {
    await localforage.setItem(`lesson:${lesson.id}`, lesson)
  }

  async getAllLessons(): Promise<Lesson[]> {
    const keys = await localforage.keys()
    const lessonKeys = keys.filter(key => key.startsWith('lesson:'))
    const lessons = await Promise.all(
      lessonKeys.map(key => localforage.getItem<Lesson>(key))
    )
    return lessons.filter(Boolean) as Lesson[]
  }

  async deleteLesson(id: string): Promise<void> {
    await localforage.removeItem(`lesson:${id}`)
  }

  // Attachment management
  async getAttachment(id: string): Promise<Attachment | null> {
    return await localforage.getItem(`attachment:${id}`)
  }

  async setAttachment(attachment: Attachment): Promise<void> {
    await localforage.setItem(`attachment:${attachment.id}`, attachment)
  }

  // Job management
  async getJob(id: string): Promise<Job | null> {
    return await localforage.getItem(`job:${id}`)
  }

  async setJob(job: Job): Promise<void> {
    await localforage.setItem(`job:${job.id}`, job)
  }

  async getAllJobs(): Promise<Job[]> {
    const keys = await localforage.keys()
    const jobKeys = keys.filter(key => key.startsWith('job:'))
    const jobs = await Promise.all(
      jobKeys.map(key => localforage.getItem<Job>(key))
    )
    return jobs.filter(Boolean) as Job[]
  }

  // File storage (using base64 for local storage)
  async storeFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async () => {
        const base64 = reader.result as string
        const fileId = `file:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        await localforage.setItem(fileId, {
          data: base64,
          name: file.name,
          type: file.type,
          size: file.size,
        })
        resolve(fileId)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async getFile(fileId: string): Promise<{data: string; name: string; type: string; size: number} | null> {
    return await localforage.getItem(fileId)
  }

  // Clear all data
  async clearAll(): Promise<void> {
    await localforage.clear()
  }
}

// Processing adapter implementation
class LocalProcessingAdapter implements ProcessingAdapter {
  private storage = new LocalStorageAdapter()

  async enqueue(jobInput: {type: any; lessonId: string; attachmentId?: string; payload?: any}): Promise<Job> {
    const job: Job = {
      id: `job:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: jobInput.type,
      lessonId: jobInput.lessonId,
      attachmentId: jobInput.attachmentId,
      status: 'queued',
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await this.storage.setJob(job)
    
    // Simulate processing with setTimeout
    setTimeout(() => this.processJob(job.id), 1000)
    
    return job
  }

  async status(jobId: string): Promise<Job> {
    const job = await this.storage.getJob(jobId)
    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }
    return job
  }

  async cancel(jobId: string): Promise<void> {
    const job = await this.storage.getJob(jobId)
    if (job && job.status === 'queued') {
      job.status = 'failed'
      job.error = 'Cancelled by user'
      job.updatedAt = new Date().toISOString()
      await this.storage.setJob(job)
    }
  }

  async retry(jobId: string): Promise<Job> {
    const job = await this.storage.getJob(jobId)
    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }
    
    if (job.attempts >= job.maxAttempts) {
      throw new Error('Maximum retry attempts exceeded')
    }

    job.status = 'queued'
    job.attempts += 1
    job.updatedAt = new Date().toISOString()
    await this.storage.setJob(job)
    
    setTimeout(() => this.processJob(job.id), 1000)
    
    return job
  }

  private async processJob(jobId: string): Promise<void> {
    const job = await this.storage.getJob(jobId)
    if (!job || job.status !== 'queued') return

    job.status = 'processing'
    job.updatedAt = new Date().toISOString()
    await this.storage.setJob(job)

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

    // Simulate success/failure
    const success = Math.random() > 0.2 // 80% success rate

    if (success) {
      job.status = 'completed'
      job.result = this.generateMockResult(job.type)
    } else {
      job.status = 'failed'
      job.error = 'Processing failed due to simulated error'
    }

    job.updatedAt = new Date().toISOString()
    await this.storage.setJob(job)
  }

  private generateMockResult(jobType: string): any {
    switch (jobType) {
      case 'ocr':
        return { text: 'Extracted text from document...' }
      case 'tts':
        return { audioUrl: 'data:audio/wav;base64,mock-audio-data' }
      case 'transcribe':
        return { transcript: 'Transcribed audio content...' }
      case 'summarize':
        return { summary: 'This is a summary of the content...' }
      case 'image_description':
        return { description: 'An educational diagram showing...' }
      default:
        return { result: 'Processing completed' }
    }
  }
}

// Upload adapter implementation
class LocalUploadAdapter implements UploadAdapter {
  private storage = new LocalStorageAdapter()
  private uploads = new Map<string, {file: File; chunks: ArrayBuffer[]}>()

  async initResumableUpload(file: File): Promise<{uploadId: string; chunkSize: number}> {
    const uploadId = `upload:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const chunkSize = 1024 * 1024 // 1MB chunks
    
    this.uploads.set(uploadId, {
      file,
      chunks: [],
    })
    
    return { uploadId, chunkSize }
  }

  async uploadChunk(uploadId: string, chunkIndex: number, chunkData: ArrayBuffer): Promise<{progress: number}> {
    const upload = this.uploads.get(uploadId)
    if (!upload) {
      throw new Error(`Upload ${uploadId} not found`)
    }

    upload.chunks[chunkIndex] = chunkData
    
    const totalChunks = Math.ceil(upload.file.size / (1024 * 1024))
    const uploadedChunks = upload.chunks.filter(Boolean).length
    const progress = (uploadedChunks / totalChunks) * 100

    return { progress }
  }

  async completeUpload(uploadId: string): Promise<{attachment: Attachment}> {
    const upload = this.uploads.get(uploadId)
    if (!upload) {
      throw new Error(`Upload ${uploadId} not found`)
    }

    // Combine chunks
    const combinedBuffer = new Uint8Array(upload.file.size)
    let offset = 0
    
    for (const chunk of upload.chunks) {
      if (chunk) {
        combinedBuffer.set(new Uint8Array(chunk), offset)
        offset += chunk.byteLength
      }
    }

    // Create blob and store
    const blob = new Blob([combinedBuffer], { type: upload.file.type })
    const file = new File([blob], upload.file.name, { type: upload.file.type })
    const fileId = await this.storage.storeFile(file)

    const attachment: Attachment = {
      id: `attachment:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lessonId: '', // Will be set by caller
      filename: fileId,
      originalName: upload.file.name,
      mimeType: upload.file.type,
      size: upload.file.size,
      url: fileId,
      processingStatus: 'completed',
      createdAt: new Date().toISOString(),
    }

    await this.storage.setAttachment(attachment)
    this.uploads.delete(uploadId)

    return { attachment }
  }
}

export const localStorageAdapter = new LocalStorageAdapter()
export const localProcessingAdapter = new LocalProcessingAdapter()
export const localUploadAdapter = new LocalUploadAdapter()
export default localStorageAdapter