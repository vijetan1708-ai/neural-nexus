export interface WeatherGPTStructuredResponse {
  summary: string;
  confidence: 'High' | 'Medium' | 'Low';
  risk: 'Low' | 'Moderate' | 'High' | 'Extreme';
  recommendations: string[];
  location: string;
  validTime: string;
  source: string;
  hazardWarning?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  structuredData?: WeatherGPTStructuredResponse;
  timestamp: string;
  isVoice?: boolean;
}

export interface QuickPrompt {
  id: string;
  labelKey: string;
  defaultText: string;
  icon: string;
  query: string;
}
