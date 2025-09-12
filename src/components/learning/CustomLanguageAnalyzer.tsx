import React, { useState } from 'react';
import { CustomLanguageNLP, EXAMPLE_LANGUAGE } from '../../lib/customLanguageNLP';
import { Languages, ArrowRight, BookOpen } from 'lucide-react';

export const CustomLanguageAnalyzer: React.FC = () => {
  const [inputText, setInputText] = useState('mi wile moku telo pona');
  const [analysis, setAnalysis] = useState(null);
  
  const nlp = new CustomLanguageNLP(EXAMPLE_LANGUAGE);

  const analyzeText = () => {
    const parsed = nlp.parseText(inputText);
    const translated = nlp.translateToEnglish(inputText);
    const complexity = nlp.analyzeComplexity(inputText);
    
    setAnalysis({
      original: inputText,
      translated,
      words: parsed.words,
      translations: parsed.translations,
      complexity
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Custom Language NLP</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Enter text in SimpleLang:
          </label>
          <textarea
            className="w-full p-3 border rounded resize-none"
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="mi wile moku telo pona"
          />
        </div>
        
        <button
          onClick={analyzeText}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Analyze Language
        </button>
        
        {analysis && (
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Original Text</h4>
                <p className="text-sm">{analysis.original}</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Translation
                </h4>
                <p className="text-sm">{analysis.translated}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Word Analysis</h4>
                <p className="text-sm text-gray-600">
                  Total words: {analysis.words.length}
                </p>
                <p className="text-sm text-gray-600">
                  Known: {analysis.complexity.knownWords}
                </p>
              </div>
              
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Grammar Score</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(analysis.complexity.grammarScore)}%
                </p>
              </div>
              
              <div className="p-4 border rounded">
                <h4 className="font-medium mb-2">Vocabulary</h4>
                <div className="space-y-1">
                  {Object.entries(analysis.translations).map(([word, translation]) => (
                    <div key={word} className="text-xs">
                      <span className="font-mono">{word}</span> → {translation}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {analysis.complexity.unknownWords.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded">
                <h4 className="font-medium mb-2">Unknown Words</h4>
                <p className="text-sm text-gray-600">
                  {analysis.complexity.unknownWords.join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4" />
          <span className="font-medium text-sm">SimpleLang Vocabulary</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {Object.entries(EXAMPLE_LANGUAGE.vocabulary).map(([word, meaning]) => (
            <div key={word} className="flex justify-between">
              <span className="font-mono">{word}</span>
              <span className="text-gray-600">{meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};