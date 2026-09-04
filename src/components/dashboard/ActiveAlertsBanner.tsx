import React from 'react';
import { AlertTriangle, ShieldCheck, Sparkles, ChevronRight, BellRing, LifeBuoy } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';
import { useLanguage } from '../../context/LanguageContext';
import { SourceBadge } from '../common/SourceBadge';

interface ActiveAlertsBannerProps {
  onAskWeatherGPT?: (query: string) => void;
}

export const ActiveAlertsBanner: React.FC<ActiveAlertsBannerProps> = ({ onAskWeatherGPT }) => {
  const { alerts, setIsEmergencyMode } = useAlert();
  const { t } = useLanguage();

  if (alerts.length === 0) {
    return (
      <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t.dashboard.noActiveAlerts}</span>
        </div>
        <SourceBadge sourceType="official_imd" customLabel="IMD Authorization Active" />
      </div>
    );
  }

  const getAlertStyle = (severity: string) => {
    switch (severity) {
      case 'warning': // Red Warning
        return {
          border: 'border-red-500/80 bg-red-950/50',
          badge: 'bg-red-500 text-white font-black',
          titleColor: 'text-red-300',
          pulse: true
        };
      case 'alert': // Orange Alert
        return {
          border: 'border-orange-500/70 bg-orange-950/40',
          badge: 'bg-orange-500 text-slate-950 font-black',
          titleColor: 'text-orange-300',
          pulse: false
        };
      case 'watch': // Yellow Watch
        return {
          border: 'border-yellow-500/60 bg-yellow-950/30',
          badge: 'bg-yellow-400 text-slate-950 font-bold',
          titleColor: 'text-yellow-300',
          pulse: false
        };
      default:
        return {
          border: 'border-emerald-500/50 bg-emerald-950/20',
          badge: 'bg-emerald-500 text-white font-bold',
          titleColor: 'text-emerald-300',
          pulse: false
        };
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const style = getAlertStyle(alert.severity);

        return (
          <div
            key={alert.id}
            className={`rounded-2xl p-4 sm:p-5 border ${style.border} shadow-lg transition-all relative overflow-hidden`}
          >
            {/* Top Bar with Badge & Source */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider ${style.badge}`}>
                  {alert.severity}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Expires: {alert.expiresAt}
                </span>
              </div>

              <SourceBadge 
                sourceType={alert.sourceType} 
                customLabel={alert.sourceName}
              />
            </div>

            {/* Title & Message */}
            <h3 className={`text-base font-bold mb-1.5 ${style.titleColor} flex items-center gap-2`}>
              <BellRing className={`w-4 h-4 shrink-0 ${style.pulse ? 'animate-bounce' : ''}`} />
              <span>{alert.title}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
              {alert.message}
            </p>

            {/* Key Instructions Checklist */}
            {alert.instructions.length > 0 && (
              <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <span className="font-semibold text-slate-300 block mb-1.5">Official Directives:</span>
                <ul className="space-y-1 text-slate-300">
                  {alert.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-brand-400 font-bold">•</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap pt-2 border-t border-slate-800/60">
              <button
                onClick={() => setIsEmergencyMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>{t.dashboard.emergencyGuidance}</span>
              </button>

              {onAskWeatherGPT && (
                <button
                  onClick={() => onAskWeatherGPT(`What precautions should I take for this alert: ${alert.title}?`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.dashboard.askWeatherGPT}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
