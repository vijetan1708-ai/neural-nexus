import React from 'react';
import { 
  Droplets, 
  Wind, 
  Compass, 
  Gauge, 
  Eye, 
  Sun, 
  Cloud, 
  Sunrise, 
  Sunset,
  CloudRain
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';

export const MetricGrid: React.FC = () => {
  const { currentWeather } = useWeather();
  const { t } = useLanguage();

  const getUVBadge = (uv: number) => {
    if (uv >= 11) return { text: 'Extreme', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' };
    if (uv >= 8) return { text: 'Very High', color: 'text-red-400 bg-red-500/15 border-red-500/30' };
    if (uv >= 6) return { text: 'High', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
    if (uv >= 3) return { text: 'Moderate', color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30' };
    return { text: 'Low', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
  };

  const uvBadge = getUVBadge(currentWeather.uvIndex);

  const getWindDirection = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const metrics = [
    {
      id: 'humidity',
      label: t.dashboard.humidity,
      value: `${currentWeather.humidity}%`,
      sub: currentWeather.humidity > 80 ? 'Very Humid' : (currentWeather.humidity > 50 ? 'Moderate' : 'Dry'),
      icon: Droplets,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    {
      id: 'wind',
      label: t.dashboard.windSpeed,
      value: `${currentWeather.windSpeed} km/h`,
      sub: `${getWindDirection(currentWeather.windDirection)} (${currentWeather.windDirection}°) ${currentWeather.windGust ? `• Gusts ${currentWeather.windGust}k` : ''}`,
      icon: Wind,
      color: 'text-brand-400',
      bg: 'bg-brand-500/10'
    },
    {
      id: 'rainProb',
      label: t.dashboard.rainProbability,
      value: `${currentWeather.rainProbability}%`,
      sub: currentWeather.precipitation > 0 ? `${currentWeather.precipitation} mm precipitation` : 'No active rain',
      icon: CloudRain,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      id: 'pressure',
      label: t.dashboard.pressure,
      value: `${currentWeather.pressure} hPa`,
      sub: currentWeather.pressure < 1000 ? 'Low Pressure Area' : 'Normal Atmosphere',
      icon: Gauge,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      id: 'uvIndex',
      label: t.dashboard.uvIndex,
      value: `${currentWeather.uvIndex}`,
      badge: uvBadge.text,
      badgeColor: uvBadge.color,
      icon: Sun,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    {
      id: 'visibility',
      label: t.dashboard.visibility,
      value: `${currentWeather.visibility} km`,
      sub: currentWeather.visibility < 3 ? 'Dense Fog / Obscured' : 'Clear View',
      icon: Eye,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      id: 'cloudCover',
      label: t.dashboard.cloudCover,
      value: `${currentWeather.cloudCover}%`,
      sub: currentWeather.cloudCover > 80 ? 'Heavy Overcast' : 'Scattered Clouds',
      icon: Cloud,
      color: 'text-slate-300',
      bg: 'bg-slate-500/10'
    },
    {
      id: 'sunTimes',
      label: `${t.dashboard.sunrise} & ${t.dashboard.sunset}`,
      value: `${currentWeather.sunrise}`,
      sub: `Sunset at ${currentWeather.sunset}`,
      icon: Sunrise,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div 
            key={m.id}
            className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-xs text-slate-400 font-medium truncate">{m.label}</span>
              <div className={`p-1.5 rounded-lg ${m.bg} ${m.color} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-white font-mono">{m.value}</span>
                {m.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                )}
              </div>
              {m.sub && (
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.sub}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
