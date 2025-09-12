import { createGeminiAIAdapter } from './adapters/geminiAdapter';

export interface NLPAnalysis {
  wordCount: number;
  sentenceCount: number;
  readingLevel: number;
  complexity: 'easy' | 'medium' | 'hard';
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export class NLPService {
  private static geminiAdapter = createGeminiAIAdapter(import.meta.env.VITE_GEMINI_API_KEY || '');

  static async analyzeText(text: string): Promise<NLPAnalysis> {
    try {
      const prompt = `Analyze this text and return JSON with: wordCount, sentenceCount, readingLevel (1-12), complexity (easy/medium/hard), keywords (array of 3-5 key terms), sentiment (positive/neutral/negative):\n\n${text}`;
      
      const response = await this.geminiAdapter.generateContent(prompt, { temperature: 0.1 });
      const analysis = JSON.parse(response);
      
      return {
        wordCount: analysis.wordCount || 0,
        sentenceCount: analysis.sentenceCount || 0,
        readingLevel: analysis.readingLevel || 8,
        complexity: analysis.complexity || 'medium',
        keywords: analysis.keywords || [],
        sentiment: analysis.sentiment || 'neutral'
      };
    } catch (error) {
      return this.basicAnalysis(text);
    }
  }

  private static basicAnalysis(text: string): NLPAnalysis {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      readingLevel: Math.min(12, Math.max(1, Math.round(words.length / Math.max(sentences.length, 1) * 0.5 + 3))),
      complexity: words.length > 100 ? 'hard' : words.length > 50 ? 'medium' : 'easy',
      keywords: [],
      sentiment: 'neutral'
    };
  }
}