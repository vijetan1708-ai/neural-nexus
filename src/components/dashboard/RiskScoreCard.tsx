import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';
import { RiskLevel } from '../../types/risk';

export const RiskScoreCard: React.FC = () => {
  const { riskAssessment } = useWeather();
  const { t } = useLanguage();
  const [showExplanation, setShowExplanation] = useState(false);

  const getRiskTheme = (level: RiskLevel) => {
    switch (level) {
      case 'extreme':
        return {
          title: t.riskLevels.extreme,
          textColor: 'text-red-400',
          borderColor: 'border-red-500/50',
          bgColor: 'bg-red-950/40',
          gaugeColor: 'from-orange-500 via-red-500 to-rose-600',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40'
        };
      case 'high':
        return {
          title: t.riskLevels.high,
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/50',
          bgColor: 'bg-orange-950/40',
          gaugeColor: 'from-amber-500 to-orange-500',
          badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
        };
      case 'moderate':
        return {
          title: t.riskLevels.moderate,
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/50',
          bgColor: 'bg-amber-950/40',
          gaugeColor: 'from-yellow-400 to-amber-500',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'low':
      default:
        return {
          title: t.riskLevels.low,
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/40',
          bgColor: 'bg-emerald-950/30',
          gaugeColor: 'from-teal-400 to-emerald-500',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
    }
  };

  const theme = getRiskTheme(riskAssessment.level);

  return (
    <div className={`rounded-2xl p-5 border ${theme.borderColor} ${theme.bgColor} shadow-lg transition-all`}>
      <div className="flex items-start justify-between gap-4">
        
        {/* Title & Risk Level */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className={`w-4 h-4 ${theme.textColor}`} />
            <span className="text-xs uppercase tracking-wider font-bold text-slate-300">
              {t.dashboard.riskScore}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-extrabold font-mono ${theme.textColor}`}>
              {riskAssessment.score}
            </span>
            <span className="text-slate-400 font-mono text-sm">/ 100</span>
            
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${theme.badgeBg}`}>
              {theme.title}
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed max-w-xl">
            {riskAssessment.summary}
          </p>
        </div>

        {/* Confidence Badge */}
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-200">
              {riskAssessment.confidence === 'High' ? t.riskLevels.confidenceHigh : t.riskLevels.confidenceMed}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">
            Confidence Index
          </span>
        </div>

      </div>

      {/* Visual Risk Gauge Meter */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
          <span>0 (Safe)</span>
          <span>40 (Moderate)</span>
          <span>60 (High)</span>
          <span>80+ (Hazardous)</span>
        </div>
        <div className="h-2.5 w-full bg-slate-950/80 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${theme.gaugeColor} transition-all duration-700 ease-out`}
            style={{ width: `${Math.max(4, riskAssessment.score)}%` }}
          />
        </div>
      </div>

      {/* Explainable AI Toggle Button */}
      <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center gap-1.5 text-xs text-brand-300 hover:text-brand-200 font-semibold transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{showExplanation ? 'Hide Transparent Factor Weights' : 'Why this score? Explainable AI Breakdown'}</span>
          {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[10px] text-slate-400">
          Primary Hazard: <strong className="text-slate-200">{riskAssessment.primaryRiskHazard}</strong>
        </span>
      </div>

      {/* Expandable Transparent Factors Breakdown */}
      {showExplanation && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 animate-in fade-in duration-200">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {t.dashboard.riskFactorsTitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {riskAssessment.factors.map((f) => (
              <div 
                key={f.id}
                className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/90 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200">{f.name}</span>
                  <p className="text-[10px] text-slate-400">{f.description}</p>
                </div>
                <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 ml-2 shrink-0">
                  +{f.points} pts
                </span>
              </div>
            ))}
          </div>

          {/* Confidence Rationale */}
          <div className="mt-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Confidence Logic: </span>
            {riskAssessment.confidenceReasons.join(' • ')}
          </div>
        </div>
      )}

    </div>
  );
};
