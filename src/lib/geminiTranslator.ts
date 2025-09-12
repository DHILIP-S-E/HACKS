import { createGeminiAIAdapter } from './adapters/geminiAdapter';

export class GeminiTranslator {
  private static adapter = createGeminiAIAdapter(import.meta.env.VITE_GEMINI_API_KEY || '');

  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('No API key');
      }
      
      const prompt = `Translate this educational content to ${targetLanguage}. Keep it simple for students. Return only the translated text:\n\n${text.substring(0, 1000)}`;
      
      const translated = await this.adapter.generateContent(prompt, { temperature: 0.3 });
      return translated.replace(/[`]/g, '').trim();
    } catch (error) {
      console.error('Translation failed:', error);
      throw error;
    }
  }

  static async simplifyText(text: string): Promise<string> {
    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('No API key');
      }
      
      const prompt = `Make this text easier to read for students with disabilities. Use simple words and short sentences:\n\n${text.substring(0, 1000)}`;
      
      const simplified = await this.adapter.generateContent(prompt, { temperature: 0.3 });
      return simplified.replace(/[`]/g, '').trim();
    } catch (error) {
      console.error('Simplification failed:', error);
      throw error;
    }
  }
}