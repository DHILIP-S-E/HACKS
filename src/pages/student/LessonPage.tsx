import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { localAdapter } from '@/lib/adapters/localAdapter';
import { useProgressStore } from '@/stores/progressStore';
import { useNotesStore } from '@/stores/notesStore';
import { TextHighlighter } from '@/components/learning/TextHighlighter';
import { ProgressBadges } from '@/components/learning/ProgressBadges';
import { AccessibilityHelper } from '@/components/accessibility/AccessibilityHelper';
import { NLPService } from '@/lib/nlpService';
import { ArrowLeft, Clock, CheckCircle, Brain, BookOpen } from 'lucide-react';

const LessonPage: React.FC = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [nlpAnalysis, setNlpAnalysis] = useState(null);
  const [simplifiedContent, setSimplifiedContent] = useState('');
  const { markLessonComplete, progress } = useProgressStore();
  const { addHighlight, addNote, getHighlights, getNotes } = useNotesStore();

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const lessonData = await localAdapter.getLesson(id);
        setLesson(lessonData);
        // Analyze lesson content with NLP
        const analysis = await NLPService.analyzeText(lessonData.content);
        setNlpAnalysis(analysis);
      } catch (error) {
        console.error('Failed to load lesson:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) loadLesson();
  }, [id]);

  useEffect(() => {
    const { initialize } = useProgressStore.getState();
    initialize();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!lesson) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Lesson not found</p>
        <Link to="/lessons" className="text-blue-600 hover:underline">
          Back to Lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/lessons" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Lessons
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {lesson.estimatedDuration} minutes
            </div>
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
              {lesson.difficulty}
            </span>
          </div>
          
          {nlpAnalysis && (
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">AI Analysis</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">Words:</span>
                  <span className="ml-1 font-medium">{nlpAnalysis.wordCount}</span>
                </div>
                <div>
                  <span className="text-gray-600">Reading Level:</span>
                  <span className="ml-1 font-medium">{nlpAnalysis.readingLevel}</span>
                </div>
                <div>
                  <span className="text-gray-600">Complexity:</span>
                  <span className="ml-1 font-medium capitalize">{nlpAnalysis.complexity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Sentiment:</span>
                  <span className="ml-1 font-medium capitalize">{nlpAnalysis.sentiment}</span>
                </div>
              </div>
              {nlpAnalysis.keywords.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-600">Key topics: </span>
                  <span className="text-xs">{nlpAnalysis.keywords.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">Lesson Content</span>
                  <span className="text-xs text-gray-500">(Select text to highlight or add notes)</span>
                </div>
              </div>
              <TextHighlighter
                content={simplifiedContent || lesson.content}
                lessonId={id}
                userId="current-user"
                highlights={getHighlights(id)}
                notes={getNotes(id)}
                onHighlight={(highlight) => addHighlight(id, highlight)}
                onNote={(note) => addNote(id, note)}
              />
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <ProgressBadges
              badges={progress?.badges || []}
              achievements={progress?.achievements || []}
              currentLevel={{
                level: progress?.level || 1,
                xpRequired: (progress?.level || 1) * 100,
                xpForNext: 100,
                title: `Level ${progress?.level || 1} Learner`,
                description: 'Keep learning!',
                rewards: []
              }}
              xp={progress?.totalXP || 0}
            />
          </div>
        </div>
        
        <AccessibilityHelper
          content={lesson.content}
          onSimplify={(text) => {
            console.log('Simplifying text:', text);
            setSimplifiedContent(text);
          }}
        />
        
        <div className="mt-8 text-center">
          {progress?.completedLessons?.includes(id) ? (
            <div className="inline-flex items-center text-green-600 font-medium">
              <CheckCircle className="w-5 h-5 mr-2" />
              Lesson Completed
            </div>
          ) : (
            <button 
              onClick={async () => {
                if (!id || completing) return;
                setCompleting(true);
                try {
                  await markLessonComplete(id);
                } catch (error) {
                  console.error('Failed to mark lesson complete:', error);
                } finally {
                  setCompleting(false);
                }
              }}
              disabled={completing}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {completing ? 'Marking Complete...' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPage;