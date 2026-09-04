import React, { useState } from 'react';
import { 
  Calendar, 
  Droplets, 
  Wind, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  X, 
  Sunrise, 
  Sunset,
  ShieldCheck
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';
import { DailyForecast } from '../../types/weather';

export const WeeklyForecast: React.FC = () => {
  const { dailyForecast } = useWeather();
  const { t } = useLanguage();
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);

  const getConditionIcon = (code: number) => {
    if (code >= 95) return <CloudLightning className="w-5 h-5 text-amber-400" />;
    if (code >= 60) return <CloudRain className="w-5 h-5 text-cyan-400" />;
    if (code >= 3) return <Cloud className="w-5 h-5 text-slate-400" />;
    return <Sun className="w-5 h-5 text-amber-400" />;
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'extreme': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t.dashboard.sevenDayForecastTitle}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          Click any day for details
        </span>
      </div>

      <div className="space-y-2">
        {dailyForecast.map((day, idx) => (
          <div
            key={`${day.date}-${idx}`}
            onClick={() => setSelectedDay(day)}
            className="p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all group"
          >
            {/* Day name & date */}
            <div className="w-24 shrink-0">
              <span className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors block">
                {day.dayName}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {day.date}
              </span>
            </div>

            {/* Condition Icon & Label */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="shrink-0">{getConditionIcon(day.conditionCode)}</div>
              <span className="text-xs text-slate-300 truncate hidden sm:inline">
                {day.condition}
              </span>
            </div>

            {/* Rain Probability */}
            <div className="flex items-center gap-1 text-xs text-cyan-300 font-mono w-16 shrink-0 justify-end">
              <Droplets className="w-3 h-3 text-cyan-400" />
              <span>{day.rainProbability}%</span>
            </div>

            {/* Min / Max Temperature Bar */}
            <div className="flex items-center gap-2 font-mono text-xs w-28 shrink-0 justify-end">
              <span className="text-slate-400">{day.minTemp}°</span>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full"
                  style={{ width: `${Math.min(100, (day.maxTemp / 45) * 100)}%` }}
                />
              </div>
              <span className="text-white font-bold">{day.maxTemp}°C</span>
            </div>

            {/* Risk Badge */}
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border hidden md:inline shrink-0 ${getRiskBadge(day.riskLevel)}`}>
              {day.riskLevel}
            </span>
          </div>
        ))}
      </div>

      {/* Selected Day Details Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedDay.dayName} Details
                  <span className={`px-2 py-0.2 rounded text-[10px] uppercase font-bold border ${getRiskBadge(selectedDay.riskLevel)}`}>
                    {selectedDay.riskLevel} Risk
                  </span>
                </h4>
                <p className="text-xs text-slate-400">{selectedDay.date} • {selectedDay.condition}</p>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Max / Min Temp</span>
                <span className="font-mono font-bold text-white text-sm">{selectedDay.maxTemp}°C / {selectedDay.minTemp}°C</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Rain Probability</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{selectedDay.rainProbability}% ({selectedDay.precipitationSum} mm)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Wind Max Speed</span>
                <span className="font-mono font-bold text-white text-sm">{selectedDay.windSpeed} km/h</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Max UV Index</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{selectedDay.uvMax}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Sunrise className="w-4 h-4" />
                <span>Rise: {selectedDay.sunrise}</span>
              </div>
              <div className="flex items-center gap-1.5 text-orange-400">
                <Sunset className="w-4 h-4" />
                <span>Set: {selectedDay.sunset}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedDay(null)}
              className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
