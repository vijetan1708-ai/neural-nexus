import React from 'react';
import { WifiOff, Clock } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { isOffline, lastUpdated } = useWeather();
  const { t } = useLanguage();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600/90 text-slate-950 font-semibold px-4 py-2 text-xs flex items-center justify-between border-b border-amber-500 shadow-md">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
        <WifiOff className="w-4 h-4 shrink-0 animate-bounce" />
        <span>
          {t.offline.banner}
        </span>
        <span className="flex items-center gap-1 font-mono text-[11px] bg-black/20 px-2 py-0.5 rounded ml-2">
          <Clock className="w-3 h-3" />
          {t.offline.cachedTime}: {lastUpdated}
        </span>
      </div>
    </div>
  );
};
