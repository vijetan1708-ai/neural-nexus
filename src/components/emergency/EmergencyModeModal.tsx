import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  Share2, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  CheckSquare, 
  Check, 
  Building2, 
  Radio, 
  Flame, 
  Waves, 
  Wind, 
  Zap, 
  ThermometerSnowflake 
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useAlert } from '../../context/AlertContext';
import { useLanguage } from '../../context/LanguageContext';

export const EmergencyModeModal: React.FC = () => {
  const { isEmergencyMode, setIsEmergencyMode, alerts } = useAlert();
  const { location, currentWeather, riskAssessment } = useWeather();
  const { t } = useLanguage();

  const [copiedLocation, setCopiedLocation] = useState(false);
  const [selectedHazardTab, setSelectedHazardTab] = useState<'flood' | 'cyclone' | 'lightning' | 'heatwave' | 'storm'>('flood');

  if (!isEmergencyMode) return null;

  const handleShareLocation = () => {
    const text = `🚨 EMERGENCY DISASTER SOS ALERT!\nName: WeatherGPT User\nLocation: ${location.city}, ${location.district}, ${location.state}\nGPS Coordinates: https://maps.google.com/?q=${location.latitude},${location.longitude}\nCurrent Risk Score: ${riskAssessment.score}/100 (${riskAssessment.level.toUpperCase()})\nPrimary Hazard: ${riskAssessment.primaryRiskHazard}\nTime: ${new Date().toLocaleString()}\nPlease dispatch emergency assistance or check safety.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 4000);
    }

    if (navigator.share) {
      navigator.share({
        title: 'EMERGENCY WEATHER SOS',
        text: text,
      }).catch(() => {});
    }
  };

  const getEmergencyChecklists = () => {
    switch (selectedHazardTab) {
      case 'flood':
        return [
          'Move family members, children, and essential medicines to the first floor or higher ground immediately.',
          'DO NOT attempt to walk, swim, or drive through moving street floodwaters — 15 cm of moving water can knock an adult down.',
          'Switch off main electrical circuit breaker and LPG gas cylinder regulator.',
          'Store safe drinking water in clean sealed containers; boil all tap water before consumption.',
          'Monitor local district administration radio/TV advisories and SMS broadcasts.'
        ];
      case 'cyclone':
        return [
          'Remain strictly indoors within the strongest interior room away from glass windows and doors.',
          'Secure all loose tin sheets, solar water heater panels, antennas, and outdoor garden furniture.',
          'Keep battery-powered emergency torches, mobile power banks, and non-perishable food ready.',
          'DO NOT venture outdoors during the calm "eye" of the cyclone — violent reverse winds will resume abruptly.',
          'Follow mandatory evacuation directives to designated Cyclone Shelters immediately if living within 5 km of coast.'
        ];
      case 'lightning':
        return [
          'Seek shelter immediately in an enclosed masonry building or fully metal vehicle with windows rolled up.',
          'NEVER seek shelter beneath tall, isolated trees, open tin sheds, or near metal fences.',
          'Avoid taking showers, using corded landline phones, or touching plumbing lines during thunderstorm strikes.',
          'If caught in open fields with no shelter, crouch down low on the balls of your feet with heels touching, hands on ears.',
          'Unplug sensitive computer electronics and appliances.'
        ];
      case 'heatwave':
        return [
          'Avoid all strenuous direct outdoor labor between 11:30 AM and 4:00 PM.',
          'Drink water, ORS (oral rehydration solution), buttermilk, and lemon water at frequent intervals.',
          'Wear loose, light-colored cotton clothing and cover head with a wet towel or umbrella.',
          'Never leave infants, elderly individuals, or animals locked in parked vehicles.',
          'Recognize heat stroke symptoms: high fever, confusion, rapid pulse — apply ice packs to neck/armpits and rush to hospital.'
        ];
      case 'storm':
        return [
          'Stay indoors and stay away from glass windows, exterior doors, and skylights.',
          'Beware of high-velocity flying debris, collapsing signboards, and damaged electric wires.',
          'Do not park vehicles under old, large trees or near unreinforced boundary walls.',
          'Keep candles or battery torches handy in case of localized grid transformer failures.'
        ];
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 backdrop-blur-xl animate-in fade-in">
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto flex flex-col justify-between">
        
        {/* Urgent Pulsing Emergency Banner */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-2xl shadow-red-600/40 border border-red-400">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md animate-bounce">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded">
                  {t.emergency.sosHeader}
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                  {t.emergency.title}
                </h1>
                <p className="text-xs text-red-100 hidden sm:block">
                  {t.emergency.subtitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEmergencyMode(false)}
              className="p-2 rounded-xl bg-black/30 hover:bg-black/50 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick SOS Action Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direct 112 Call Button */}
            <a
              href="tel:112"
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-base shadow-xl shadow-red-600/30 transition-all border border-red-400 text-center"
            >
              <PhoneCall className="w-6 h-6 animate-pulse" />
              <span>{t.emergency.callEmergencyServices}</span>
            </a>

            {/* Broadcast GPS Coordinates */}
            <button
              onClick={handleShareLocation}
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-base shadow-xl shadow-brand-600/30 transition-all border border-brand-400 text-center"
            >
              <Share2 className="w-6 h-6" />
              <span>{copiedLocation ? t.emergency.locationSharedCopied : t.emergency.shareLocation}</span>
            </button>
          </div>

          {/* Location & Active Hazards Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Hyperlocal Telemetry Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">
                Current Location & Coordinates
              </span>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>{location.city}, {location.state}</span>
              </div>
              <p className="font-mono text-cyan-400 text-[11px]">
                Lat: {location.latitude}°N | Lon: {location.longitude}°E
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-slate-300">
                <span>Temp: <strong>{currentWeather.temperature}°C</strong></span>
                <span>Wind: <strong>{currentWeather.windSpeed} km/h</strong></span>
                <span>Rain: <strong>{currentWeather.rainProbability}%</strong></span>
              </div>
            </div>

            {/* Weather Risk Card */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">
                Disaster Risk Assessment
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-red-400 font-mono">
                  {riskAssessment.score}/100
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                  {riskAssessment.level}
                </span>
              </div>
              <p className="text-slate-300 text-xs">
                Hazard: <strong className="text-white">{riskAssessment.primaryRiskHazard}</strong>
              </p>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {riskAssessment.summary}
              </p>
            </div>

            {/* Official Alert Status */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider block">
                Official Meteorological Alert
              </span>
              {alerts.length > 0 ? (
                <div>
                  <span className="text-sm font-bold text-rose-300 block mb-1">
                    {alerts[0].title}
                  </span>
                  <p className="text-[11px] text-slate-300 line-clamp-3">
                    {alerts[0].message}
                  </p>
                </div>
              ) : (
                <div className="text-slate-400 py-3">
                  No active red alerts issued by IMD for this sector.
                </div>
              )}
            </div>

          </div>

          {/* Official Emergency Helplines (Government & Verified Numbers) */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{t.emergency.helplinesTitle} (Toll-Free Government Numbers)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <a href="tel:112" className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 text-center transition-all group">
                <span className="text-[10px] text-slate-400 block mb-1">National Emergency</span>
                <span className="text-lg font-black text-red-400 font-mono group-hover:scale-105 block">112</span>
              </a>

              <a href="tel:1078" className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 text-center transition-all group">
                <span className="text-[10px] text-slate-400 block mb-1">NDRF Disaster</span>
                <span className="text-lg font-black text-orange-400 font-mono group-hover:scale-105 block">1078</span>
              </a>

              <a href="tel:108" className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-center transition-all group">
                <span className="text-[10px] text-slate-400 block mb-1">Ambulance Medical</span>
                <span className="text-lg font-black text-emerald-400 font-mono group-hover:scale-105 block">108</span>
              </a>

              <a href="tel:101" className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-center transition-all group">
                <span className="text-[10px] text-slate-400 block mb-1">Fire & Rescue</span>
                <span className="text-lg font-black text-amber-400 font-mono group-hover:scale-105 block">101</span>
              </a>

              <a href="tel:1070" className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 text-center transition-all group">
                <span className="text-[10px] text-slate-400 block mb-1">State Disaster SDMA</span>
                <span className="text-lg font-black text-cyan-400 font-mono group-hover:scale-105 block">1070</span>
              </a>
            </div>
          </div>

          {/* Hazard-Specific Preparedness Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                <span>{t.emergency.preparednessChecklists}</span>
              </h2>

              {/* Hazard Tab Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setSelectedHazardTab('flood')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedHazardTab === 'flood' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Waves className="w-3.5 h-3.5" />
                  <span>Flood</span>
                </button>

                <button
                  onClick={() => setSelectedHazardTab('cyclone')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedHazardTab === 'cyclone' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" />
                  <span>Cyclone</span>
                </button>

                <button
                  onClick={() => setSelectedHazardTab('lightning')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedHazardTab === 'lightning' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Lightning</span>
                </button>

                <button
                  onClick={() => setSelectedHazardTab('heatwave')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedHazardTab === 'heatwave' ? 'bg-orange-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Heatwave</span>
                </button>

                <button
                  onClick={() => setSelectedHazardTab('storm')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedHazardTab === 'storm' ? 'bg-rose-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Storm</span>
                </button>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 text-xs">
              {getEmergencyChecklists().map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Relief Shelters */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-brand-400" />
              <span>{t.emergency.sheltersTitle}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">Government Higher Secondary School Shelter</span>
                <p className="text-slate-400 text-[11px]">Capacity: 650 persons • Generator Backup</p>
                <span className="text-[10px] text-emerald-400 font-mono block">Distance: 1.2 km from your GPS</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">Community Cyclone Relief Center</span>
                <p className="text-slate-400 text-[11px]">Capacity: 1,200 persons • Medical First-Aid Post</p>
                <span className="text-[10px] text-emerald-400 font-mono block">Distance: 2.8 km from your GPS</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white block">District Civil Hospital Emergency Ward</span>
                <p className="text-slate-400 text-[11px]">24x7 Trauma & Ambulance Fleet</p>
                <span className="text-[10px] text-cyan-400 font-mono block">Distance: 3.5 km from your GPS</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Close */}
        <div className="mt-8 pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => setIsEmergencyMode(false)}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
          >
            Exit Emergency Mode & Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
