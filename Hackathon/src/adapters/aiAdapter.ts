import type { AIAdapter } from '@/types'
import GeminiAdapter from './geminiAdapter'
import FallbackAdapter from './fallbackAdapter'

class AIAdapterSelector implements AIAdapter {
  private adapter: AIAdapter
  private fallbackAdapter: AIAdapter

  constructor() {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY
    
    if (geminiApiKey && geminiApiKey !== 'your_gemini_key_here') {
      this.adapter = new GeminiAdapter(geminiApiKey)
      console.log('Using Gemini AI adapter')
    } else {
      this.adapter = new FallbackAdapter()
      console.log('Using fallback AI adapter - limited functionality')
    }
    
    this.fallbackAdapter = new FallbackAdapter()
  }

  async generateText(prompt: string, options?: any): Promise<string> {
    try {
      return await this.adapter.generateText(prompt, options)
    } catch (error) {
      console.warn('Primary AI adapter failed, falling back:', error)
      return await this.fallbackAdapter.generateText(prompt, options)
    }
  }

  async generateSummary(text: string): Promise<string> {
    try {
      return await this.adapter.generateSummary(text)
    } catch (error) {
      console.warn('Primary AI adapter failed, falling back:', error)
      return await this.fallbackAdapter.generateSummary(text)
    }
  }

  async generateAltText(imageUrl: string): Promise<string> {
    try {
      return await this.adapter.generateAltText(imageUrl)
    } catch (error) {
      console.warn('Primary AI adapter failed, falling back:', error)
      return await this.fallbackAdapter.generateAltText(imageUrl)
    }
  }

  async transcribeAudio(audioUrl: string): Promise<string> {
    try {
      return await this.adapter.transcribeAudio(audioUrl)
    } catch (error) {
      console.warn('Primary AI adapter failed, falling back:', error)
      return await this.fallbackAdapter.transcribeAudio(audioUrl)
    }
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    try {
      return await this.adapter.translateText(text, targetLang)
    } catch (error) {
      console.warn('Primary AI adapter failed, falling back:', error)
      return await this.fallbackAdapter.translateText(text, targetLang)
    }
  }
}

// Export singleton instance
export const aiAdapter = new AIAdapterSelector()
export default aiAdapter