import { LocationData, CurrentWeather, DailyForecast, HourlyForecast } from '../types/weather';
import { UserPreferences } from '../types/user';
import { WeatherAlert } from '../types/alerts';
import { DEFAULT_LOCATION } from './locationService';

export interface CachedWeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  alerts: WeatherAlert[];
  timestamp: number;
}

export class StorageService {
  private static WEATHER_CACHE_KEY = 'weathergpt_cache_weather_v1';
  private static USER_PREFS_KEY = 'weathergpt_user_prefs_v1';

  /**
   * Save current weather to cache for offline resilience
   */
  static cacheWeather(data: CachedWeatherData) {
    try {
      localStorage.setItem(this.WEATHER_CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to cache weather data:', e);
    }
  }

  /**
   * Retrieve cached weather
   */
  static getCachedWeather(): CachedWeatherData | null {
    try {
      const raw = localStorage.getItem(this.WEATHER_CACHE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // Ignore
    }
    return null;
  }

  /**
   * Default user preferences
   */
  static getDefaultPreferences(): UserPreferences {
    return {
      name: 'Vijeta',
      email: 'user@sih2026.gov.in',
      preferredLanguage: 'en',
      persona: 'commuter',
      savedLocations: [
        DEFAULT_LOCATION,
        {
          city: 'Coimbatore',
          district: 'Coimbatore',
          state: 'Tamil Nadu',
          country: 'India',
          latitude: 11.0168,
          longitude: 76.9558,
          isGPS: false,
          pincode: '641001'
        },
        {
          city: 'Madurai',
          district: 'Madurai',
          state: 'Tamil Nadu',
          country: 'India',
          latitude: 9.9252,
          longitude: 78.1198,
          isGPS: false,
          pincode: '625001'
        }
      ],
      quietHours: {
        enabled: true,
        startTime: '22:30',
        endTime: '06:00'
      },
      alertSensitivity: 'moderate_and_above',
      notificationCategories: {
        rain: true,
        heat: true,
        storm: true,
        cyclone: true,
        flood: true,
        officialIMD: true
      },
      temperatureUnit: 'C',
      windSpeedUnit: 'kmh'
    };
  }

  /**
   * Get user preferences
   */
  static getUserPreferences(): UserPreferences {
    try {
      const raw = localStorage.getItem(this.USER_PREFS_KEY);
      if (raw) {
        return { ...this.getDefaultPreferences(), ...JSON.parse(raw) };
      }
    } catch {
      // Ignore
    }
    return this.getDefaultPreferences();
  }

  /**
   * Save user preferences
   */
  static saveUserPreferences(prefs: UserPreferences) {
    try {
      localStorage.setItem(this.USER_PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save user preferences:', e);
    }
  }
}
