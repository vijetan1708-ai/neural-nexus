import React from 'react';
import { X, Bell, CheckCheck, Clock, ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import { useAlert } from '../../context/AlertContext';

export const NotificationDrawer: React.FC = () => {
  const { 
    notifications, 
    isNotificationDrawerOpen, 
    setIsNotificationDrawerOpen, 
    markNotificationsAsRead,
    setIsEmergencyMode
  } = useAlert();

  if (!isNotificationDrawerOpen) return null;

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'official_imd':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ai_prediction':
        return <Sparkles className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'warning':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'alert':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'watch':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Proactive Notification Timeline</h2>
              <p className="text-[11px] text-slate-400">Automated multi-hazard early alerts</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              title="Mark all as read"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No proactive notifications yet.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  n.read
                    ? 'bg-slate-950/40 border-slate-800/80 text-slate-300'
                    : 'bg-slate-800/80 border-slate-700 text-white shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {getSourceIcon(n.sourceType)}
                    <span className="font-semibold text-xs text-white">{n.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityBadge(n.severity)}`}>
                    {n.severity}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                  {n.message}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{n.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">
                      Source: {n.sourceType === 'official_imd' ? 'Official IMD' : 'Forecast Analysis'}
                    </span>
                    {n.type === 'official_warning' && (
                      <button
                        onClick={() => {
                          setIsNotificationDrawerOpen(false);
                          setIsEmergencyMode(true);
                        }}
                        className="text-red-400 hover:text-red-300 font-bold underline"
                      >
                        Emergency SOS
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Backend monitors numerical forecast changes & IMD feeds continuously.
        </div>
      </div>
    </div>
  );
};
