import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/lib/store'
import { ArrowLeft, Upload, Plus, X, FileText, Video, Image } from 'lucide-react'
import { cn, generateId } from '@/lib/utils'

const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDuration: z.string().min(1, 'Estimated duration is required'),
})

type CreateLessonForm = z.infer<typeof createLessonSchema>

interface UploadedFile {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'failed'
}

const CreateLessonPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateLessonForm>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      difficulty: 'beginner',
    },
  })

  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Art', 'Music', 'Physical Education']
  const gradeLevels = ['Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6']

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      const uploadedFile: UploadedFile = {
        id: generateId(),
        file,
        progress: 0,
        status: 'uploading',
      }

      setUploadedFiles(prev => [...prev, uploadedFile])

      // Simulate file upload progress
      const interval = setInterval(() => {
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        )
      }, 200)

      // Complete upload after progress reaches 100%
      setTimeout(() => {
        clearInterval(interval)
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'completed', progress: 100 }
              : f
          )
        )
      }, 2000)
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return Video
    if (file.type.startsWith('image/')) return Image
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const onSubmit = async (data: CreateLessonForm) => {
    setIsSubmitting(true)
    
    try {
      // In a real app, this would save to the backend/storage
      const newLesson = {
        id: generateId(),
        ...data,
        teacherId: user?.id,
        teacherName: user?.name,
        status: 'draft',
        accessibility: {
          status: 'unverified',
        },
        attachments: uploadedFiles.filter(f => f.status === 'completed').map(f => ({
          id: generateId(),
          filename: f.file.name,
          originalName: f.file.name,
          mimeType: f.file.type,
          size: f.file.size,
          url: URL.createObjectURL(f.file),
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      console.log('Created lesson:', newLesson)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      navigate('/lessons')
    } catch (error) {
      console.error('Failed to create lesson:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Navigation */}
      <div>
        <Link
          to="/lessons"
          className="inline-flex items-center text-primary-600 hover:text-primary-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lessons
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t('lessons.createLesson')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create accessible learning content for your students
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('lessons.lessonTitle')} *
              </label>
              <input
                {...register('title')}
                type="text"
                className={cn(
                  'block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.title ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="Enter lesson title"
                aria-invalid={errors.title ? 'true' : 'false'}
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              {errors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('lessons.subject')} *
              </label>
              <select
                {...register('subject')}
                className={cn(
                  'block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.subject ? 'border-red-500' : 'border-gray-300'
                )}
              >
                <option value="">Select subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('lessons.gradeLevel')} *
              </label>
              <select
                {...register('gradeLevel')}
                className={cn(
                  'block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.gradeLevel ? 'border-red-500' : 'border-gray-300'
                )}
              >
                <option value="">Select grade level</option>
                {gradeLevels.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              {errors.gradeLevel && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.gradeLevel.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('lessons.difficulty')} *
              </label>
              <select
                {...register('difficulty')}
                className={cn(
                  'block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.difficulty ? 'border-red-500' : 'border-gray-300'
                )}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.difficulty && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.difficulty.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Estimated Duration *
              </label>
              <input
                {...register('estimatedDuration')}
                type="text"
                placeholder="e.g., 30 minutes"
                className={cn(
                  'block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.estimatedDuration ? 'border-red-500' : 'border-gray-300'
                )}
              />
              {errors.estimatedDuration && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.estimatedDuration.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('lessons.description')} *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className={cn(
                  'block w-full px-3 py-2 border rounded-md shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                  errors.description ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="Describe what students will learn in this lesson"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Lesson Content
          </h2>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('lessons.content')} *
            </label>
            <textarea
              {...register('content')}
              rows={12}
              className={cn(
                'block w-full px-3 py-2 border rounded-md shadow-sm font-mono text-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                'dark:bg-gray-700 dark:border-gray-600 dark:text-white',
                errors.content ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="Write your lesson content here. You can use markdown formatting."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.content.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Tip: Use markdown formatting for headers (#), bold (**text**), and lists (- item)
            </p>
          </div>
        </div>

        {/* File Attachments */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attachments
          </h2>
          
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-primary-600 hover:text-primary-500 font-medium">
                  Upload files
                </span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.jpg,.jpeg,.png,.gif"
                />
              </label>
              <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              PDF, DOC, DOCX, PPT, PPTX, MP4, MP3, JPG, PNG up to 50MB
            </p>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Uploaded Files
              </h3>
              {uploadedFiles.map((uploadedFile) => {
                const FileIcon = getFileIcon(uploadedFile.file)
                return (
                  <div
                    key={uploadedFile.id}
                    className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <FileIcon className="h-8 w-8 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {uploadedFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(uploadedFile.file.size)}
                        </p>
                        {uploadedFile.status === 'uploading' && (
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                              <div 
                                className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                                style={{ width: `${uploadedFile.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeFile(uploadedFile.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      aria-label={`Remove ${uploadedFile.file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your lesson will be saved as a draft and processed for accessibility features.
            </p>
            
            <div className="flex space-x-3">
              <Link
                to="/lessons"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                )}
              >
                {isSubmitting ? 'Creating...' : 'Create Lesson'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default CreateLessonPage