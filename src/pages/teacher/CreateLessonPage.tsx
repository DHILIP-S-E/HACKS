import React, { useState } from 'react';
import { LessonService, type GeneratedLesson } from '@/lib/lessonService';
import type { Lesson } from '@/types/lesson';

const CreateLessonPage: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generatedLessons, setGeneratedLessons] = useState<GeneratedLesson[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<GeneratedLesson | null>(null);

  const generateLessons = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API key not found');
      
      const lessonService = new LessonService(apiKey);
      const lessons = await lessonService.generateLessons(topic);
      setGeneratedLessons(lessons);
    } catch (error) {
      console.error('Error generating lessons:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Lesson</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Topic Input */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Lessons with AI</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter topic (e.g., 'Photosynthesis', 'World War II', 'Algebra')"
            />
            <button
              onClick={generateLessons}
              disabled={isGenerating || !topic.trim()}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate 3 Lessons'}
            </button>
          </div>
        </div>

        {/* Generated Lessons */}
        {generatedLessons.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {generatedLessons.map((lesson) => (
              <div key={lesson.difficulty} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-3 capitalize">
                  {lesson.difficulty} Level
                </h3>
                <div className="text-sm text-gray-600 mb-2">
                  Duration: {lesson.estimatedDuration} minutes
                </div>
                <div className="text-sm text-gray-600 mb-4 max-h-32 overflow-y-auto">
                  {lesson.content.substring(0, 200)}...
                </div>
                <button
                  onClick={() => setSelectedLesson(lesson)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Use This Lesson
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Selected Lesson Form */}
        {selectedLesson && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-6">Edit {selectedLesson.difficulty} Lesson</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Title
                </label>
                <input
                  type="text"
                  defaultValue={selectedLesson.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lesson Content
                </label>
                <textarea
                  rows={12}
                  defaultValue={selectedLesson.content}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                  Create Lesson
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLesson(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Back to Selection
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLessonPage;