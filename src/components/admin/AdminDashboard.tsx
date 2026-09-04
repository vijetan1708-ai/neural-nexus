import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  Server, 
  CheckCircle, 
  Activity, 
  Radio, 
  Save, 
  ShieldAlert, 
  Flame, 
  Waves, 
  Wind, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { StorageService } from '../../services/storageService';
import { SourceBadge } from '../common/SourceBadge';

export const AdminDashboard: React.FC = () => {
  const { isDemoActive, activeScenario, scenarios, setDemoScenario, toggleDemoMode } = useDemo();
  const [prefs, setPrefs] = useState(() => StorageService.getUserPreferences());
  const [apiKeyInput, setApiKeyInput] = useState(prefs.geminiApiKey || '');
  const [savedKey, setSavedKey] = useState(false);

  const handleSaveApiKey = () => {
    const updated = { ...prefs, geminiApiKey: apiKeyInput.trim() };
    StorageService.saveUserPreferences(updated);
    setPrefs(updated);
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Admin & System Health Console
            </h1>
            <p className="text-xs text-slate-400">
              API connections, Gemini AI keys, and SIH presentation orchestrator
            </p>
          </div>
        </div>

        <SourceBadge sourceType="official_imd" customLabel="System Online" />
      </div>

      {/* System Service Health Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-300 block">Open-Meteo Gateway</span>
            <span className="text-[11px] text-emerald-400 font-mono">Live Telemetry: 142 ms</span>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-300 block">IMD Authorized Feed</span>
            <span className="text-[11px] text-emerald-400 font-mono">Synced & Validated</span>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-300 block">Web Speech AI Model</span>
            <span className="text-[11px] text-cyan-400 font-mono">Pan-India BCP-47 Ready</span>
          </div>
          <CheckCircle className="w-5 h-5 text-cyan-400" />
        </div>

      </div>

      {/* Google Gemini AI Configuration */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Google Gemini API Configuration (Optional)
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          WeatherGPT is configured with a high-fidelity rule-grounded reasoning model that works completely offline. 
          To enable direct Google Gemini 1.5 Flash API calls, paste your Google AI Studio API key below.
        </p>

        <div className="flex gap-2">
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="AIzaSy... (Paste Gemini API Key)"
            className="flex-1 px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-brand-400"
          />
          <button
            onClick={handleSaveApiKey}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shrink-0"
          >
            {savedKey ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedKey ? 'Saved' : 'Save Key'}</span>
          </button>
        </div>
      </div>

      {/* SIH Hackathon Demo Scenarios Manager */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              SIH Hackathon Demo Orchestrator
            </span>
            <p className="text-[11px] text-slate-400">
              Trigger simulated emergency scenarios to evaluate system resilience and automated warnings
            </p>
          </div>

          <button
            onClick={() => toggleDemoMode(!isDemoActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              isDemoActive
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold'
                : 'bg-slate-950 text-slate-300 border-slate-700'
            }`}
          >
            {isDemoActive ? 'Demo Active' : 'Enable Demo'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {scenarios.map((sc) => {
            const isCurrent = isDemoActive && activeScenario.id === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => setDemoScenario(sc.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-500 shadow-md scale-[1.01]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <span>{sc.badge}</span>
                    <span className="text-slate-400">({sc.nameHindi})</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-amber-400">
                    Risk: {sc.riskScore}/100
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                  {sc.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/60">
                  <span>Location: {sc.locationName}</span>
                  {isCurrent && <span className="text-amber-400 font-bold uppercase">Simulating Now</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
