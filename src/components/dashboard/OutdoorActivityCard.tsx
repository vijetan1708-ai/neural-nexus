import React from 'react';
import { Activity, Check, X, Shield, AlertCircle } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';

export const OutdoorActivityCard: React.FC = () => {
  const { outdoorAssessment } = useWeather();
  const { t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case 'Good': return 'text-teal-400 bg-teal-500/15 border-teal-500/30';
      case 'Moderate': return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'Poor': return 'text-orange-400 bg-orange-500/15 border-orange-500/30';
      default: return 'text-red-400 bg-red-500/15 border-red-500/30';
    }
  };

  return (
    <div className="rounded-2xl p-4 bg-slate-900/80 border border-slate-800 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-500/15 text-brand-400">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase font-bold text-slate-300">
            {t.dashboard.outdoorScoreTitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-mono text-white">
            {outdoorAssessment.score}<span className="text-xs font-normal text-slate-400">/100</span>
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getStatusColor(outdoorAssessment.status)}`}>
            {outdoorAssessment.status}
          </span>
        </div>
      </div>

      {/* Activity Suitability Badges */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-1">🏏 Cricket</span>
          <span className={`inline-flex items-center gap-1 text-xs font-bold ${outdoorAssessment.suitableForCricket ? 'text-emerald-400' : 'text-rose-400'}`}>
            {outdoorAssessment.suitableForCricket ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {outdoorAssessment.suitableForCricket ? 'Suitable' : 'Avoid'}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-1">🏃 Jogging</span>
          <span className={`inline-flex items-center gap-1 text-xs font-bold ${outdoorAssessment.suitableForRunning ? 'text-emerald-400' : 'text-rose-400'}`}>
            {outdoorAssessment.suitableForRunning ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
            {outdoorAssessment.suitableForRunning ? 'Good' : 'Avoid'}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 block mb-1">🚗 Commute</span>
          <span className={`inline-flex items-center gap-1 text-xs font-bold ${outdoorAssessment.suitableForCommuting ? 'text-emerald-400' : 'text-amber-400'}`}>
            {outdoorAssessment.suitableForCommuting ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {outdoorAssessment.suitableForCommuting ? 'Normal' : 'Caution'}
          </span>
        </div>
      </div>

      {/* Reasons & Advice */}
      <div className="text-[11px] text-slate-400 space-y-1">
        {outdoorAssessment.reasons.length > 0 && (
          <p className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            {outdoorAssessment.reasons.join(', ')}
          </p>
        )}
        {outdoorAssessment.precautions.length > 0 && (
          <p className="text-slate-400 text-[10px] leading-relaxed">
            💡 {outdoorAssessment.precautions[0]}
          </p>
        )}
      </div>
    </div>
  );
};
