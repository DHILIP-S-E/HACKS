import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore, useUIStore } from '@/lib/store'
import { ttsAdapter } from '@/adapters/ttsAdapter'
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  FileText,
  Video,
  Image,
  Headphones,
  CheckCircle,
  Clock,
  User,
  BookOpen
} from 'lucide-react'
import { cn } from '@/lib/utils'

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { readingRuler, ttsActive, setTTSActive } = useUIStore()
  const [isPlaying, setIsPlaying] = useState(false)

  // Mock lesson data - in real app this would be fetched based on ID
  const lesson = {
    id: '1',
    title: 'Introduction to Mathematics',
    description: 'This lesson covers the fundamental concepts of mathematics including numbers, basic operations, and problem-solving strategies. Students will learn through interactive examples and accessible content designed for different learning needs.',
    content: `
# Introduction to Mathematics

Welcome to your first mathematics lesson! In this lesson, we'll explore the wonderful world of numbers and basic mathematical operations.

## What are Numbers?

Numbers are symbols we use to represent quantities. They help us count, measure, and solve problems in our daily lives.

### Types of Numbers:
- **Whole Numbers**: 0, 1, 2, 3, 4, 5...
- **Natural Numbers**: 1, 2, 3, 4, 5...
- **Even Numbers**: 2, 4, 6, 8, 10...
- **Odd Numbers**: 1, 3, 5, 7, 9...

## Basic Operations

Mathematics has four basic operations:

1. **Addition (+)**: Combining numbers together
   - Example: 2 + 3 = 5

2. **Subtraction (-)**: Taking away one number from another
   - Example: 5 - 2 = 3

3. **Multiplication (×)**: Adding a number to itself multiple times
   - Example: 3 × 4 = 12

4. **Division (÷)**: Splitting a number into equal parts
   - Example: 12 ÷ 3 = 4

## Practice Problems

Try these simple problems:
1. What is 4 + 6?
2. What is 10 - 3?
3. What is 2 × 5?
4. What is 8 ÷ 2?

Remember, practice makes perfect! Don't worry if you make mistakes - they help us learn.
    `,
    subject: 'Mathematics',
    gradeLevel: 'Grade 1',
    difficulty: 'beginner',
    teacherName: 'Ms. Johnson',
    teacherId: 'teacher-1',
    status: 'published',
    accessibility: {
      summary: 'This lesson introduces basic mathematical concepts including numbers and operations. It uses simple language and clear examples to help students understand fundamental math skills.',
      ttsUrl: 'mock-tts-audio.mp3',
      captions: [],
      altTexts: {
        'math-diagram.png': 'A colorful diagram showing numbers 1 through 10 with visual representations using dots and shapes'
      },
      simplifiedText: 'Math is about numbers. We use numbers to count things. We can add numbers together or take them away. This lesson teaches you the basics of math.',
    },
    attachments: [
      {
        id: 'att-1',
        filename: 'math-worksheet.pdf',
        originalName: 'Basic Math Worksheet.pdf',
        mimeType: 'application/pdf',
        size: 245760,
        url: 'mock-worksheet.pdf',
      },
      {
        id: 'att-2',
        filename: 'math-video.mp4',
        originalName: 'Math Introduction Video.mp4',
        mimeType: 'video/mp4',
        size: 15728640,
        url: 'mock-video.mp4',
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    studentsEnrolled: 24,
    estimatedDuration: '30 minutes'
  }

  const handleTTSToggle = async () => {
    if (isPlaying) {
      ttsAdapter.stop()
      setIsPlaying(false)
      setTTSActive(false)
    } else {
      try {
        setIsPlaying(true)
        setTTSActive(true)
        await ttsAdapter.synthesize(lesson.content.replace(/[#*]/g, ''))
        setIsPlaying(false)
        setTTSActive(false)
      } catch (error) {
        console.error('TTS error:', error)
        setIsPlaying(false)
        setTTSActive(false)
      }
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('video/')) return Video
    if (mimeType.startsWith('image/')) return Image
    if (mimeType.startsWith('audio/')) return Headphones
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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

      {/* Lesson Header */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {lesson.subject} • {lesson.gradeLevel}
              </span>
              <span className={cn(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                lesson.difficulty === 'beginner' ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300' :
                lesson.difficulty === 'intermediate' ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300' :
                'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
              )}>
                {lesson.difficulty}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {lesson.title}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {lesson.description}
            </p>

            <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {lesson.teacherName}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {lesson.estimatedDuration}
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                Accessibility Verified
              </div>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTTSToggle}
              className={cn(
                'p-3 rounded-full transition-colors',
                isPlaying
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              )}
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </button>
            
            <button
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Audio settings"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility Summary */}
      {lesson.accessibility.summary && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Lesson Summary
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            {lesson.accessibility.summary}
          </p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div 
          className={cn(
            'prose dark:prose-invert max-w-none',
            readingRuler && 'reading-ruler'
          )}
          dangerouslySetInnerHTML={{ 
            __html: lesson.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '<h3>').replace(/<h3>/g, '<h3 class="text-xl font-semibold mt-6 mb-3">') 
          }}
        />
      </div>

      {/* Attachments */}
      {lesson.attachments.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Attachments
          </h3>
          
          <div className="space-y-3">
            {lesson.attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.mimeType)
              return (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {attachment.originalName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    className="inline-flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-500"
                    aria-label={`Download ${attachment.originalName}`}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Simplified Version */}
      {lesson.accessibility.simplifiedText && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-3">
            Simplified Version
          </h3>
          <p className="text-green-800 dark:text-green-400">
            {lesson.accessibility.simplifiedText}
          </p>
        </div>
      )}

      {/* Teacher Actions */}
      {user?.role === 'teacher' && user.id === lesson.teacherId && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Teacher Actions
          </h3>
          <div className="flex space-x-3">
            <Link
              to={`/lessons/${lesson.id}/edit`}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Edit Lesson
            </Link>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              View Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LessonDetailPage