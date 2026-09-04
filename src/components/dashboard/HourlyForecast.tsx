import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Bar,
  ComposedChart
} from 'recharts';
import { Clock, Droplets, Wind, Sun, Cloud, CloudRain, CloudLightning } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';

export const HourlyForecast: React.FC = () => {
  const { hourlyForecast } = useWeather();
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<'cards' | 'chart'>('cards');

  const chartData = hourlyForecast.map(h => ({
    hour: h.hourStr,
    temp: h.temperature,
    rainProb: h.rainProbability,
    humidity: h.humidity,
    wind: h.windSpeed
  }));

  const getConditionIcon = (code: number, isDay: boolean) => {
    if (code >= 95) return <CloudLightning className="w-5 h-5 text-amber-400" />;
    if (code >= 60) return <CloudRain className="w-5 h-5 text-cyan-400" />;
    if (code >= 3) return <Cloud className="w-5 h-5 text-slate-400" />;
    return isDay ? <Sun className="w-5 h-5 text-amber-400" /> : <Cloud className="w-5 h-5 text-cyan-200" />;
  };

  return (
    <div className="rounded-2xl p-4 sm:p-5 bg-slate-900/80 border border-slate-800 shadow-md">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {t.dashboard.hourlyForecastTitle}
          </h3>
        </div>

        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveView('cards')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeView === 'cards' ? 'bg-brand-500/20 text-brand-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setActiveView('chart')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              activeView === 'chart' ? 'bg-brand-500/20 text-brand-300 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Trend Graph
          </button>
        </div>
      </div>

      {activeView === 'cards' ? (
        /* Horizontal Scroll Cards */
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          {hourlyForecast.map((h, idx) => (
            <div
              key={`${h.time}-${idx}`}
              className="flex flex-col items-center justify-between min-w-[95px] p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 text-center transition-all shrink-0"
            >
              <span className="text-xs font-semibold text-slate-300 mb-2">
                {h.hourStr}
              </span>

              <div className="my-1">
                {getConditionIcon(h.conditionCode, h.isDay)}
              </div>

              <span className="text-base font-bold font-mono text-white mt-1">
                {h.temperature}°C
              </span>

              <div className="w-full mt-2 pt-2 border-t border-slate-800/70 space-y-1">
                <div className="flex items-center justify-center gap-1 text-[11px] text-cyan-300 font-mono">
                  <Droplets className="w-3 h-3 text-cyan-400" />
                  <span>{h.rainProbability}%</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-mono">
                  <Wind className="w-2.5 h-2.5 text-slate-500" />
                  <span>{h.windSpeed}k</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Recharts Interactive Dual Trend Chart */
        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stop-color="#0284c7" stopOpacity={0.4}/>
                  <stop offset="95%" stop-color="#0284c7" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis yAxisId="temp" stroke="#38bdf8" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} hide />
              <YAxis yAxisId="rain" stroke="#0ea5e9" fontSize={11} orientation="right" domain={[0, 100]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
              />
              <Area 
                yAxisId="temp"
                type="monotone" 
                dataKey="temp" 
                name="Temp (°C)" 
                stroke="#38bdf8" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#tempGradient)" 
              />
              <Bar 
                yAxisId="rain"
                dataKey="rainProb" 
                name="Rain Probability (%)" 
                fill="#38bdf8" 
                opacity={0.3}
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
