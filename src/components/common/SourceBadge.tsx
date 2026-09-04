import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Database, AlertTriangle, Radio, Info } from 'lucide-react';
import { AlertSourceType } from '../../types/alerts';
import { useLanguage } from '../../context/LanguageContext';

interface SourceBadgeProps {
  sourceType: AlertSourceType | 'weather_api' | 'historical';
  customLabel?: string;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceType, customLabel, className = '' }) => {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(false);

  const getDetails = () => {
    switch (sourceType) {
      case 'official_imd':
        return {
          label: customLabel || t.sources.officialIMD,
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
          description: 'Official meteorological bulletin issued by India Meteorological Department (IMD) or State Disaster Management Authority. Authoritative government warning.'
        };
      case 'ai_prediction':
        return {
          label: customLabel || t.sources.aiPrediction,
          bg: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400',
          icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />,
          description: 'Synthesized by WeatherGPT Predictive AI models analyzing real-time Doppler radar & numerical weather data. Not an official government warning.'
        };
      case 'demo_simulated':
        return {
          label: customLabel || t.sources.demoData,
          bg: 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
          description: '⚠️ DEMO / SIMULATED DATA FOR SMART INDIA HACKATHON. Created to demonstrate crisis workflows safely.'
        };
      case 'weather_api':
        return {
          label: customLabel || t.sources.weatherAPI,
          bg: 'bg-blue-500/15 border-blue-500/40 text-blue-400',
          icon: <Radio className="w-3.5 h-3.5 text-blue-400 shrink-0" />,
          description: 'Direct atmospheric telemetry from numerical meteorological observational stations.'
        };
      case 'historical':
        return {
          label: customLabel || t.sources.historicalData,
          bg: 'bg-purple-500/15 border-purple-500/40 text-purple-400',
          icon: <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />,
          description: 'Verified historical weather observation logs and precipitation records.'
        };
    }
  };

  const details = getDetails();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <span
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm transition-all hover:scale-105 ${details.bg}`}
      >
        {details.icon}
        <span>{details.label}</span>
        <Info className="w-2.5 h-2.5 opacity-60" />
      </span>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-64 p-2.5 text-xs text-slate-200 bg-slate-900/95 border border-slate-700 rounded-lg shadow-xl backdrop-blur-md pointer-events-none">
          <p className="font-semibold text-white mb-1 flex items-center gap-1">
            {details.icon} {details.label}
          </p>
          <p className="text-slate-300 text-[11px] leading-relaxed">{details.description}</p>
        </div>
      )}
    </div>
  );
};
