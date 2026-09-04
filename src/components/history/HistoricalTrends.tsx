import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';
import { Calendar, TrendingUp, PieChart as PieIcon, BarChart2, Filter } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

export const HistoricalTrends: React.FC = () => {
  const { location } = useWeather();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Realistic historical telemetry dataset for demonstration
  const weekData = [
    { day: 'Mon', maxTemp: 32, minTemp: 24, rainfall: 4.2, humidity: 76, risk: 35 },
    { day: 'Tue', maxTemp: 33, minTemp: 25, rainfall: 0.0, humidity: 68, risk: 20 },
    { day: 'Wed', maxTemp: 31, minTemp: 24, rainfall: 12.8, humidity: 82, risk: 55 },
    { day: 'Thu', maxTemp: 29, minTemp: 23, rainfall: 38.4, humidity: 91, risk: 78 },
    { day: 'Fri', maxTemp: 30, minTemp: 23, rainfall: 22.0, humidity: 86, risk: 62 },
    { day: 'Sat', maxTemp: 32, minTemp: 24, rainfall: 2.1, humidity: 74, risk: 30 },
    { day: 'Sun', maxTemp: 33, minTemp: 25, rainfall: 0.0, humidity: 69, risk: 18 }
  ];

  const monthData = [
    { day: 'Wk 1', maxTemp: 34, minTemp: 26, rainfall: 12.0, humidity: 68, risk: 25 },
    { day: 'Wk 2', maxTemp: 33, minTemp: 25, rainfall: 45.0, humidity: 84, risk: 65 },
    { day: 'Wk 3', maxTemp: 31, minTemp: 24, rainfall: 88.0, humidity: 92, risk: 82 },
    { day: 'Wk 4', maxTemp: 32, minTemp: 25, rainfall: 28.0, humidity: 76, risk: 45 }
  ];

  const activeDataset = timeRange === 'week' ? weekData : monthData;

  const conditionDistribution = [
    { name: 'Sunny / Clear', value: 38, color: '#38bdf8' },
    { name: 'Partly Cloudy', value: 27, color: '#818cf8' },
    { name: 'Rain Showers', value: 24, color: '#0ea5e9' },
    { name: 'Severe Storm', value: 11, color: '#f43f5e' }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 45, color: '#10b981' },
    { name: 'Moderate Risk', value: 30, color: '#f59e0b' },
    { name: 'High Risk', value: 18, color: '#f97316' },
    { name: 'Extreme Risk', value: 7, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header & Range Selector */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-brand-400" />
            <span>Historical Weather & Risk Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">
            Telemetry trends and hazard frequency for {location.city}, {location.state}
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${timeRange === 'week' ? 'bg-brand-500/20 text-brand-300' : 'text-slate-400'}`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${timeRange === 'month' ? 'bg-brand-500/20 text-brand-300' : 'text-slate-400'}`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Row 1: Temperature & Rainfall Accumulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Temperature Trend Line Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-400" />
            <span>Temperature Trend (°C Max vs Min)</span>
          </span>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeDataset}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 3', 'dataMax + 3']} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
                <Legend />
                <Line type="monotone" dataKey="maxTemp" name="Max Temp (°C)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="minTemp" name="Min Temp (°C)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rainfall Accumulation Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>Precipitation Accumulation (mm)</span>
          </span>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeDataset}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
                <Bar dataKey="rainfall" name="Rainfall (mm)" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Row 2: Distribution Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Weather Condition Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-brand-400" />
            <span>Weather Condition Distribution (%)</span>
          </span>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conditionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {conditionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disaster Risk Level Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-red-400" />
            <span>Hazard Risk Level Proportion (%)</span>
          </span>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-risk-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
