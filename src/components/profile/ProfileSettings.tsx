import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Bell, 
  Moon, 
  ShieldCheck, 
  Save, 
  Check, 
  Globe, 
  Briefcase 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { StorageService } from '../../services/storageService';
import { UserPersona, SupportedLanguage } from '../../types/user';
import { INDIAN_DISTRICTS } from '../../services/locationService';

export const ProfileSettings: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [prefs, setPrefs] = useState(() => StorageService.getUserPreferences());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    StorageService.saveUserPreferences(prefs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/40">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              User Profile & Intelligence Preferences
            </h1>
            <p className="text-xs text-slate-400">
              Customize your persona, notification thresholds, and saved Indian districts
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
        >
          {savedSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSuccess ? 'Saved Successfully!' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* Persona Selection */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Select User Persona (Personalizes AI Advice)
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'commuter', label: '🚗 Commuter', desc: 'Transit & road hazards' },
            { id: 'farmer', label: '🌾 Farmer / Kisan', desc: 'Irrigation & crop safety' },
            { id: 'traveler', label: '✈️ Traveler', desc: 'Inter-district route planning' },
            { id: 'student', label: '🎓 Student / Sports', desc: 'Outdoor sports & rain timing' },
            { id: 'emergency_worker', label: '🚨 Disaster Worker', desc: 'High-sensitivity warnings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPrefs(prev => ({ ...prev, persona: item.id as UserPersona }))}
              className={`p-3 rounded-xl border text-left transition-all ${
                prefs.persona === item.id
                  ? 'bg-brand-500/20 text-white border-brand-500 shadow-md font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-bold block mb-1">{item.label}</span>
              <p className="text-[10px] text-slate-400">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Language & Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Profile Details
          </span>

          <div className="space-y-2 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={prefs.name}
                onChange={(e) => setPrefs(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Email (for push alerts)</label>
              <input
                type="email"
                value={prefs.email}
                onChange={(e) => setPrefs(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Preferred Language (Indian Languages)
          </span>

          <select
            value={language}
            onChange={(e) => {
              const val = e.target.value as SupportedLanguage;
              setLanguage(val);
              setPrefs(prev => ({ ...prev, preferredLanguage: val }));
            }}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-semibold"
          >
            {supportedLanguages.map(l => (
              <option key={l.code} value={l.code}>{l.name} ({l.englishName})</option>
            ))}
          </select>

          <p className="text-[11px] text-slate-400">
            Translates the complete interface, alerts, farming advisories, and voice responses.
          </p>
        </div>

      </div>

      {/* Notification Categories & Quiet Hours */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Proactive Alert Delivery & Sensitivity
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {Object.entries(prefs.notificationCategories).map(([key, val]) => (
            <label 
              key={key} 
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700"
            >
              <span className="capitalize text-slate-300">{key} Alerts</span>
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => {
                  const updated = { ...prefs.notificationCategories, [key]: e.target.checked };
                  setPrefs(prev => ({ ...prev, notificationCategories: updated }));
                }}
                className="w-4 h-4 rounded text-brand-500 accent-brand-500"
              />
            </label>
          ))}
        </div>

        {/* Quiet Hours */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="font-bold text-white block">Quiet Hours</span>
              <p className="text-[10px] text-slate-400">Mute non-severe notifications during sleep hours (Official Red Warnings always override)</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <input
              type="time"
              value={prefs.quietHours.startTime}
              onChange={(e) => setPrefs(prev => ({
                ...prev,
                quietHours: { ...prev.quietHours, startTime: e.target.value }
              }))}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
            />
            <span className="text-slate-400">to</span>
            <input
              type="time"
              value={prefs.quietHours.endTime}
              onChange={(e) => setPrefs(prev => ({
                ...prev,
                quietHours: { ...prev.quietHours, endTime: e.target.value }
              }))}
              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>
      </div>

    </div>
  );
};
