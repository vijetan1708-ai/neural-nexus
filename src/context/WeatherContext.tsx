import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CurrentWeather, DailyForecast, HourlyForecast, LocationData } from '../types/weather';
import { WeatherRiskAssessment, OutdoorActivityAssessment } from '../types/risk';
import { DEFAULT_LOCATION, LocationService } from '../services/locationService';
import { WeatherService } from '../services/weatherService';
import { RiskEngine } from '../services/riskEngine';
import { AlertService } from '../services/alertService';
import { StorageService } from '../services/storageService';
import { useDemo } from './DemoContext';
import { useAlert } from './AlertContext';

interface WeatherContextType {
  location: LocationData;
  currentWeather: CurrentWeather;
  hourlyForecast: HourlyForecast[];
  dailyForecast: DailyForecast[];
  riskAssessment: WeatherRiskAssessment;
  outdoorAssessment: OutdoorActivityAssessment;
  isLoading: boolean;
  isOffline: boolean;
  lastUpdated: string;
  error: string | null;
  changeLocation: (newLoc: LocationData) => Promise<void>;
  detectGPSLocation: () => Promise<void>;
  refreshWeather: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDemoActive, activeScenario } = useDemo();
  const { setAlerts, addNotification } = useAlert();

  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>(() => WeatherService.generateFallbackWeather(13.0827, 80.2707).current);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>(() => WeatherService.generateFallbackWeather(13.0827, 80.2707).hourly);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>(() => WeatherService.generateFallbackWeather(13.0827, 80.2707).daily);
  const [riskAssessment, setRiskAssessment] = useState<WeatherRiskAssessment>(() => RiskEngine.calculateRiskScore(currentWeather));
  const [outdoorAssessment, setOutdoorAssessment] = useState<OutdoorActivityAssessment>(() => RiskEngine.calculateOutdoorActivityScore(currentWeather, riskAssessment));
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [error, setError] = useState<string | null>(null);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch real weather for coordinates
  const loadWeatherForLocation = useCallback(async (targetLoc: LocationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await WeatherService.fetchWeather(targetLoc.latitude, targetLoc.longitude);
      const computedRisk = RiskEngine.calculateRiskScore(response.current);
      const computedOutdoor = RiskEngine.calculateOutdoorActivityScore(response.current, computedRisk);
      const generatedAlerts = AlertService.getAlertsForWeather(targetLoc.city, response.current, computedRisk);

      setCurrentWeather(response.current);
      setHourlyForecast(response.hourly);
      setDailyForecast(response.daily);
      setRiskAssessment(computedRisk);
      setOutdoorAssessment(computedOutdoor);
      setAlerts(generatedAlerts);
      setLastUpdated(response.current.lastUpdated);

      // Check proactive early-warning delta
      const deltaNotice = AlertService.evaluateForecastDelta(response.current);
      if (deltaNotice) {
        addNotification(deltaNotice);
      }

      // Cache for offline resilience
      StorageService.cacheWeather({
        location: targetLoc,
        current: response.current,
        hourly: response.hourly,
        daily: response.daily,
        alerts: generatedAlerts,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.warn('Weather fetch encountered error, loading cached data:', err);
      const cached = StorageService.getCachedWeather();
      if (cached) {
        setCurrentWeather(cached.current);
        setHourlyForecast(cached.hourly);
        setDailyForecast(cached.daily);
        setAlerts(cached.alerts);
        const r = RiskEngine.calculateRiskScore(cached.current, cached.alerts);
        setRiskAssessment(r);
        setOutdoorAssessment(RiskEngine.calculateOutdoorActivityScore(cached.current, r));
      }
      setError('Unable to reach live weather satellite. Showing latest cached telemetry.');
    } finally {
      setIsLoading(false);
    }
  }, [setAlerts, addNotification]);

  // Handle Demo Mode overrides
  useEffect(() => {
    if (isDemoActive) {
      setCurrentWeather(activeScenario.mockWeather);
      setHourlyForecast(activeScenario.mockHourly);
      setDailyForecast(activeScenario.mockDaily);
      setAlerts(activeScenario.mockAlerts);
      setRiskAssessment(activeScenario.mockRisk);
      setOutdoorAssessment(RiskEngine.calculateOutdoorActivityScore(activeScenario.mockWeather, activeScenario.mockRisk));
      setLastUpdated('Simulation Active');

      // Update location representation for scenario
      const match = LocationService.searchLocations(activeScenario.locationName.split(',')[0])[0];
      if (match) {
        setLocation(match);
      }
    } else {
      loadWeatherForLocation(location);
    }
  }, [isDemoActive, activeScenario, loadWeatherForLocation, location, setAlerts]);

  const changeLocation = async (newLoc: LocationData) => {
    setLocation(newLoc);
    await loadWeatherForLocation(newLoc);
  };

  const detectGPSLocation = async () => {
    setIsLoading(true);
    try {
      const gpsLoc = await LocationService.getCurrentGPSLocation();
      setLocation(gpsLoc);
      await loadWeatherForLocation(gpsLoc);
    } catch (err: any) {
      setError(err.message || 'GPS location acquisition failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshWeather = async () => {
    await loadWeatherForLocation(location);
  };

  return (
    <WeatherContext.Provider value={{
      location,
      currentWeather,
      hourlyForecast,
      dailyForecast,
      riskAssessment,
      outdoorAssessment,
      isLoading,
      isOffline,
      lastUpdated,
      error,
      changeLocation,
      detectGPSLocation,
      refreshWeather
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
