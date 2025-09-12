import React, { useState, useEffect } from 'react';
import { TextHighlighter } from './TextHighlighter';
import { ProgressBadges } from './ProgressBadges';
import { CustomLanguageAnalyzer } from './CustomLanguageAnalyzer';
import { NLPService } from '../../lib/nlpService';
import { useNotesStore } from '../../stores/notesStore';
import { Brain, Award, MessageSquare, Languages } from 'lucide-react';

const DEMO_CONTENT = `# Welcome to Advanced Language Learning

This is an interactive lesson where you can highlight important text and add personal notes. The system uses natural language processing to analyze the content and provide insights about reading level and complexity.

## Key Features

Language learning becomes more effective when you actively engage with the content. Try selecting any text in this lesson to highlight it or add your own notes.

## Practice Exercise

Select this paragraph and try highlighting it with different colors. You can also add notes to remember important concepts for later review.

The system tracks your progress and awards badges for consistent learning and engagement.`;

export const LearningDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'analysis' | 'progress' | 'custom'>('content');
  const { addHighlight, addNote, getHighlights, getNotes } = useNotesStore();
  
  const [nlpAnalysis, setNlpAnalysis] = useState(null);
  
  useEffect(() => {
    NLPService.analyzeText(DEMO_CONTENT).then(setNlpAnalysis);
  }, []);
  
  const demoProgress = {
    badges: [
      {
        id: '1',
        name: 'First Highlight',
        description: 'Made your first highlight',
        icon: '🎯',
        rarity: 'common' as const,
        category: 'learning' as const,
        requirements: [],
        awardedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Note Taker',
        description: 'Added 5 personal notes',
        icon: '📝',
        rarity: 'uncommon' as const,
        category: 'learning' as const,
        requirements: [],
        awardedAt: new Date().toISOString()
      }
    ],
    achievements: [
      {
        id: '1',
        name: 'Reading Streak',
        description: 'Read lessons for 7 days in a row',
        category: 'consistency',
        difficulty: 'bronze' as const,
        xpReward: 100,
        requirements: [],
        unlockedAt: new Date().toISOString(),
        progress: {
          currentValue: 5,
          targetValue: 7,
          percentage: 71,
          isCompleted: false
        }
      }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Interactive Learning Demo</h1>
        <p className="text-gray-600">Experience NLP analysis, text highlighting, and progress tracking</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('content')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'content' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Interactive Content
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'analysis' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <Brain className="w-4 h-4" />
          NLP Analysis
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'progress' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4" />
          Progress & Badges
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'custom' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          <Languages className="w-4 h-4" />
          Custom Language
        </button>
      </div>

      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Interactive Lesson Content</h3>
                <p className="text-sm text-gray-600">Select text to highlight or add notes</p>
              </div>
              <TextHighlighter
                content={DEMO_CONTENT}
                lessonId="demo"
                userId="demo-user"
                highlights={getHighlights('demo')}
                notes={getNotes('demo')}
                onHighlight={(highlight) => addHighlight('demo', highlight)}
                onNote={(note) => addNote('demo', note)}
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <ProgressBadges
              badges={demoProgress.badges}
              achievements={demoProgress.achievements}
              currentLevel={{
                level: 3,
                xpRequired: 200,
                xpForNext: 100,
                title: 'Advanced Learner',
                description: 'Making great progress!',
                rewards: []
              }}
              xp={250}
            />
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">NLP Content Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Basic Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count:</span>
                  <span className="font-medium">{nlpAnalysis?.wordCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sentences:</span>
                  <span className="font-medium">{nlpAnalysis?.sentenceCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reading Level:</span>
                  <span className="font-medium">Grade {nlpAnalysis?.readingLevel || 8}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Content Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Complexity:</span>
                  <span className={`font-medium capitalize ${
                    nlpAnalysis?.complexity === 'easy' ? 'text-green-600' :
                    nlpAnalysis?.complexity === 'medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {nlpAnalysis?.complexity || 'medium'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sentiment:</span>
                  <span className={`font-medium capitalize ${
                    nlpAnalysis?.sentiment === 'positive' ? 'text-green-600' :
                    nlpAnalysis?.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {nlpAnalysis?.sentiment || 'neutral'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Key Topics</h4>
              <div className="flex flex-wrap gap-2">
                {(nlpAnalysis?.keywords || []).map(keyword => (
                  <span key={keyword} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Progress & Achievements</h3>
          <ProgressBadges
            badges={demoProgress.badges}
            achievements={demoProgress.achievements}
            currentLevel={{
              level: 3,
              xpRequired: 200,
              xpForNext: 100,
              title: 'Advanced Learner',
              description: 'Making great progress!',
              rewards: []
            }}
            xp={250}
          />
        </div>
      )}

      {activeTab === 'custom' && <CustomLanguageAnalyzer />}
    </div>
  );
};