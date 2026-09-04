import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  Volume2, 
  Info,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAlert } from '../../context/AlertContext';
import { ChatMessage } from '../../types/chat';
import { GeminiService } from '../../services/geminiService';
import { StorageService } from '../../services/storageService';
import { SpeechService } from '../../services/speechService';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import { SourceBadge } from '../common/SourceBadge';

interface WeatherGPTChatProps {
  initialQuery?: string;
  onClearInitialQuery?: () => void;
}

export const WeatherGPTChat: React.FC<WeatherGPTChatProps> = ({ initialQuery, onClearInitialQuery }) => {
  const { location, currentWeather, hourlyForecast, dailyForecast, riskAssessment } = useWeather();
  const { language, t } = useLanguage();
  const { alerts } = useAlert();

  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [lastSpeechResponse, setLastSpeechResponse] = useState<string | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialGreeting: ChatMessage = {
    id: 'welcome_msg',
    sender: 'assistant',
    text: `Hello! I am WeatherGPT, your AI weather prediction and disaster intelligence assistant. Ask me questions about rain probability, travel safety, storm risks, or farming advice in ${location.city}.`,
    timestamp: 'Just Now',
    structuredData: {
      summary: `Currently in ${location.city}: ${currentWeather.temperature}°C with ${currentWeather.condition.toLowerCase()}. Rain probability is ${currentWeather.rainProbability}%.`,
      confidence: 'High',
      risk: riskAssessment.level === 'extreme' ? 'Extreme' : (riskAssessment.level === 'high' ? 'High' : (riskAssessment.level === 'moderate' ? 'Moderate' : 'Low')),
      recommendations: [
        `Atmospheric risk score is assessed at ${riskAssessment.score}/100.`,
        currentWeather.rainProbability > 50 ? 'Rain showers likely; umbrella recommended.' : 'Normal outdoor activities safe.',
        'Official meteorological alerts are prioritized automatically.'
      ],
      location: `${location.city}, ${location.state}`,
      validTime: 'Current Window',
      source: 'Open-Meteo Observations + WeatherGPT Grounded Model'
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  // Handle external query trigger (e.g. from quick chips)
  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSendMessage = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsGenerating(true);

    try {
      const prefs = StorageService.getUserPreferences();
      const structured = await GeminiService.askWeatherGPT(
        text,
        currentWeather,
        hourlyForecast,
        dailyForecast,
        alerts,
        riskAssessment,
        location.city,
        language,
        prefs.geminiApiKey
      );

      const aiMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: structured.summary,
        structuredData: structured,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setLastSpeechResponse(structured.summary);
    } catch (err) {
      console.warn('WeatherGPT generation error:', err);
      const fallbackMsg: ChatMessage = {
        id: `assistant_err_${Date.now()}`,
        sender: 'assistant',
        text: `Unable to synthesize weather response right now. Current temperature in ${location.city} is ${currentWeather.temperature}°C with ${currentWeather.condition}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    setMessages([initialGreeting]);
  };

  const handleSpeakMessage = (text: string) => {
    SpeechService.speak(text, language);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Top Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-md shadow-brand-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">WeatherGPT Assistant</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Grounded AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Strictly grounded on verified meteorological observations and IMD official alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <Mic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </button>

          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'user' ? (
              /* User Bubble */
              <div className="max-w-lg bg-brand-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-md text-xs sm:text-sm">
                <p className="leading-relaxed">{msg.text}</p>
                <span className="text-[10px] text-brand-200 block text-right mt-1 font-mono">
                  {msg.timestamp}
                </span>
              </div>
            ) : (
              /* WeatherGPT Structured Response */
              <div className="max-w-2xl w-full bg-slate-950/80 border border-slate-800 p-4 sm:p-5 rounded-2xl rounded-tl-sm shadow-lg space-y-3">
                
                {/* Header with Risk & Confidence */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-xs text-white">WeatherGPT Analysis</span>
                  </div>

                  {msg.structuredData && (
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        msg.structuredData.risk === 'Extreme' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                        msg.structuredData.risk === 'High' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
                        msg.structuredData.risk === 'Moderate' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        Risk: {msg.structuredData.risk}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-700">
                        {msg.structuredData.confidence} Confidence
                      </span>
                    </div>
                  )}
                </div>

                {/* Urgent Hazard Warning If Any */}
                {msg.structuredData?.hazardWarning && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{msg.structuredData.hazardWarning}</span>
                  </div>
                )}

                {/* Weather Summary */}
                <div className="text-slate-100 text-xs sm:text-sm font-medium leading-relaxed">
                  {msg.structuredData?.summary || msg.text}
                </div>

                {/* Actionable Recommendations */}
                {msg.structuredData?.recommendations && msg.structuredData.recommendations.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
                    <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider text-cyan-400">
                      💡 Actionable Precautions:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {msg.structuredData.recommendations.map((rec, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Meta Bar: Location, Valid Window, Source Badge, Speak Audio */}
                {msg.structuredData && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {msg.structuredData.location}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {msg.structuredData.validTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 truncate max-w-[200px]">
                        {msg.structuredData.source}
                      </span>
                      <button
                        onClick={() => handleSpeakMessage(msg.structuredData?.summary || msg.text)}
                        title="Read aloud response"
                        className="p-1 rounded-md hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="text-xs text-slate-300">WeatherGPT is evaluating numerical radar models & alerts...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => setIsVoiceModalOpen(true)}
            title="Voice Input"
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-700/80 transition-all shrink-0"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={t.weathergpt.askPlaceholder}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/50"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isGenerating}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-brand-600/20 transition-all shrink-0"
          >
            <span>{t.weathergpt.sendButton}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSubmitTranscript={(transcript) => {
          setIsVoiceModalOpen(false);
          handleSendMessage(transcript);
        }}
        isProcessing={isGenerating}
        lastResponseText={lastSpeechResponse}
      />

    </div>
  );
};
