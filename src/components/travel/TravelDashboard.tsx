import React, { useState } from 'react';
import { 
  Plane, 
  Car, 
  Train, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Umbrella, 
  Sun, 
  Wind, 
  Droplets,
  Eye
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';
import { INDIAN_DISTRICTS } from '../../services/locationService';

export const TravelDashboard: React.FC = () => {
  const { location, currentWeather, riskAssessment } = useWeather();
  const { t } = useLanguage();

  const [origin, setOrigin] = useState(location.city);
  const [destination, setDestination] = useState('Bengaluru');
  const [travelMode, setTravelMode] = useState<'road' | 'train' | 'flight'>('road');

  const destDistrict = INDIAN_DISTRICTS.find(d => d.city === destination) || INDIAN_DISTRICTS[10];

  const travelRiskScore = Math.min(100, Math.round(riskAssessment.score * 0.85 + (currentWeather.rainProbability > 60 ? 15 : 0)));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <Plane className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {t.travel.title}
            </h1>
            <p className="text-xs text-slate-300">
              {t.travel.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Origin & Destination Selector Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Origin */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.travel.origin}
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-400"
            >
              {INDIAN_DISTRICTS.map((d) => (
                <option key={d.city} value={d.city}>{d.city}, {d.state}</option>
              ))}
            </select>
          </div>

          {/* Travel Mode Toggle */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Transit Mode
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTravelMode('road')}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${travelMode === 'road' ? 'bg-brand-500/20 text-brand-300 font-bold' : 'text-slate-400'}`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>Road</span>
              </button>
              <button
                onClick={() => setTravelMode('train')}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${travelMode === 'train' ? 'bg-brand-500/20 text-brand-300 font-bold' : 'text-slate-400'}`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>Train</span>
              </button>
              <button
                onClick={() => setTravelMode('flight')}
                className={`py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 ${travelMode === 'flight' ? 'bg-brand-500/20 text-brand-300 font-bold' : 'text-slate-400'}`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Flight</span>
              </button>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.travel.destination}
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-brand-400"
            >
              {INDIAN_DISTRICTS.map((d) => (
                <option key={d.city} value={d.city}>{d.city}, {d.state}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Comparison & Route Risk Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Departure Weather */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Departure Weather ({origin})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">{currentWeather.temperature}°C</span>
            <span className="text-xs text-slate-300">{currentWeather.condition}</span>
          </div>
          <div className="space-y-1 text-xs text-slate-400">
            <p className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rain Chance: <strong className="text-slate-200">{currentWeather.rainProbability}%</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <Wind className="w-3.5 h-3.5 text-brand-400" />
              <span>Winds: <strong className="text-slate-200">{currentWeather.windSpeed} km/h</strong></span>
            </p>
          </div>
        </div>

        {/* Route Risk Score */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-center flex flex-col justify-center items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {t.travel.travelRisk}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-cyan-400">
              {travelRiskScore}
            </span>
            <span className="text-slate-500 font-mono text-xs">/100</span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${travelRiskScore > 60 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
            {travelRiskScore > 60 ? 'Caution Advised' : 'Low Travel Risk'}
          </span>
          <p className="text-[11px] text-slate-300">
            {travelRiskScore > 60 ? t.travel.cautionAdvised : t.travel.safeTravelConditions}
          </p>
        </div>

        {/* Arrival Weather */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Arrival Weather ({destination})
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono">28°C</span>
            <span className="text-xs text-slate-300">Partly Cloudy</span>
          </div>
          <div className="space-y-1 text-xs text-slate-400">
            <p className="flex items-center gap-2">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rain Chance: <strong className="text-slate-200">25%</strong></span>
            </p>
            <p className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>Visibility: <strong className="text-slate-200">10 km (Clear)</strong></span>
            </p>
          </div>
        </div>

      </div>

      {/* Recommended Travel Gear */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          {t.travel.recommendedGear}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${currentWeather.rainProbability > 40 ? 'bg-blue-950/40 border-blue-500/40 text-blue-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <Umbrella className="w-4 h-4" />
            <span>Carry Umbrella</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${currentWeather.uvIndex > 6 ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <Sun className="w-4 h-4" />
            <span>UV Sunglasses</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${currentWeather.windSpeed > 35 ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <Wind className="w-4 h-4" />
            <span>Wind Caution</span>
          </div>

          <div className={`p-3 rounded-xl border flex items-center gap-2.5 ${currentWeather.visibility < 5 ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
            <Eye className="w-4 h-4" />
            <span>Fog Headlights</span>
          </div>
        </div>
      </div>

    </div>
  );
};
