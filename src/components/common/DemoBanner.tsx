import React from 'react';
import { AlertOctagon, Flame, CloudLightning, Waves, CloudRain, Sun, Wind, X } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { DemoScenarioId } from '../../types/demo';
import { useLanguage } from '../../context/LanguageContext';

export const DemoBanner: React.FC = () => {
  const { isDemoActive, activeScenario, scenarios, setDemoScenario, toggleDemoMode } = useDemo();
  const { t, language } = useLanguage();

  if (!isDemoActive) {
    return (
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 border-b border-slate-700/60 py-1.5 px-4 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
            SIH26068
          </span>
          <span className="hidden sm:inline text-slate-300 font-medium">Smart India Hackathon Presentation Mode:</span>
          <span className="text-slate-400">Test multi-hazard scenarios safely</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDemoScenario('cyclone')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-all"
          >
            <Wind className="w-3 h-3" />
            <span>Simulate Cyclone</span>
          </button>
          <button
            onClick={() => setDemoScenario('flood')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-xs font-medium transition-all"
          >
            <Waves className="w-3 h-3" />
            <span>Simulate Flood</span>
          </button>
          <button
            onClick={() => toggleDemoMode(true)}
            className="text-brand-400 hover:text-brand-300 underline font-medium text-xs ml-1"
          >
            All Scenarios
          </button>
        </div>
      </div>
    );
  }

  const getScenarioIcon = (id: DemoScenarioId) => {
    switch (id) {
      case 'cyclone': return <Wind className="w-3.5 h-3.5" />;
      case 'flood': return <Waves className="w-3.5 h-3.5" />;
      case 'heatwave': return <Flame className="w-3.5 h-3.5" />;
      case 'thunderstorm': return <CloudLightning className="w-3.5 h-3.5" />;
      case 'heavy_rain': return <CloudRain className="w-3.5 h-3.5" />;
      case 'normal': return <Sun className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-950 via-amber-950 to-red-950 border-b-2 border-amber-500/70 py-2.5 px-4 text-xs shadow-lg relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/20 border border-amber-500/40 animate-pulse">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="font-bold text-amber-300 tracking-wide uppercase mr-2">
              {t.demoMode.bannerWarning}
            </span>
            <span className="text-slate-200 hidden lg:inline">
              Active Scenario: <strong className="text-white">{language === 'ta' ? activeScenario.nameTamil : (language === 'hi' ? activeScenario.nameHindi : activeScenario.name)}</strong> ({activeScenario.locationName})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {scenarios.map(s => {
            const isActive = s.id === activeScenario.id;
            return (
              <button
                key={s.id}
                onClick={() => setDemoScenario(s.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold scale-105'
                    : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                {getScenarioIcon(s.id)}
                <span>{s.badge}</span>
              </button>
            );
          })}

          <button
            onClick={() => toggleDemoMode(false)}
            title="Exit Demo Simulation"
            className="flex items-center gap-1 px-2 py-1 ml-2 rounded bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/50 text-xs font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
