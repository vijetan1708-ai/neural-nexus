import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AlertProvider } from './context/AlertContext';
import { DemoProvider } from './context/DemoContext';
import { WeatherProvider } from './context/WeatherContext';

// Common components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { DemoBanner } from './components/common/DemoBanner';
import { OfflineBanner } from './components/common/OfflineBanner';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// Dashboard components
import { GreetingHeader } from './components/dashboard/GreetingHeader';
import { CurrentWeatherCard } from './components/dashboard/CurrentWeatherCard';
import { MetricGrid } from './components/dashboard/MetricGrid';
import { RiskScoreCard } from './components/dashboard/RiskScoreCard';
import { OutdoorActivityCard } from './components/dashboard/OutdoorActivityCard';
import { ActiveAlertsBanner } from './components/dashboard/ActiveAlertsBanner';
import { HourlyForecast } from './components/dashboard/HourlyForecast';
import { WeeklyForecast } from './components/dashboard/WeeklyForecast';
import { QuickActionChips } from './components/dashboard/QuickActionChips';

// Specialized views
import { WeatherGPTChat } from './components/ai/WeatherGPTChat';
import { WeatherMap } from './components/map/WeatherMap';
import { HistoricalTrends } from './components/history/HistoricalTrends';
import { AgricultureDashboard } from './components/agriculture/AgricultureDashboard';
import { TravelDashboard } from './components/travel/TravelDashboard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ProfileSettings } from './components/profile/ProfileSettings';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EmergencyModeModal } from './components/emergency/EmergencyModeModal';

// Mobile menu icons
import { X } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [chatPromptQuery, setChatPromptQuery] = useState<string | undefined>(undefined);

  const handleQuickQuery = (query: string) => {
    setChatPromptQuery(query);
    setActiveTab('weathergpt');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6 pb-16 lg:pb-8 animate-in fade-in">
            {/* 1. Location + Greeting */}
            <GreetingHeader />

            {/* 2. Top Priority: Current Weather Hero Card */}
            <CurrentWeatherCard />

            {/* 3. Risk Score + Active Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RiskScoreCard />
              <ActiveAlertsBanner onAskWeatherGPT={handleQuickQuery} />
            </div>

            {/* 4. Detailed Meteorological Metrics */}
            <MetricGrid />

            {/* 5. Outdoor Activity Suitability */}
            <OutdoorActivityCard />

            {/* 6. Hourly Forecast (24 Hours) */}
            <HourlyForecast />

            {/* 7. 7-Day Forecast */}
            <WeeklyForecast />

            {/* 8. WeatherGPT Quick Action Chips */}
            <QuickActionChips onSelectQuery={handleQuickQuery} />
          </div>
        );

      case 'weathergpt':
        return (
          <div className="pb-16 lg:pb-8 animate-in fade-in">
            <WeatherGPTChat
              initialQuery={chatPromptQuery}
              onClearInitialQuery={() => setChatPromptQuery(undefined)}
            />
          </div>
        );

      case 'forecast':
        return (
          <div className="space-y-6 pb-16 lg:pb-8 animate-in fade-in">
            <GreetingHeader />
            <HourlyForecast />
            <WeeklyForecast />
          </div>
        );

      case 'alerts':
        return (
          <div className="space-y-6 pb-16 lg:pb-8 animate-in fade-in">
            <GreetingHeader />
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-xl font-extrabold text-white">Active Meteorological Warnings & Alerts</h2>
              <ActiveAlertsBanner onAskWeatherGPT={handleQuickQuery} />
              <RiskScoreCard />
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="pb-16 lg:pb-8 animate-in fade-in">
            <WeatherMap />
          </div>
        );

      case 'history':
        return (
          <div className="pb-16 lg:pb-8 animate-in fade-in">
            <HistoricalTrends />
          </div>
        );

      case 'agriculture':
        return (
          <div className="pb-16 lg:pb-8 animate-in fade-in">
            <AgricultureDashboard />
          </div>
        );

      case 'travel':
        return (
          <div className="pb-16 lg:pb-8 animate-in fade-in">
            <TravelDashboard />
          </div>
        );

      case 'analytics':
        return (
          <div className="pb-16 lg:pb-8 animate-in fade-in">
            <AnalyticsDashboard />
          </div>
        );

      case 'profile':
        return (
          <div className="pb-16 lg:pb-8 animate-in fade-in">
            <ProfileSettings />
          </div>
        );

      case 'settings':
        return (
          <div className="pb-16 lg:pb-8 animate-in fade-in">
            <AdminDashboard />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Demo Toolbar */}
      <DemoBanner />

      {/* Offline Alert if disconnected */}
      <OfflineBanner />

      {/* Main Navbar */}
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Layout Shell */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {renderActiveTab()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Proactive Notification Flyout Drawer */}
      <NotificationDrawer />

      {/* Full-screen Emergency SOS Modal */}
      <EmergencyModeModal />

      {/* Mobile Full Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="font-extrabold text-lg text-white">All WeatherGPT Sections</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-6 overflow-y-auto">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'weathergpt', label: 'WeatherGPT AI' },
              { id: 'forecast', label: 'Forecast' },
              { id: 'alerts', label: 'Alerts' },
              { id: 'map', label: 'Weather Map' },
              { id: 'history', label: 'History & Trends' },
              { id: 'agriculture', label: 'Agriculture' },
              { id: 'travel', label: 'Travel Mode' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'profile', label: 'Profile' },
              { id: 'settings', label: 'Admin Settings' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveTab(m.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-left text-xs font-semibold border ${
                  activeTab === m.id
                    ? 'bg-brand-500/20 text-brand-300 border-brand-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full py-3 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold"
          >
            Close Menu
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AlertProvider>
        <DemoProvider>
          <WeatherProvider>
            <AppContent />
          </WeatherProvider>
        </DemoProvider>
      </AlertProvider>
    </LanguageProvider>
  );
}
