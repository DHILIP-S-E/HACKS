import { NLPService } from '../lib/nlpService';

// Basic usage
const text = "This is sample text.";
const analysis = NLPService.analyzeText(text);

// Get specific values
const wordCount = analysis.wordCount;
const difficulty = analysis.complexity; // 'easy' | 'medium' | 'hard'
const level = analysis.readingLevel; // 1-12
const keywords = analysis.keywords; // string[]
const sentiment = analysis.sentiment; // 'positive' | 'neutral' | 'negative'

// In React component
const MyComponent = () => {
  const analyzeContent = (content: string) => {
    const result = NLPService.analyzeText(content);
    
    if (result.complexity === 'hard') {
      // Show difficulty warning
    }
    
    return result;
  };
};