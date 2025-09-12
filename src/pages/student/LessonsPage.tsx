import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LessonService } from '@/lib/lessonService';
import { localAdapter } from '@/lib/adapters/localAdapter';
import { useProgressStore } from '@/stores/progressStore';
import { Plus, Clock, CheckCircle } from 'lucide-react';

const LessonsPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [lessons, setLessons] = useState([]);
  const { progress } = useProgressStore();

  useEffect(() => {
    const loadLessons = async () => {
      try {
        const allLessons = await localAdapter.getLessons();
        setLessons(allLessons);
      } catch (error) {
        console.error('Failed to load lessons:', error);
      }
    };
    loadLessons();
  }, []);

  const generateLessons = async () => {
    if (!topic.trim()) {
      setMessage('Please enter a topic');
      return;
    }
    
    setIsGenerating(true);
    setMessage('Generating lessons...');
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessage('Error: API key not found');
        return;
      }
      
      const lessonService = new LessonService(apiKey);
      const generatedLessons = await lessonService.generateLessons(topic);
      
      if (!generatedLessons || generatedLessons.length === 0) {
        setMessage('Error: No lessons generated');
        return;
      }
      
      // Save each lesson to storage
      const savedLessons = [];
      for (const gl of generatedLessons) {
        const lessonData = {
          title: gl.title,
          description: `AI-generated ${gl.difficulty} lesson on ${topic}`,
          content: gl.content,
          authorId: 'ai',
          authorName: 'AI Assistant',
          subject: topic,
          gradeLevel: ['all'],
          difficulty: gl.difficulty,
          estimatedDuration: gl.estimatedDuration,
          tags: [topic.toLowerCase(), gl.difficulty, 'ai-generated'],
          attachments: [],
          accessibility: { altTexts: {}, transcripts: {}, verificationStatus: 'unverified' },
          version: 1,
          status: 'published',
          metadata: { topics: [topic] },
          isPublished: true
        };
        
        const savedLesson = await localAdapter.createLesson(lessonData);
        savedLessons.push(savedLesson);
      }
      
      // Reload all lessons to show the new ones
      const allLessons = await localAdapter.getLessons();
      setLessons(allLessons);
      
      setMessage(`Success! Generated ${savedLessons.length} lessons`);
      setTopic('');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setMessage(`Error: ${error.message || 'Failed to generate lessons'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lessons</h1>
            <p className="text-gray-600">Explore our learning content</p>
          </div>
          <button
            onClick={() => document.getElementById('generator').style.display = 
              document.getElementById('generator').style.display === 'none' ? 'block' : 'none'}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Lessons
          </button>
        </div>
        
        <div id="generator" style={{display: 'none'}} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Generate AI Lessons</h3>
          <div className="flex gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter topic (e.g., 'JavaScript', 'History', 'Math')"
            />
            <button
              onClick={generateLessons}
              disabled={isGenerating || !topic.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate 3 Lessons'}
            </button>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {lesson.difficulty}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {lesson.estimatedDuration}min
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {lesson.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {lesson.description}
              </p>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {lesson.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Link
                to={`/lessons/${lesson.id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {progress?.completedLessons?.includes(lesson.id) ? 'Review Lesson' : 'Start Lesson'}
              </Link>
              {progress?.completedLessons?.includes(lesson.id) && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;