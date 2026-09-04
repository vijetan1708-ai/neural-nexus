export interface LocationData {
  city: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  isGPS: boolean;
  pincode?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: string;
  conditionCode: number;
  humidity: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windGust?: number;
  pressure: number; // hPa
  uvIndex: number;
  visibility: number; // km
  cloudCover: number; // %
  rainProbability: number; // %
  precipitation: number; // mm
  dewPoint?: number;
  sunrise: string;
  sunset: string;
  isDay: boolean;
  airQualityIndex?: number;
  lastUpdated: string;
  dataSource: string;
}

export interface HourlyForecast {
  time: string;
  hourStr: string;
  temperature: number;
  condition: string;
  conditionCode: number;
  rainProbability: number;
  windSpeed: number;
  humidity: number;
  isDay: boolean;
  uvIndex: number;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  dayNameShort: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  conditionCode: number;
  rainProbability: number;
  precipitationSum: number;
  windSpeed: number;
  humidity: number;
  uvMax: number;
  sunrise: string;
  sunset: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  riskScore: number;
}

export interface HistoricalWeatherDay {
  date: string;
  dayLabel: string;
  maxTemp: number;
  minTemp: number;
  avgTemp: number;
  rainfall: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  riskScore: number;
  dominantCondition: string;
}
