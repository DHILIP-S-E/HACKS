import { createGeminiAIAdapter } from './adapters/geminiAdapter';

export class GeminiTranslator {
  private static adapter = createGeminiAIAdapter(import.meta.env.VITE_GEMINI_API_KEY || '');

  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      const prompt = `Translate this text to ${targetLanguage}. Return only the translated text without any formatting, markdown, or extra symbols:\n\n${text}`;
      
      const translated = await this.adapter.generateContent(prompt, { temperature: 0.3 });
      return translated.replace(/[`]/g, '').trim();
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    }
  }

  static async simplifyText(text: string, language: string = 'english'): Promise<string> {
    try {
      const prompt = `Simplify this text for students with learning disabilities. Use shorter sentences, simpler words. Return only plain text without markdown or symbols:\n\n${text}`;
      
      const simplified = await this.adapter.generateContent(prompt, { temperature: 0.3 });
      return simplified.replace(/[`]/g, '').trim();
    } catch (error) {
      console.error('Simplification failed:', error);
      return text;
    }
  }
}