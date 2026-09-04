import { SupportedLanguage } from '../types/user';

// Extend window for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export class SpeechService {
  private static recognition: any = null;
  private static isListening: boolean = false;

  /**
   * Check if speech recognition is available in current browser
   */
  static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  /**
   * Check if speech synthesis is available
   */
  static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Map language to appropriate BCP-47 tag for Indian speech models
   */
  static getBCP47Tag(lang: SupportedLanguage): string {
    switch (lang) {
      case 'ta': return 'ta-IN';
      case 'hi': return 'hi-IN';
      case 'te': return 'te-IN';
      case 'bn': return 'bn-IN';
      case 'mr': return 'mr-IN';
      case 'gu': return 'gu-IN';
      case 'kn': return 'kn-IN';
      case 'ml': return 'ml-IN';
      case 'or': return 'or-IN';
      case 'pa': return 'pa-IN';
      case 'en':
      default: return 'en-IN';
    }
  }

  /**
   * Start listening for voice input
   */
  static startListening(
    lang: SupportedLanguage,
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech Recognition is not supported by your browser. Please type your query.');
      return false;
    }

    try {
      this.stopListening();

      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognitionConstructor();
      this.recognition = recognition;

      recognition.lang = this.getBCP47Tag(lang);
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        this.isListening = true;
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          onError('No speech was detected. Please try speaking again.');
        } else if (event.error === 'audio-capture') {
          onError('No microphone was found or microphone was disabled.');
        } else if (event.error === 'not-allowed') {
          onError('Microphone access was denied. Please allow microphone permissions.');
        } else {
          onError(`Speech recognition error: ${event.error}`);
        }
        this.isListening = false;
      };

      recognition.onend = () => {
        this.isListening = false;
        onEnd();
      };

      recognition.start();
      return true;
    } catch (err: any) {
      onError(err.message || 'Failed to start speech recognition');
      return false;
    }
  }

  /**
   * Stop active listening
   */
  static stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore if already stopped
      }
      this.recognition = null;
    }
    this.isListening = false;
  }

  /**
   * Read aloud text using SpeechSynthesis with voice matching selected Indian language
   */
  static speak(text: string, lang: SupportedLanguage = 'en', onComplete?: () => void) {
    if (!this.isSpeechSynthesisSupported()) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = this.getBCP47Tag(lang);
      utterance.lang = targetLang;
      utterance.rate = 0.95; // Clear natural tempo
      utterance.pitch = 1.0;

      // Select voice if matching
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.startsWith(targetLang) || v.lang.startsWith(lang));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      if (onComplete) {
        utterance.onend = () => onComplete();
        utterance.onerror = () => onComplete();
      }

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis failed:', err);
      if (onComplete) onComplete();
    }
  }

  /**
   * Cancel ongoing speech synthesis
   */
  static stopSpeaking() {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}
