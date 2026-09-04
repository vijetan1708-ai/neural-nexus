import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Layers, Thermometer, CloudRain, Wind, Cloud, ShieldAlert, Crosshair, MapPin } from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { useAlert } from '../../context/AlertContext';

// Fix default Leaflet icon paths in bundler environments
const customIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `<div style="background-color: #0284c7; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px #38bdf8; display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

// Click-to-inspect helper component
function MapClickInspector({ onCoordinateClick }: { onCoordinateClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onCoordinateClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export const WeatherMap: React.FC = () => {
  const { location, currentWeather, riskAssessment, changeLocation } = useWeather();
  const { alerts } = useAlert();

  const [activeLayers, setActiveLayers] = useState({
    temperature: true,
    rain: true,
    wind: true,
    clouds: false,
    alertZones: true
  });

  const [inspectedPoint, setInspectedPoint] = useState<{ lat: number; lon: number } | null>(null);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const handleCoordinateClick = (lat: number, lon: number) => {
    setInspectedPoint({ lat: Number(lat.toFixed(4)), lon: Number(lon.toFixed(4)) });
  };

  const handleInspectLocation = () => {
    if (inspectedPoint) {
      changeLocation({
        city: `Lat ${inspectedPoint.lat.toFixed(2)}, Lon ${inspectedPoint.lon.toFixed(2)}`,
        district: 'Regional District',
        state: 'India',
        country: 'India',
        latitude: inspectedPoint.lat,
        longitude: inspectedPoint.lon,
        isGPS: false
      });
      setInspectedPoint(null);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      
      {/* Map Control Toolbar */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-400" />
          <h2 className="text-sm font-bold text-white">Interactive Weather & Disaster Map</h2>
          <span className="text-[10px] text-slate-400 hidden md:inline">
            (Click anywhere on map to inspect coordinates)
          </span>
        </div>

        {/* Toggle Layers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => toggleLayer('temperature')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              activeLayers.temperature
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Thermometer className="w-3 h-3" />
            <span>Temperature</span>
          </button>

          <button
            onClick={() => toggleLayer('rain')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              activeLayers.rain
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <CloudRain className="w-3 h-3" />
            <span>Rain Radar</span>
          </button>

          <button
            onClick={() => toggleLayer('wind')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              activeLayers.wind
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Wind Vectors</span>
          </button>

          <button
            onClick={() => toggleLayer('alertZones')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              activeLayers.alertZones
                ? 'bg-red-500/20 text-red-300 border-red-500/40 font-bold'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            <ShieldAlert className="w-3 h-3" />
            <span>Alert Zones</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 relative z-10 w-full min-h-[400px]">
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={9}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ minHeight: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickInspector onCoordinateClick={handleCoordinateClick} />

          {/* User Location Center Marker */}
          <Marker position={[location.latitude, location.longitude]} icon={customIcon}>
            <Popup>
              <div className="p-1 text-slate-900 text-xs">
                <strong className="block text-sm">{location.city}</strong>
                <p>{currentWeather.temperature}°C • {currentWeather.condition}</p>
                <p className="font-bold text-red-600">Risk Score: {riskAssessment.score}/100 ({riskAssessment.level})</p>
                <p className="text-[10px] text-slate-600">Rain: {currentWeather.rainProbability}% | Wind: {currentWeather.windSpeed} km/h</p>
              </div>
            </Popup>
          </Marker>

          {/* Simulated Temperature / Heat Radial Halo */}
          {activeLayers.temperature && (
            <Circle
              center={[location.latitude, location.longitude]}
              radius={currentWeather.temperature > 38 ? 35000 : 20000}
              pathOptions={{
                color: currentWeather.temperature > 38 ? '#ef4444' : '#f59e0b',
                fillColor: currentWeather.temperature > 38 ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.15,
                weight: 1
              }}
            />
          )}

          {/* Simulated Rain Radar Doppler Arc */}
          {activeLayers.rain && currentWeather.rainProbability > 40 && (
            <Circle
              center={[location.latitude + 0.08, location.longitude + 0.05]}
              radius={currentWeather.rainProbability > 70 ? 45000 : 25000}
              pathOptions={{
                color: '#0284c7',
                fillColor: '#0284c7',
                fillOpacity: 0.22,
                dashArray: '5, 5',
                weight: 1.5
              }}
            />
          )}

          {/* Active Disaster Alert Zones */}
          {activeLayers.alertZones && alerts.length > 0 && (
            <Circle
              center={[location.latitude, location.longitude]}
              radius={riskAssessment.score >= 80 ? 55000 : 30000}
              pathOptions={{
                color: '#dc2626',
                fillColor: '#dc2626',
                fillOpacity: 0.25,
                weight: 2
              }}
            />
          )}

          {/* Inspected Coordinate Marker */}
          {inspectedPoint && (
            <Marker position={[inspectedPoint.lat, inspectedPoint.lon]}>
              <Popup>
                <div className="p-1 text-slate-900 text-xs">
                  <strong className="block text-sm">Inspected Coordinates</strong>
                  <p className="font-mono text-slate-700">{inspectedPoint.lat}°N, {inspectedPoint.lon}°E</p>
                  <button
                    onClick={handleInspectLocation}
                    className="mt-2 w-full px-2 py-1 rounded bg-blue-600 text-white font-bold text-xs"
                  >
                    Load Weather for Point
                  </button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 p-3 rounded-xl bg-slate-900/90 border border-slate-700 shadow-xl backdrop-blur-md text-[11px] text-slate-300 space-y-1.5 hidden sm:block">
          <span className="font-bold text-white block text-xs">Doppler & Hazard Legend</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500" />
            <span>Severe Warning Zone ({riskAssessment.score >= 60 ? 'Active' : 'Standby'})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-500" />
            <span>Precipitation Cloud Cluster</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-500" />
            <span>Thermal Gradient Halo</span>
          </div>
        </div>

      </div>
    </div>
  );
};
