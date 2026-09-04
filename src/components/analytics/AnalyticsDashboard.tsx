import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  AlertTriangle, 
  Activity, 
  BarChart3, 
  CheckCircle, 
  Radio, 
  Zap 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { SourceBadge } from '../common/SourceBadge';

export const AnalyticsDashboard: React.FC = () => {
  const alertTypeData = [
    { type: 'Heavy Rain', count: 48, fill: '#0ea5e9' },
    { type: 'Thunderstorm', count: 32, fill: '#f59e0b' },
    { type: 'Heatwave', count: 24, fill: '#f97316' },
    { type: 'High Wind', count: 18, fill: '#818cf8' },
    { type: 'Flood / Surge', count: 14, fill: '#ef4444' },
  ];

  const timelineData = [
    { month: 'Apr', alerts: 12, usersSaved: 420 },
    { month: 'May', alerts: 19, usersSaved: 680 },
    { month: 'Jun', alerts: 26, usersSaved: 950 },
    { month: 'Jul', alerts: 34, usersSaved: 1400 },
    { month: 'Aug', alerts: 41, usersSaved: 1920 },
    { month: 'Sep', alerts: 22, usersSaved: 2450 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            <span>Platform Impact & Disaster Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time telemetry distribution and early-warning delivery performance
          </p>
        </div>

        <SourceBadge sourceType="demo_simulated" customLabel="Demo Analytics Data" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Alerts</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-3xl font-extrabold text-white font-mono">124</span>
          <p className="text-[11px] text-slate-400">Across 18 coastal & inland districts</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">High Risk Warnings</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <span className="text-3xl font-extrabold text-orange-400 font-mono">18</span>
          <p className="text-[11px] text-slate-400">Official Red/Orange category</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Average Risk Score</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-extrabold text-amber-300 font-mono">47<span className="text-xs font-normal text-slate-500">/100</span></span>
          <p className="text-[11px] text-slate-400">Calculated across all monitors</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Citizens Protected</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">2,450+</span>
          <p className="text-[11px] text-slate-400">Proactive alerts dispatched</p>
        </div>

      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Disaster Event Breakdown Bar */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Disaster Alert Category Breakdown
          </span>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertTypeData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="type" type="category" stroke="#64748b" fontSize={11} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
                <Bar dataKey="count" name="Alert Count" radius={[0, 6, 6, 0]}>
                  {alertTypeData.map((entry, idx) => (
                    <Bar key={idx} dataKey="count" fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protection Growth Timeline */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Proactive Warning Reach Progression
          </span>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
                <Line type="monotone" dataKey="usersSaved" name="Citizens Warned" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="alerts" name="Events Detected" stroke="#38bdf8" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
