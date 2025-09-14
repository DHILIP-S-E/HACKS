import { AIAdapter } from '@/types';
import { geminiAdapter, GeminiError } from './geminiAdapter';
import { fallbackAdapter } from './fallbackAdapter';
import { logError } from '@/lib/utils/errorHandler';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Unified AI adapter that auto-selects implementation based on environment
class UnifiedAIAdapter implements AIAdapter {
  private primaryAdapter: AIAdapter;
  private fallbackAdapter: AIAdapter;
  
  constructor() {
    this.primaryAdapter = GEMINI_API_KEY ? geminiAdapter : fallbackAdapter;
    this.fallbackAdapter = fallbackAdapter;
  }

  async summarizeText(
    text: string, 
    options?: { language?: string; complexity?: 'simple' | 'moderate' }
  ): Promise<string> {
    try {
      return await this.primaryAdapter.summarizeText(text, options);
    } catch (error) {
      logError(error, 'AI Adapter - summarizeText');
      return await this.fallbackAdapter.summarizeText(text, options);
    }
  }

  async generateTTS(
    text: string, 
    options?: { voice?: string; speed?: number; language?: string }
  ): Promise<string> {
    try {
      return await this.primaryAdapter.generateTTS(text, options);
    } catch (error) {
      logError(error, 'AI Adapter - generateTTS');
      return await this.fallbackAdapter.generateTTS(text, options);
    }
  }

  async transcribeAudio(
    audioUrl: string, 
    options?: { language?: string }
  ): Promise<string> {
    try {
      return await this.primaryAdapter.transcribeAudio(audioUrl, options);
    } catch (error) {
      logError(error, 'AI Adapter - transcribeAudio');
      return await this.fallbackAdapter.transcribeAudio(audioUrl, options);
    }
  }

  async generateImageDescription(
    imageUrl: string, 
    options?: { language?: string }
  ): Promise<string> {
    try {
      return await this.primaryAdapter.generateImageDescription(imageUrl, options);
    } catch (error) {
      logError(error, 'AI Adapter - generateImageDescription');
      return await this.fallbackAdapter.generateImageDescription(imageUrl, options);
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      return await this.primaryAdapter.translateText(text, targetLanguage);
    } catch (error) {
      logError(error, 'AI Adapter - translateText');
      return await this.fallbackAdapter.translateText(text, targetLanguage);
    }
  }

  // Utility methods
  isGeminiAvailable(): boolean {
    return !!GEMINI_API_KEY && this.primaryAdapter === geminiAdapter;
  }

  getCurrentProvider(): 'gemini' | 'fallback' {
    return this.primaryAdapter === geminiAdapter ? 'gemini' : 'fallback';
  }

  async testConnection(): Promise<{ provider: string; available: boolean; error?: string }> {
    try {
      await this.primaryAdapter.summarizeText('Test text for connection check.');
      return {
        provider: this.getCurrentProvider(),
        available: true,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      return {
        provider: this.getCurrentProvider(),
        available: false,
        error: errorMessage,
      };
    }
  }
}

// Export singleton instance
export const aiAdapter = new UnifiedAIAdapter();

// Export individual adapters for direct access if needed
export { geminiAdapter, fallbackAdapter };

// Export utility functions
export const getAICapabilities = () => {
  const isGeminiAvailable = !!GEMINI_API_KEY;
  
  return {
    provider: isGeminiAvailable ? 'gemini' : 'fallback',
    capabilities: {
      summarization: true,
      tts: true,
      stt: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      imageDescription: isGeminiAvailable,
      translation: isGeminiAvailable,
      voiceRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      speechSynthesis: 'speechSynthesis' in window,
    },
    limitations: isGeminiAvailable ? [] : [
      'Advanced AI features require Gemini API key',
      'Image description uses basic color analysis only',
      'Translation returns original text with note',
      'TTS uses browser speech synthesis',
      'STT requires microphone access',
    ],
  };
};

export const initializeAI = async (): Promise<void> => {
  // Initialize speech synthesis voices if available
  if ('speechSynthesis' in window) {
    // Load voices
    speechSynthesis.getVoices();
    
    // Some browsers require user interaction to load voices
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', () => {
        console.log('Speech synthesis voices loaded:', speechSynthesis.getVoices().length);
      });
    }
  }
  
  // Test AI connection
  try {
    const connectionTest = await aiAdapter.testConnection();
    console.log('AI Adapter initialized successfully:', connectionTest.provider);
  } catch (error) {
    console.error('AI Adapter initialization failed');
  }
};