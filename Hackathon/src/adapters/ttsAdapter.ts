import type { TTSAdapter } from '@/types'

class BrowserTTSAdapter implements TTSAdapter {
  private synthesis: SpeechSynthesis
  private currentUtterance: SpeechSynthesisUtterance | null = null

  constructor() {
    this.synthesis = window.speechSynthesis
  }

  async synthesize(text: string, options?: {voice?: string; speed?: number; pitch?: number}): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'))
        return
      }

      // Cancel any ongoing speech
      this.synthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      
      // Set options
      if (options?.speed) {
        utterance.rate = Math.max(0.1, Math.min(10, options.speed))
      }
      
      if (options?.pitch) {
        utterance.pitch = Math.max(0, Math.min(2, options.pitch))
      }

      if (options?.voice) {
        const voices = this.synthesis.getVoices()
        const selectedVoice = voices.find(voice => 
          voice.name === options.voice || voice.lang.includes(options.voice)
        )
        if (selectedVoice) {
          utterance.voice = selectedVoice
        }
      }

      utterance.onend = () => {
        this.currentUtterance = null
        resolve('Speech synthesis completed')
      }

      utterance.onerror = (event) => {
        this.currentUtterance = null
        reject(new Error(`Speech synthesis error: ${event.error}`))
      }

      this.currentUtterance = utterance
      this.synthesis.speak(utterance)
    })
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices()
      
      if (voices.length > 0) {
        resolve(voices)
      } else {
        // Wait for voices to load
        this.synthesis.onvoiceschanged = () => {
          voices = this.synthesis.getVoices()
          resolve(voices)
        }
      }
    })
  }

  pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause()
    }
  }

  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume()
    }
  }

  stop(): void {
    this.synthesis.cancel()
    this.currentUtterance = null
  }

  get isSupported(): boolean {
    return 'speechSynthesis' in window
  }

  get isSpeaking(): boolean {
    return this.synthesis.speaking
  }

  get isPaused(): boolean {
    return this.synthesis.paused
  }
}

export const ttsAdapter = new BrowserTTSAdapter()
export default ttsAdapter