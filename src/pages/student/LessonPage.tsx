import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { localAdapter } from '@/lib/adapters/localAdapter';
import type { Lesson } from '@/types/lesson';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useProgressStore } from '@/stores/progressStore';
import { ArrowLeft, Clock, Tag, CheckCircle, ArrowRight } from 'lucide-react';

const LessonPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { progress, markLessonComplete } = useProgressStore();
  
  const isCompleted = progress?.completedLessons?.includes(id || '') || false;

  useEffect(() => {
    const fetchLesson = async () => {
      if (!id) {
        setError('Lesson ID not provided');
        setLoading(false);
        return;
      }

      try {
        const fetchedLesson = await localAdapter.getLesson(id);
        if (!fetchedLesson) {
          setError('Lesson not found');
        } else {
          setLesson(fetchedLesson);
        }
      } catch (err) {
        setError('Failed to load lesson');
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  const handleMarkComplete = async () => {
    if (!id) return;
    
    console.log('Marking lesson as complete:', id);
    console.log('Current progress:', progress);
    
    try {
      await markLessonComplete(id);
      console.log('Lesson marked as complete successfully');
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
    }
  };

  const renderMarkdownContent = (content: string) => {
    // Simple markdown-like rendering
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 mt-6">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 mt-4">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 mb-1 text-gray-700 dark:text-gray-300">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={index} className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{line.slice(2, -2)}</p>;
        }
        return <p key={index} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>;
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error || 'Lesson not found'}</p>
        <Link to="/lessons" className="text-blue-600 hover:text-blue-800 underline">
          Back to Lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/lessons" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {lesson.title}
            </h1>
            {isCompleted && (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                Completed
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {lesson.estimatedDuration} minutes
            </div>
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
              {lesson.difficulty}
            </span>
          </div>
          
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {lesson.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            {renderMarkdownContent(lesson.content)}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4 justify-center">
          {!isCompleted && (
            <button 
              onClick={handleMarkComplete}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Mark Complete
            </button>
          )}
          <Link
            to="/lessons"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Next Lesson
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;