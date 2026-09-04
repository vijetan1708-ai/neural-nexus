import React from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  CalendarDays, 
  AlertOctagon, 
  Map, 
  LineChart, 
  Wheat, 
  Plane, 
  LifeBuoy, 
  BarChart3, 
  User, 
  Settings 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAlert } from '../../context/AlertContext';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useLanguage();
  const { alerts, setIsEmergencyMode } = useAlert();

  const activeAlertsCount = alerts.filter(a => a.severity === 'warning' || a.severity === 'alert').length;

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'weathergpt', label: t.nav.weathergpt, icon: Bot, highlight: true },
    { id: 'forecast', label: t.nav.forecast, icon: CalendarDays },
    { id: 'alerts', label: t.nav.alerts, icon: AlertOctagon, badge: activeAlertsCount > 0 ? activeAlertsCount : undefined },
    { id: 'map', label: t.nav.map, icon: Map },
    { id: 'history', label: t.nav.history, icon: LineChart },
    { id: 'agriculture', label: t.nav.agriculture, icon: Wheat },
    { id: 'travel', label: t.nav.travel, icon: Plane },
    { id: 'emergency', label: t.nav.emergency, icon: LifeBuoy, isEmergency: true },
    { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
    { id: 'profile', label: t.nav.profile, icon: User },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block bg-slate-950/60 border-r border-slate-800 p-4 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isEmergency) {
            return (
              <button
                key={item.id}
                onClick={() => setIsEmergencyMode(true)}
                className="w-full mt-3 mb-2 flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-950/80 to-rose-950/80 hover:from-red-900/90 hover:to-rose-900/90 text-red-300 border border-red-800/60 transition-all shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform animate-pulse" />
                  <span>{item.label}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-600/40 text-red-200">
                  SOS
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-brand-500/15 text-brand-300 font-semibold border border-brand-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  {item.badge}
                </span>
              )}
              {item.highlight && !isActive && (
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Platform Notice */}
      <div className="mt-8 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-300 mb-1">WeatherGPT Platform</p>
        <p className="text-[10px] leading-relaxed text-slate-500">
          Hyperlocal Prediction & Official IMD Early Warning Engine.
        </p>
      </div>
    </aside>
  );
};
