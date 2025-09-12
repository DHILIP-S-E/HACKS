import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { localAdapter } from '@/lib/adapters/localAdapter';
import type { Lesson } from '@/types/lesson';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Clock, Tag, User } from 'lucide-react';

const LessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const fetchedLessons = await localAdapter.getLessons();
        setLessons(fetchedLessons.filter(lesson => lesson.isPublished));
      } catch (err) {
        setError('Failed to load lessons');
        console.error('Error fetching lessons:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Lessons</h1>
        <p className="text-gray-600 dark:text-gray-400">Explore our accessibility learning content</p>
      </div>
      
      {lessons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No lessons available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </span>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {lesson.estimatedDuration}min
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {lesson.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {lesson.description}
                </p>
              </div>
              
              {lesson.tags && lesson.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {lesson.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {lesson.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{lesson.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Link
                  to={`/lessons/${lesson.id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Start Lesson
                </Link>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <User className="w-3 h-3 mr-1" />
                  Instructor
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonsPage;