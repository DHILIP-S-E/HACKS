import React, { useState } from 'react';
import { AccessibilityNLP, SupportedLanguage } from '../../lib/accessibilityNLP';
import { GeminiTranslator } from '../../lib/geminiTranslator';
import { Eye, Volume2, Type, Lightbulb, Globe } from 'lucide-react';

interface AccessibilityHelperProps {
  content: string;
  onSimplify: (simplified: string) => void;
}

export const AccessibilityHelper: React.FC<AccessibilityHelperProps> = ({ content, onSimplify }) => {
  const [analysis, setAnalysis] = useState(null);
  const [showHelper, setShowHelper] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('english');

  const analyzeContent = () => {
    console.log('Analyzing content for language:', selectedLanguage);
    const result = AccessibilityNLP.analyzeForAccessibility(content, selectedLanguage);
    console.log('Analysis result:', result);
    setAnalysis(result);
  };

  const getReadabilityColor = (level: string) => {
    switch (level) {
      case 'very-easy': return 'text-green-600 bg-green-50';
      case 'easy': return 'text-blue-600 bg-blue-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!showHelper) {
    return (
      <button
        onClick={() => {
          analyzeContent();
          setShowHelper(true);
        }}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
        title="Accessibility Helper"
      >
        <Eye className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border rounded-lg shadow-xl p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Reading Helper
        </h3>
        <button
          onClick={() => setShowHelper(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-3 h-3" />
          <span className="text-xs font-medium">Language:</span>
        </div>
        <select
          value={selectedLanguage}
          onChange={(e) => {
            const newLang = e.target.value as SupportedLanguage;
            setSelectedLanguage(newLang);
            const result = AccessibilityNLP.analyzeForAccessibility(content, newLang);
            setAnalysis(result);
          }}
          className="w-full text-xs p-1 border rounded"
        >
          <option value="english">English</option>
          <option value="tamil">தமிழ் (Tamil)</option>
          <option value="malayalam">മലയാളം (Malayalam)</option>
          <option value="kannada">ಕನ್ನಡ (Kannada)</option>
        </select>
      </div>

      {analysis && (
        <div className="space-y-3">
          <div className={`p-2 rounded text-sm ${getReadabilityColor(analysis.readabilityLevel)}`}>
            <strong>Reading Level:</strong> {analysis.readabilityLevel.replace('-', ' ')}
          </div>

          {analysis.suggestions.length > 0 && (
            <div className="bg-yellow-50 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <Lightbulb className="w-3 h-3" />
                <span className="text-xs font-medium">Suggestions:</span>
              </div>
              <ul className="text-xs space-y-1">
                {analysis.suggestions.map((suggestion, i) => (
                  <li key={i}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={async () => {
                console.log('Button clicked for language:', selectedLanguage);
                let processedText;
                
                if (selectedLanguage === 'english') {
                  processedText = await GeminiTranslator.simplifyText(content, 'english');
                } else {
                  const langMap = {
                    tamil: 'Tamil',
                    malayalam: 'Malayalam', 
                    kannada: 'Kannada'
                  };
                  processedText = await GeminiTranslator.translateText(content, langMap[selectedLanguage]);
                }
                
                console.log('Processed text:', processedText);
                onSimplify(processedText);
              }}
              className="w-full bg-green-500 text-white text-sm py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <Type className="w-3 h-3" />
              {selectedLanguage === 'english' ? 'Simplify with AI' : 'Translate with AI'}
            </button>

            <button
              onClick={() => {
                const textToRead = analysis.translatedText || content;
                const utterance = new SpeechSynthesisUtterance(textToRead);
                utterance.rate = 0.8;
                utterance.lang = selectedLanguage === 'tamil' ? 'ta-IN' : 
                                selectedLanguage === 'malayalam' ? 'ml-IN' :
                                selectedLanguage === 'kannada' ? 'kn-IN' : 'en-US';
                speechSynthesis.speak(utterance);
              }}
              className="w-full bg-blue-500 text-white text-sm py-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
            >
              <Volume2 className="w-3 h-3" />
              Read Aloud
            </button>
          </div>

          {analysis.keyPoints.length > 0 && (
            <div className="bg-blue-50 p-2 rounded">
              <span className="text-xs font-medium">Key Points:</span>
              <ul className="text-xs mt-1 space-y-1">
                {analysis.keyPoints.map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
              </ul>
            </div>
          )}

          {analysis.complexWords.length > 0 && (
            <div className="bg-red-50 p-2 rounded">
              <span className="text-xs font-medium">Complex Words:</span>
              <div className="text-xs mt-1">
                {analysis.complexWords.join(', ')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};