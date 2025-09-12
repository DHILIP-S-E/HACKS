import { fallbackAdapters } from './fallbackAdapter';
import { geminiAdapters } from './geminiAdapter';
import type { AIAdapter, TTSAdapter, STTAdapter, OCRAdapter, TranslationAdapter } from '@/types/adapters';

// Auto-selecting AI adapter based on environment
class AdapterManager {
  private aiAdapter: AIAdapter;
  private ttsAdapter: TTSAdapter;
  private sttAdapter: STTAdapter;
  private ocrAdapter: OCRAdapter;
  private translationAdapter: TranslationAdapter;

  constructor() {
    this.initializeAdapters();
  }

  private initializeAdapters() {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Initialize AI adapter
    if (geminiApiKey && geminiApiKey !== 'your_gemini_key_here') {
      console.log('Initializing Gemini AI adapter');
      this.aiAdapter = geminiAdapters.createAI(geminiApiKey);
    } else {
      console.log('Using fallback AI adapter');
      this.aiAdapter = fallbackAdapters.ai;
    }

    // Initialize TTS adapter
    if (geminiApiKey && geminiAdapters.createTTS(geminiApiKey).isSupported()) {
      this.ttsAdapter = geminiAdapters.createTTS(geminiApiKey);
    } else {
      this.ttsAdapter = fallbackAdapters.tts;
    }

    // Other adapters use fallback implementations
    this.sttAdapter = fallbackAdapters.stt;
    this.ocrAdapter = fallbackAdapters.ocr;
    this.translationAdapter = fallbackAdapters.translation;
  }

  // AI methods with fallback handling
  async generateSummary(text: string, options?: any): Promise<string> {
    try {
      return await this.aiAdapter.generateSummary(text, options);
    } catch (error) {
      console.error('AI summary generation failed, using fallback:', error);
      return await fallbackAdapters.ai.generateSummary(text, options);
    }
  }

  async simplifyText(text: string, readingLevel?: number): Promise<string> {
    try {
      return await this.aiAdapter.simplifyText(text, readingLevel);
    } catch (error) {
      console.error('AI text simplification failed, using fallback:', error);
      return await fallbackAdapters.ai.simplifyText(text, readingLevel);
    }
  }

  async generateQuestions(text: string, count?: number): Promise<Array<{ question: string; options?: string[]; answer?: string; }>> {
    try {
      return await this.aiAdapter.generateQuestions(text, count);
    } catch (error) {
      console.error('AI question generation failed, using fallback:', error);
      return await fallbackAdapters.ai.generateQuestions(text, count);
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      return await this.aiAdapter.detectLanguage(text);
    } catch (error) {
      console.error('AI language detection failed, using fallback:', error);
      return await fallbackAdapters.ai.detectLanguage(text);
    }
  }

  async analyzeSentiment(text: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral'; confidence: number; }> {
    try {
      return await this.aiAdapter.analyzeSentiment(text);
    } catch (error) {
      console.error('AI sentiment analysis failed, using fallback:', error);
      return await fallbackAdapters.ai.analyzeSentiment(text);
    }
  }

  // TTS methods
  async speak(text: string, options?: any): Promise<void> {
    try {
      if (this.ttsAdapter.isSupported()) {
        return await this.ttsAdapter.speak(text, options);
      }
      throw new Error('TTS not supported');
    } catch (error) {
      console.error('TTS failed, trying fallback:', error);
      if (fallbackAdapters.tts.isSupported()) {
        return await fallbackAdapters.tts.speak(text, options);
      }
      throw new Error('TTS not available');
    }
  }

  async pauseTTS(): Promise<void> {
    return await this.ttsAdapter.pause();
  }

  async resumeTTS(): Promise<void> {
    return await this.ttsAdapter.resume();
  }

  async stopTTS(): Promise<void> {
    return await this.ttsAdapter.stop();
  }

  async getTTSVoices(): Promise<Array<{ name: string; language: string; gender?: string; }>> {
    return await this.ttsAdapter.getVoices();
  }

  // STT methods
  async startSTT(options?: any): Promise<void> {
    if (!this.sttAdapter.isSupported()) {
      throw new Error('Speech recognition not supported');
    }
    return await this.sttAdapter.startRecording(options);
  }

  async stopSTT(): Promise<string> {
    return await this.sttAdapter.stopRecording();
  }

  onSTTResult(callback: (text: string, isFinal: boolean) => void): void {
    this.sttAdapter.onResult(callback);
  }

  // OCR methods
  async extractTextFromImage(imageData: File | string): Promise<string> {
    return await this.ocrAdapter.extractText(imageData);
  }

  async extractTextFromPDF(pdfData: File): Promise<string> {
    return await this.ocrAdapter.extractTextFromPDF(pdfData);
  }

  // Translation methods
  async translateText(text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> {
    return await this.translationAdapter.translateText(text, targetLanguage, sourceLanguage);
  }

  async detectTextLanguage(text: string): Promise<string> {
    return await this.translationAdapter.detectLanguage(text);
  }

  async getSupportedLanguages(): Promise<Array<{ code: string; name: string; }>> {
    return await this.translationAdapter.getSupportedLanguages();
  }
}

// Export singleton instance
export const aiAdapter = new AdapterManager();

// Export types for convenience
export type { AIAdapter, TTSAdapter, STTAdapter, OCRAdapter, TranslationAdapter };