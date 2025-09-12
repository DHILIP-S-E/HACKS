import type { AIAdapter, TTSAdapter, STTAdapter, OCRAdapter, TranslationAdapter } from '@/types/adapters';

// Fallback AI adapter using browser APIs and stubs
export const fallbackAIAdapter: AIAdapter = {
  async generateSummary(text: string, options?: any): Promise<string> {
    // Simple text summarization using sentence extraction
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const summaryLength = Math.min(3, Math.ceil(sentences.length * 0.3));
    return sentences.slice(0, summaryLength).join('. ') + '.';
  },

  async simplifyText(text: string, readingLevel?: number): Promise<string> {
    // Basic text simplification
    return text
      .replace(/\b(utilize|demonstrate|accomplish)\b/gi, 'use')
      .replace(/\b(furthermore|additionally|moreover)\b/gi, 'also')
      .replace(/\b(approximately|roughly)\b/gi, 'about')
      .replace(/([.!?])\s+/g, '$1\n\n'); // Add spacing for readability
  },

  async generateQuestions(text: string, count: number = 5): Promise<Array<{ question: string; options?: string[]; answer?: string; }>> {
    // Generate simple questions from text
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const questions = [];
    
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i].trim();
      questions.push({
        question: `What does this mean: "${sentence.substring(0, 50)}..."?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        answer: 'This would require manual review',
      });
    }
    
    return questions;
  },

  async detectLanguage(text: string): Promise<string> {
    // Simple language detection based on character patterns
    const hindiPattern = /[\u0900-\u097F]/;
    const arabicPattern = /[\u0600-\u06FF]/;
    const chinesePattern = /[\u4e00-\u9fff]/;
    
    if (hindiPattern.test(text)) return 'hi';
    if (arabicPattern.test(text)) return 'ar';
    if (chinesePattern.test(text)) return 'zh';
    
    return 'en';
  },

  async analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number; }> {
    // Basic sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'happy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'sad', 'angry', 'frustrated'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) return { sentiment: 'neutral', confidence: 0.5 };
    
    const sentiment = positiveCount > negativeCount ? 'positive' : 'negative';
    const confidence = Math.max(positiveCount, negativeCount) / total;
    
    return { sentiment, confidence };
  },
};

// Fallback TTS adapter using Web Speech API
export const fallbackTTSAdapter: TTSAdapter = {
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  },

  async speak(text: string, options?: { voice?: string; rate?: number; pitch?: number; }): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Text-to-speech not supported');
    }

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (options?.voice) {
        const voices = speechSynthesis.getVoices();
        const voice = voices.find(v => v.name === options.voice);
        if (voice) utterance.voice = voice;
      }
      
      if (options?.rate) utterance.rate = options.rate;
      if (options?.pitch) utterance.pitch = options.pitch;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`TTS error: ${event.error}`));

      speechSynthesis.speak(utterance);
    });
  },

  async pause(): Promise<void> {
    if (this.isSupported()) {
      speechSynthesis.pause();
    }
  },

  async resume(): Promise<void> {
    if (this.isSupported()) {
      speechSynthesis.resume();
    }
  },

  async stop(): Promise<void> {
    if (this.isSupported()) {
      speechSynthesis.cancel();
    }
  },

  async getVoices(): Promise<Array<{ name: string; language: string; gender?: string; }>> {
    if (!this.isSupported()) return [];

    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices.map(voice => ({
          name: voice.name,
          language: voice.lang,
          gender: voice.name.toLowerCase().includes('female') ? 'female' : 'male',
        })));
      } else {
        // Wait for voices to load
        speechSynthesis.onvoiceschanged = () => {
          const voices = speechSynthesis.getVoices();
          resolve(voices.map(voice => ({
            name: voice.name,
            language: voice.lang,
            gender: voice.name.toLowerCase().includes('female') ? 'female' : 'male',
          })));
        };
      }
    });
  },
};

// Fallback STT adapter using Web Speech API
export const fallbackSTTAdapter: STTAdapter = {
  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  async startRecording(options?: { language?: string; continuous?: boolean; }): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Speech recognition not supported');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = options?.language || 'en-US';
    recognition.continuous = options?.continuous || false;
    recognition.interimResults = true;

    return new Promise((resolve, reject) => {
      recognition.onstart = () => resolve();
      recognition.onerror = (event) => reject(new Error(`STT error: ${event.error}`));
      
      recognition.start();
    });
  },

  async stopRecording(): Promise<string> {
    // This is a simplified implementation
    // In a real app, you'd need to manage the recognition instance
    return new Promise((resolve) => {
      setTimeout(() => resolve('Placeholder transcription'), 1000);
    });
  },

  onResult(callback: (text: string, isFinal: boolean) => void): void {
    // Implementation would attach to recognition.onresult
    console.log('STT result callback registered');
  },
};

// Stub OCR adapter
export const fallbackOCRAdapter: OCRAdapter = {
  async extractText(imageData: File | string): Promise<string> {
    // In a real implementation, this might use Tesseract.js or similar
    return 'OCR extraction not available in fallback mode. Please configure a proper OCR service.';
  },

  async extractTextFromPDF(pdfData: File): Promise<string> {
    return 'PDF text extraction not available in fallback mode.';
  },
};

// Stub translation adapter
export const fallbackTranslationAdapter: TranslationAdapter = {
  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    // Basic translation stub - in reality you'd use a service like Google Translate
    if (targetLanguage === 'hi' && sourceLanguage === 'en') {
      // Very basic English to Hindi translations for demo
      const basicTranslations: Record<string, string> = {
        'hello': 'नमस्ते',
        'goodbye': 'अलविदा',
        'thank you': 'धन्यवाद',
        'yes': 'हाँ',
        'no': 'नहीं',
      };
      
      const lowerText = text.toLowerCase();
      for (const [en, hi] of Object.entries(basicTranslations)) {
        if (lowerText.includes(en)) {
          return text.replace(new RegExp(en, 'gi'), hi);
        }
      }
    }
    
    return `[Translation to ${targetLanguage}]: ${text}`;
  },

  async detectLanguage(text: string): Promise<string> {
    return fallbackAIAdapter.detectLanguage(text);
  },

  async getSupportedLanguages(): Promise<Array<{ code: string; name: string; }>> {
    return [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
    ];
  },
};

// Export all adapters
export const fallbackAdapters = {
  ai: fallbackAIAdapter,
  tts: fallbackTTSAdapter,
  stt: fallbackSTTAdapter,
  ocr: fallbackOCRAdapter,
  translation: fallbackTranslationAdapter,
};