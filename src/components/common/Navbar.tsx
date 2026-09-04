import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Globe, 
  Bell, 
  AlertTriangle, 
  Sparkles, 
  Check, 
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAlert } from '../../context/AlertContext';
import { LocationService } from '../../services/locationService';
import { LocationData } from '../../types/weather';
import { SupportedLanguage } from '../../types/user';

interface NavbarProps {
  onSelectTab: (tabId: string) => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectTab }) => {
  const { location, changeLocation, detectGPSLocation, isLoading, refreshWeather } = useWeather();
  const { language, setLanguage, supportedLanguages, t } = useLanguage();
  const { unreadNotificationsCount, setIsNotificationDrawerOpen, setIsEmergencyMode } = useAlert();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Live search query handling
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const matches = LocationService.searchLocations(searchQuery);
      setSearchResults(matches.slice(0, 6));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (loc: LocationData) => {
    changeLocation(loc);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleNaturalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if query matches location directly
    const matches = LocationService.searchLocations(searchQuery);
    if (matches.length > 0) {
      handleSelectLocation(matches[0]);
    } else {
      // Natural language question -> Route to WeatherGPT assistant tab
      onSelectTab('weathergpt');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Logo & Hackathon Tag */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center overflow-hidden">
              <img src="/logo.svg" alt="WeatherGPT" className="w-7 h-7" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                Weather<span className="text-brand-400">GPT</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/40">
                SIH26068
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Prediction & Disaster Alert
            </p>
          </div>
        </div>

        {/* Universal Search Bar */}
        <div ref={searchRef} className="flex-1 max-w-lg relative hidden md:block">
          <form onSubmit={handleNaturalSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.dashboard.searchPlaceholder}
              className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/50 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="submit"
                className="absolute right-2.5 top-2 text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 hover:bg-brand-500/30"
              >
                Go
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-1.5">
                <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
                  Hyperlocal Indian Locations
                </div>
                {searchResults.map((item, idx) => (
                  <button
                    key={`${item.city}-${idx}`}
                    onClick={() => handleSelectLocation(item)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between text-slate-200 group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-brand-400 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-white">{item.city}</span>
                      <span className="text-slate-400 text-[11px]">{item.district}, {item.state}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.pincode}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Use My Location (GPS) */}
          <button
            onClick={detectGPSLocation}
            disabled={isLoading}
            title={t.dashboard.useMyLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition-all"
          >
            <Navigation className={`w-3.5 h-3.5 text-brand-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">{location.city}</span>
            <span className="lg:hidden">{location.city.slice(0, 8)}</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={refreshWeather}
            disabled={isLoading}
            title="Refresh live telemetry"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-brand-400' : ''}`} />
          </button>

          {/* Multi-Language Dropdown (All Major Indian Languages) */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-medium"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">{supportedLanguages.find(l => l.code === language)?.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Language
                </div>
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code as SupportedLanguage);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      language === l.code ? 'bg-brand-500/20 text-brand-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <span className="mr-1.5">{l.name}</span>
                      <span className="text-[10px] text-slate-400">({l.englishName})</span>
                    </div>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-brand-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all"
            title="Notification Timeline"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={() => setIsEmergencyMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 animate-pulse border border-red-400/40 transition-all"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
            <span className="hidden sm:inline">EMERGENCY SOS</span>
            <span className="sm:hidden">SOS</span>
          </button>

        </div>
      </div>
    </header>
  );
};
