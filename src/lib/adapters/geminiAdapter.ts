import type { AIAdapter, TTSAdapter } from '@/types/adapters';

class GeminiClient {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string, options?: any): Promise<string> {
    const response = await fetch(`${this.baseUrl}/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: options?.temperature || 0.7,
          topK: options?.topK || 40,
          topP: options?.topP || 0.95,
          maxOutputTokens: options?.maxTokens || 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}

// Gemini AI adapter implementation
export const createGeminiAIAdapter = (apiKey: string): AIAdapter => {
  const client = new GeminiClient(apiKey);

  return {
    async generateSummary(text: string, options?: any): Promise<string> {
      const readingLevel = options?.readingLevel || 'grade-8';
      const prompt = `
        Please summarize the following text in a clear, concise manner suitable for ${readingLevel} reading level.
        Focus on the main ideas and key points. Use simple, accessible language.
        
        Text to summarize:
        ${text}
        
        Summary:
      `;
      
      return await client.generateContent(prompt, { temperature: 0.3 });
    },

    async simplifyText(text: string, readingLevel?: number): Promise<string> {
      const level = readingLevel || 8;
      const prompt = `
        Please rewrite the following text to be suitable for a grade-${level} reading level.
        Use shorter sentences, simpler vocabulary, and clearer explanations.
        Maintain all important information while making it more accessible.
        
        Text to simplify:
        ${text}
        
        Simplified text:
      `;
      
      return await client.generateContent(prompt, { temperature: 0.3 });
    },

    async generateQuestions(text: string, count: number = 5): Promise<Array<{ question: string; options?: string[]; answer?: string; }>> {
      const prompt = `
        Based on the following text, generate ${count} multiple-choice questions that test comprehension.
        Format each question as:
        Q: [question]
        A: [correct answer option]
        B: [incorrect option]
        C: [incorrect option]
        D: [incorrect option]
        CORRECT: A
        
        Text:
        ${text}
        
        Questions:
      `;
      
      const response = await client.generateContent(prompt, { temperature: 0.5 });
      
      // Parse the response into structured questions
      const questions: Array<{ question: string; options: string[]; answer: string; }> = [];
      const blocks = response.split(/Q\s*\d*\s*:/).slice(1);
      
      blocks.forEach(block => {
        const lines = block.trim().split('\n').filter(line => line.trim());
        if (lines.length >= 5) {
          const question = lines[0].trim();
          const options: string[] = [];
          let correctAnswer = '';
          
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.match(/^[ABCD]:/)) {
              options.push(line.substring(2).trim());
            } else if (line.startsWith('CORRECT:')) {
              correctAnswer = line.substring(8).trim();
            }
          }
          
          if (question && options.length === 4) {
            questions.push({ question, options, answer: correctAnswer });
          }
        }
      });
      
      return questions.slice(0, count);
    },

    async detectLanguage(text: string): Promise<string> {
      const prompt = `
        Detect the primary language of the following text and respond with just the ISO 639-1 language code (e.g., 'en', 'hi', 'es'):
        
        "${text.substring(0, 200)}"
        
        Language code:
      `;
      
      const response = await client.generateContent(prompt, { temperature: 0.1 });
      return response.trim().toLowerCase().substring(0, 2);
    },

    async analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number; }> {
      const prompt = `
        Analyze the sentiment of the following text and respond in this exact format:
        SENTIMENT: [positive/negative/neutral]
        CONFIDENCE: [0.0-1.0]
        
        Text:
        ${text}
        
        Analysis:
      `;
      
      const response = await client.generateContent(prompt, { temperature: 0.1 });
      
      const sentimentMatch = response.match(/SENTIMENT:\s*(positive|negative|neutral)/i);
      const confidenceMatch = response.match(/CONFIDENCE:\s*([0-9.]+)/);
      
      const sentiment = (sentimentMatch?.[1]?.toLowerCase() as 'positive' | 'negative' | 'neutral') || 'neutral';
      const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5;
      
      return { sentiment, confidence };
    },
  };
};

// Gemini TTS adapter (if Gemini supports TTS in the future)
export const createGeminiTTSAdapter = (apiKey: string): TTSAdapter => {
  return {
    isSupported(): boolean {
      // Gemini doesn't currently support TTS directly
      // This is a placeholder for future implementation
      return false;
    },

    async speak(text: string, options?: any): Promise<void> {
      throw new Error('Gemini TTS not yet implemented. Using fallback TTS.');
    },

    async pause(): Promise<void> {
      throw new Error('Gemini TTS not yet implemented.');
    },

    async resume(): Promise<void> {
      throw new Error('Gemini TTS not yet implemented.');
    },

    async stop(): Promise<void> {
      throw new Error('Gemini TTS not yet implemented.');
    },

    async getVoices(): Promise<Array<{ name: string; language: string; gender?: string; }>> {
      return [];
    },
  };
};

export const geminiAdapters = {
  createAI: createGeminiAIAdapter,
  createTTS: createGeminiTTSAdapter,
};