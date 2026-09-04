import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, Globe, Radio } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SpeechService } from '../../services/speechService';
import { SupportedLanguage } from '../../types/user';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitTranscript: (transcript: string) => void;
  isProcessing: boolean;
  lastResponseText?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onSubmitTranscript,
  isProcessing,
  lastResponseText
}) => {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState<number[]>([40, 60, 30, 80, 50, 70, 45]);

  const animationRef = useRef<number | null>(null);

  // Audio wave animation effect when listening
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setVolumeLevel(Array.from({ length: 7 }, () => Math.floor(Math.random() * 70) + 20));
      }, 150);
      return () => clearInterval(interval);
    } else {
      setVolumeLevel([25, 25, 25, 25, 25, 25, 25]);
    }
  }, [isListening]);

  // Read response aloud when available
  useEffect(() => {
    if (lastResponseText && isOpen) {
      setIsSpeaking(true);
      SpeechService.speak(lastResponseText, language, () => {
        setIsSpeaking(false);
      });
    }
  }, [lastResponseText, isOpen, language]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setVoiceError(null);
    setTranscript('');
    SpeechService.stopSpeaking();
    setIsSpeaking(false);

    const started = SpeechService.startListening(
      language,
      (text) => {
        setTranscript(text);
      },
      (err) => {
        setVoiceError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const handleStopListening = () => {
    SpeechService.stopListening();
    setIsListening(false);
    if (transcript.trim()) {
      onSubmitTranscript(transcript);
    }
  };

  const handleClose = () => {
    SpeechService.stopListening();
    SpeechService.stopSpeaking();
    setIsListening(false);
    setIsSpeaking(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 p-6 sm:p-8 shadow-2xl text-center space-y-6">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WeatherGPT Siri-like Voice Assistant</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">
            {isListening ? t.weathergpt.listening : (isProcessing ? 'AI Analyzing Telemetry...' : 'Tap Mic to Speak')}
          </h3>
          <p className="text-xs text-slate-400">
            Ask natural questions in <strong className="text-white">{supportedLanguages.find(l => l.code === language)?.name}</strong> or English
          </p>
        </div>

        {/* Animated Siri Wave Visualizer */}
        <div className="flex items-center justify-center gap-1.5 h-20 my-4">
          {volumeLevel.map((height, idx) => (
            <div
              key={idx}
              className={`w-2 rounded-full transition-all duration-150 ${
                isListening
                  ? 'bg-gradient-to-t from-brand-500 via-cyan-400 to-purple-400'
                  : (isSpeaking ? 'bg-gradient-to-t from-emerald-500 to-teal-400' : 'bg-slate-800')
              }`}
              style={{ height: `${height}px` }}
            />
          ))}
        </div>

        {/* Dynamic Transcription Box */}
        <div className="min-h-[70px] p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-200 text-sm flex items-center justify-center">
          {transcript ? (
            <p className="font-medium text-white italic leading-relaxed">
              "{transcript}"
            </p>
          ) : (
            <p className="text-slate-400 text-xs italic">
              {language === 'ta' 
                ? 'எடுத்துக்காட்டு: "இன்று மாலை மழை பெய்யுமா?", "குடை எடுத்துச் செல்ல வேண்டுமா?"' 
                : (language === 'hi' 
                  ? 'उदाहरण: "क्या आज बारिश होगी?", "क्या छाता ले जाना चाहिए?"' 
                  : 'Try: "Will it rain in Chennai tonight?", "Should I carry an umbrella?"')}
            </p>
          )}
        </div>

        {voiceError && (
          <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">
            {voiceError}
          </p>
        )}

        {/* Central Microphone Button */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            disabled={isProcessing}
            className={`relative p-6 rounded-full shadow-2xl transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-8 ring-red-500/30'
                : 'bg-gradient-to-tr from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white shadow-brand-500/30 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Voice & Language Selection Bar */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-semibold focus:outline-none"
            >
              {supportedLanguages.map(l => (
                <option key={l.code} value={l.code}>{l.name} ({l.englishName})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            {isSpeaking ? (
              <button
                onClick={() => {
                  SpeechService.stopSpeaking();
                  setIsSpeaking(false);
                }}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Stop Audio</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Audio ready</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
