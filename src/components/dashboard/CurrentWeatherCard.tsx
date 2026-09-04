import React from 'react';
import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplets, 
  Thermometer, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';

export const CurrentWeatherCard: React.FC = () => {
  const { currentWeather, dailyForecast } = useWeather();
  const { t } = useLanguage();

  const today = dailyForecast[0];

  const getWeatherIcon = (code: number, isDay: boolean) => {
    if (code >= 95) return <CloudLightning className="w-16 h-16 text-amber-400 animate-pulse" />;
    if (code >= 60) return <CloudRain className="w-16 h-16 text-cyan-400 animate-bounce-subtle" />;
    if (code >= 50) return <CloudRain className="w-16 h-16 text-blue-400" />;
    if (code >= 3) return <Cloud className="w-16 h-16 text-slate-300" />;
    if (code >= 1) return <CloudSun className="w-16 h-16 text-amber-300" />;
    return isDay ? (
      <Sun className="w-16 h-16 text-amber-400 animate-spin-slow" />
    ) : (
      <CloudSun className="w-16 h-16 text-cyan-200" />
    );
  };

  const getCardGradient = () => {
    if (currentWeather.conditionCode >= 95) return 'from-slate-900 via-purple-950/70 to-slate-900 border-purple-500/40';
    if (currentWeather.conditionCode >= 60) return 'from-slate-900 via-blue-950/70 to-slate-900 border-blue-500/40';
    if (currentWeather.temperature >= 38) return 'from-slate-900 via-amber-950/70 to-slate-900 border-amber-500/40';
    return 'from-slate-900 via-brand-950/50 to-slate-900 border-slate-800';
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${getCardGradient()} border shadow-xl`}>
      {/* Subtle background glow */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        
        {/* Main Temperature & Condition */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-white font-mono">
              {currentWeather.temperature}°<span className="text-3xl font-sans font-normal text-slate-400">C</span>
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-white/10 text-white border border-white/15 backdrop-blur-md">
              {t.dashboard.feelsLike} {currentWeather.feelsLike}°C
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <span>{currentWeather.condition}</span>
            {currentWeather.precipitation > 0 && (
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-500/30">
                {currentWeather.precipitation} mm/h
              </span>
            )}
          </h2>

          {today && (
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-0.5 text-rose-400 font-mono">
                <ArrowUp className="w-3 h-3" /> H: {today.maxTemp}°C
              </span>
              <span className="flex items-center gap-0.5 text-cyan-400 font-mono">
                <ArrowDown className="w-3 h-3" /> L: {today.minTemp}°C
              </span>
            </div>
          )}
        </div>

        {/* Animated Weather Graphic & Quick Summary */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
            {getWeatherIcon(currentWeather.conditionCode, currentWeather.isDay)}
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-300 bg-cyan-500/10 px-2.5 py-1 rounded-xl border border-cyan-500/20">
              <Droplets className="w-3.5 h-3.5" />
              <span>Rain: <strong>{currentWeather.rainProbability}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-300 bg-brand-500/10 px-2.5 py-1 rounded-xl border border-brand-500/20">
              <Wind className="w-3.5 h-3.5" />
              <span>Wind: <strong>{currentWeather.windSpeed} km/h</strong></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
