export type AlertSeverity = 'info' | 'watch' | 'alert' | 'warning'; 
// IMD Color Standards:
// info = 🟢 Green (No Warning)
// watch = 🟡 Yellow (Be Updated)
// alert = 🟠 Orange (Be Prepared)
// warning = 🔴 Red (Take Action / Extreme Warning)

export type AlertSourceType = 'official_imd' | 'ai_prediction' | 'demo_simulated';

export interface WeatherAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  sourceType: AlertSourceType;
  sourceName: string; // e.g. "India Meteorological Department (IMD)" or "WeatherGPT Predictive Model"
  location: string;
  affectedDistricts: string[];
  issuedAt: string;
  expiresAt: string;
  instructions: string[];
  isDemo: boolean;
  hazardType: 'cyclone' | 'flood' | 'heavy_rain' | 'heatwave' | 'thunderstorm' | 'high_winds' | 'general';
}

export interface ProactiveNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'rain_alert' | 'heat_alert' | 'storm_alert' | 'forecast_delta' | 'official_warning';
  severity: AlertSeverity;
  sourceType: AlertSourceType;
  actionUrl?: string;
  actionText?: string;
}
