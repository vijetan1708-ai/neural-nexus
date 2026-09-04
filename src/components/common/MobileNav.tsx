import React from 'react';
import { LayoutDashboard, Bot, CalendarDays, AlertOctagon, LifeBuoy, Menu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAlert } from '../../context/AlertContext';

interface MobileNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onSelectTab, onOpenMenu }) => {
  const { t } = useLanguage();
  const { alerts, setIsEmergencyMode } = useAlert();

  const activeAlertsCount = alerts.filter(a => a.severity === 'warning' || a.severity === 'alert').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2 flex items-center justify-around">
      <button
        onClick={() => onSelectTab('dashboard')}
        className={`flex flex-col items-center gap-1 text-[10px] ${
          activeTab === 'dashboard' ? 'text-brand-400 font-bold' : 'text-slate-400'
        }`}
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>{t.nav.dashboard}</span>
      </button>

      <button
        onClick={() => onSelectTab('weathergpt')}
        className={`flex flex-col items-center gap-1 text-[10px] ${
          activeTab === 'weathergpt' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        <Bot className="w-4 h-4" />
        <span>{t.nav.weathergpt}</span>
      </button>

      <button
        onClick={() => onSelectTab('forecast')}
        className={`flex flex-col items-center gap-1 text-[10px] ${
          activeTab === 'forecast' ? 'text-brand-400 font-bold' : 'text-slate-400'
        }`}
      >
        <CalendarDays className="w-4 h-4" />
        <span>{t.nav.forecast}</span>
      </button>

      <button
        onClick={() => onSelectTab('alerts')}
        className={`flex flex-col items-center gap-1 text-[10px] relative ${
          activeTab === 'alerts' ? 'text-amber-400 font-bold' : 'text-slate-400'
        }`}
      >
        <AlertOctagon className="w-4 h-4" />
        <span>{t.nav.alerts}</span>
        {activeAlertsCount > 0 && (
          <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
        )}
      </button>

      <button
        onClick={() => setIsEmergencyMode(true)}
        className="flex flex-col items-center gap-1 text-[10px] text-red-400 font-bold"
      >
        <LifeBuoy className="w-4 h-4 text-red-500 animate-pulse" />
        <span>SOS</span>
      </button>

      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-slate-200"
      >
        <Menu className="w-4 h-4" />
        <span>More</span>
      </button>
    </nav>
  );
};
