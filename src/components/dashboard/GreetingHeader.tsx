import React from 'react';
import { MapPin, Clock, ShieldCheck, Crosshair } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';
import { SourceBadge } from '../common/SourceBadge';

export const GreetingHeader: React.FC = () => {
  const { location, lastUpdated, currentWeather } = useWeather();
  const { t } = useLanguage();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.greetingMorning;
    if (hour < 17) return t.dashboard.greetingAfternoon;
    if (hour < 21) return t.dashboard.greetingEvening;
    return t.dashboard.greetingNight;
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>{getGreeting()}!</span>
          <span className="text-slate-400 font-normal text-base hidden sm:inline">
            {t.dashboard.weatherIn} <strong className="text-white font-semibold">{location.city}</strong>
          </span>
        </h1>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span className="font-semibold text-slate-200">{location.district || location.city}</span>, 
            <span>{location.state}, India</span>
          </div>

          <span className="text-slate-600">•</span>

          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
            <Crosshair className="w-3 h-3 text-cyan-400" />
            <span>{location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E</span>
            {location.isGPS && (
              <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.2 rounded font-sans font-medium">
                GPS ±{location.accuracyMeters || 12}m
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap">
        <SourceBadge 
          sourceType={currentWeather.dataSource.includes('Simulated') ? 'demo_simulated' : 'weather_api'} 
          customLabel={currentWeather.dataSource.includes('Simulated') ? 'Simulated Telemetry' : 'Live Numerical Data'} 
        />
        
        <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Updated: <strong className="text-slate-200 font-mono">{lastUpdated}</strong></span>
        </div>
      </div>
    </div>
  );
};
