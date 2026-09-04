import React from 'react';
import { 
  Wheat, 
  Droplets, 
  Wind, 
  Sun, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sprout, 
  Calendar 
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';

export const AgricultureDashboard: React.FC = () => {
  const { currentWeather, dailyForecast, location } = useWeather();
  const { t, language } = useLanguage();

  const tomorrowRain = dailyForecast[1]?.rainProbability ?? 30;
  const shouldDelayIrrigation = tomorrowRain >= 45 || currentWeather.rainProbability >= 60;
  const isWindSafeForSpray = currentWeather.windSpeed <= 15;
  const isRainSafeForSpray = currentWeather.rainProbability <= 30;
  const isSpraySuitable = isWindSafeForSpray && isRainSafeForSpray;

  const crops = [
    {
      name: language === 'ta' ? 'நெல் (Paddy / Rice)' : (language === 'hi' ? 'धान / चावल (Paddy)' : 'Paddy / Rice'),
      stage: 'Tillering / Flowering',
      waterNeed: 'High',
      advice: shouldDelayIrrigation 
        ? 'Heavy precipitation forecast within 24-48h. Keep field bunds intact and avoid supplementary pumping.' 
        : 'Maintain 2-3 cm standing water depth during reproductive stage.',
      status: shouldDelayIrrigation ? 'Drain Excess Water' : 'Optimal Hydration'
    },
    {
      name: language === 'ta' ? 'பருத்தி (Cotton)' : (language === 'hi' ? 'कपास (Cotton)' : 'Cotton'),
      stage: 'Boll Formation',
      waterNeed: 'Moderate',
      advice: currentWeather.humidity > 80 
        ? 'High humidity (>80%) favors boll rot and fungal infection. Inspect leaf undersides for whitefly or aphids.' 
        : 'Good vegetative conditions. Monitor soil moisture.',
      status: currentWeather.humidity > 80 ? 'Pest Alert' : 'Healthy Growth'
    },
    {
      name: language === 'ta' ? 'கரும்பு (Sugarcane)' : (language === 'hi' ? 'गन्ना (Sugarcane)' : 'Sugarcane'),
      stage: 'Grand Growth Period',
      waterNeed: 'High',
      advice: currentWeather.windSpeed > 35 
        ? 'Gusty winds may cause crop lodging. Propping and trash mulching strongly advised.' 
        : 'Ensure adequate drainage in furrow rows.',
      status: currentWeather.windSpeed > 35 ? 'Lodging Risk' : 'Normal'
    },
    {
      name: language === 'ta' ? 'காய்கறிகள் (Vegetables)' : (language === 'hi' ? 'सब्जियां (Vegetables)' : 'Vegetables & Horticultural'),
      stage: 'Fruiting / Harvest',
      waterNeed: 'Controlled',
      advice: isSpraySuitable 
        ? 'Favorable microclimate for preventive bio-fungicide foliar application.' 
        : 'Postpone pesticide spraying; high drift or rainfall washout expected.',
      status: isSpraySuitable ? 'Spray Window Open' : 'Delay Spraying'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Wheat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {t.agriculture.title}
            </h1>
            <p className="text-xs text-slate-300">
              {t.agriculture.subtitle} ({location.district || location.city}, {location.state})
            </p>
          </div>
        </div>
      </div>

      {/* Key Agronomic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Irrigation Scheduling Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.agriculture.irrigationAdvice}
            </span>
            <div className={`p-2 rounded-xl ${shouldDelayIrrigation ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <Droplets className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-base font-extrabold ${shouldDelayIrrigation ? 'text-amber-400' : 'text-emerald-400'}`}>
              {shouldDelayIrrigation ? 'Delay Scheduled Irrigation' : 'Irrigation Recommended'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {shouldDelayIrrigation ? t.agriculture.delayIrrigation : 'Dry spell expected over the next 48 hours. Provide light surface irrigation.'}
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Tomorrow Rain: {tomorrowRain}%</span>
            <span className="text-emerald-400 font-sans font-bold">Conserves Water</span>
          </div>
        </div>

        {/* Spray Suitability Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.agriculture.spraySuitability}
            </span>
            <div className={`p-2 rounded-xl ${isSpraySuitable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {isSpraySuitable ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-base font-extrabold ${isSpraySuitable ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isSpraySuitable ? 'Favorable for Spraying' : 'Unfavorable / Spraying High Risk'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {isSpraySuitable ? t.agriculture.favorableSpraying : t.agriculture.unfavorableSpraying}
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Wind: {currentWeather.windSpeed} km/h</span>
            <span>Rain Prob: {currentWeather.rainProbability}%</span>
          </div>
        </div>

        {/* Estimated Soil Moisture Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.agriculture.soilMoisture}
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sprout className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-cyan-400">
              {currentWeather.precipitation > 5 ? '88%' : (currentWeather.humidity > 70 ? '68%' : '42%')}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {currentWeather.precipitation > 5 ? 'Saturated' : (currentWeather.humidity > 70 ? 'Optimal' : 'Deficit')}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Evapotranspiration estimated at ~3.4 mm/day. Soil moisture retention is adequate for root absorption.
          </p>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Relative Humidity: {currentWeather.humidity}%</span>
            <span>Surface Temp: {currentWeather.temperature}°C</span>
          </div>
        </div>

      </div>

      {/* Hyperlocal Crop Guidance Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span>Hyperlocal Crop-Specific Weather Advisory</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {crops.map((crop, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{crop.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {crop.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {crop.advice}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                <span>Growth Stage: <strong className="text-slate-200">{crop.stage}</strong></span>
                <span>Water Needs: <strong className="text-slate-200">{crop.waterNeed}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
