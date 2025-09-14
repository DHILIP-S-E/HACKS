import type { STTAdapter } from '@/types'

class BrowserSTTAdapter implements STTAdapter {
  private recognition: SpeechRecognition | null = null
  private isRecording = false

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
    } else if ('SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
    }

    if (this.recognition) {
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = 'en-US'
    }
  }

  async startRecording(): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported')
    }

    if (this.isRecording) {
      throw new Error('Already recording')
    }

    return new Promise((resolve, reject) => {
      this.recognition!.onstart = () => {
        this.isRecording = true
        resolve()
      }

      this.recognition!.onerror = (event) => {
        this.isRecording = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition!.start()
    })
  }

  async stopRecording(): Promise<string> {
    if (!this.recognition || !this.isRecording) {
      throw new Error('Not currently recording')
    }

    return new Promise((resolve, reject) => {
      let finalTranscript = ''

      this.recognition!.onresult = (event) => {
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
      }

      this.recognition!.onend = () => {
        this.isRecording = false
        resolve(finalTranscript.trim())
      }

      this.recognition!.onerror = (event) => {
        this.isRecording = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition!.stop()
    })
  }

  isSupported(): boolean {
    return this.recognition !== null
  }

  get recording(): boolean {
    return this.isRecording
  }

  setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang
    }
  }

  setContinuous(continuous: boolean): void {
    if (this.recognition) {
      this.recognition.continuous = continuous
    }
  }

  setInterimResults(interim: boolean): void {
    if (this.recognition) {
      this.recognition.interimResults = interim
    }
  }
}

export const sttAdapter = new BrowserSTTAdapter()
export default sttAdapter