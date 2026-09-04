import { LocationData } from './weather';

export type SupportedLanguage = 
  | 'en' // English
  | 'hi' // Hindi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'gu' // Gujarati
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'or' // Odia
  | 'pa'; // Punjabi

export type UserPersona = 'commuter' | 'farmer' | 'traveler' | 'student' | 'emergency_worker';

export interface UserPreferences {
  name: string;
  email: string;
  preferredLanguage: SupportedLanguage;
  persona: UserPersona;
  savedLocations: LocationData[];
  quietHours: {
    enabled: boolean;
    startTime: string; // e.g. "22:00"
    endTime: string;   // e.g. "06:00"
  };
  alertSensitivity: 'all' | 'moderate_and_above' | 'high_and_above' | 'official_only';
  notificationCategories: {
    rain: boolean;
    heat: boolean;
    storm: boolean;
    cyclone: boolean;
    flood: boolean;
    officialIMD: boolean;
  };
  temperatureUnit: 'C' | 'F';
  windSpeedUnit: 'kmh' | 'mph' | 'ms';
  geminiApiKey?: string;
}
