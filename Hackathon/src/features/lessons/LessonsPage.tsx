import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/lib/store'
import { 
  Search, 
  Filter, 
  Plus, 
  BookOpen, 
  Clock, 
  User,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'

const LessonsPage: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')

  // Mock data - in real app this would come from API
  const lessons = [
    {
      id: '1',
      title: 'Introduction to Mathematics',
      description: 'Basic mathematical concepts for beginners',
      subject: 'Mathematics',
      gradeLevel: 'Grade 1',
      difficulty: 'beginner',
      teacherName: 'Ms. Johnson',
      status: 'published',
      accessibility: 'verified',
      createdAt: '2024-01-15',
      studentsEnrolled: 24,
    },
    {
      id: '2',
      title: 'Basic Reading Comprehension',
      description: 'Improve reading skills with interactive exercises',
      subject: 'English',
      gradeLevel: 'Grade 2',
      difficulty: 'beginner',
      teacherName: 'Mr. Smith',
      status: 'published',
      accessibility: 'verified',
      createdAt: '2024-01-14',
      studentsEnrolled: 18,
    },
    {
      id: '3',
      title: 'Science Fundamentals',
      description: 'Explore the basics of scientific thinking',
      subject: 'Science',
      gradeLevel: 'Grade 3',
      difficulty: 'intermediate',
      teacherName: 'Dr. Brown',
      status: 'draft',
      accessibility: 'processing',
      createdAt: '2024-01-13',
      studentsEnrolled: 0,
    },
  ]

  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Art']
  const difficulties = ['beginner', 'intermediate', 'advanced']

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = !selectedSubject || lesson.subject === selectedSubject
    const matchesDifficulty = !selectedDifficulty || lesson.difficulty === selectedDifficulty
    
    return matchesSearch && matchesSubject && matchesDifficulty
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'draft':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300'
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getAccessibilityIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('lessons.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'student' && 'Discover accessible learning content'}
            {user?.role === 'teacher' && 'Manage your lessons and create new content'}
            {user?.role === 'admin' && 'Oversee all lessons and content quality'}
          </p>
        </div>
        
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Link
            to="/lessons/create"
            className={cn(
              'inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md',
              'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              'transition-colors'
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('lessons.createLesson')}
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('common.search')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons..."
                className={cn(
                  'block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  'dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                )}
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('lessons.subject')}
            </label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={cn(
                'block w-full px-3 py-2 border border-gray-300 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                'dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              )}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('lessons.difficulty')}
            </label>
            <select
              id="difficulty"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className={cn(
                'block w-full px-3 py-2 border border-gray-300 rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                'dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              )}
            >
              <option value="">All Levels</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {lesson.gradeLevel}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {getAccessibilityIcon(lesson.accessibility)}
                  <span className={cn(
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    getStatusColor(lesson.status)
                  )}>
                    {lesson.status}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {lesson.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {lesson.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  getDifficultyColor(lesson.difficulty)
                )}>
                  {lesson.difficulty}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {lesson.subject}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {lesson.teacherName}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {lesson.createdAt}
                </div>
              </div>

              {lesson.studentsEnrolled > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {lesson.studentsEnrolled} students enrolled
                </div>
              )}

              <Link
                to={`/lessons/${lesson.id}`}
                className={cn(
                  'w-full inline-flex items-center justify-center px-4 py-2',
                  'bg-primary-600 text-white rounded-md hover:bg-primary-700',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'transition-colors'
                )}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Lesson
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No lessons found
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  )
}

export default LessonsPage