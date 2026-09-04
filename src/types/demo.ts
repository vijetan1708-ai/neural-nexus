import { CurrentWeather, DailyForecast, HourlyForecast } from './weather';
import { WeatherAlert } from './alerts';
import { WeatherRiskAssessment } from './risk';

export type DemoScenarioId = 
  | 'normal' 
  | 'heavy_rain' 
  | 'flood' 
  | 'cyclone' 
  | 'heatwave' 
  | 'thunderstorm';

export interface DemoScenario {
  id: DemoScenarioId;
  name: string;
  nameHindi: string;
  nameTamil: string;
  badge: string;
  locationName: string;
  description: string;
  riskScore: number;
  mockWeather: CurrentWeather;
  mockHourly: HourlyForecast[];
  mockDaily: DailyForecast[];
  mockAlerts: WeatherAlert[];
  mockRisk: WeatherRiskAssessment;
}
