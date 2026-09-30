import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { SavedLocation } from '../types/weather';
import { 
  MapPin, Plus, Trash2, ShieldCheck, Bell, 
  Clock, CheckCircle2, Home, Building2, Trees, School
} from 'lucide-react';

export const SavedLocationsScreen: React.FC = () => {
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Home' | 'Farm' | 'Campus' | 'School' | 'Airport' | 'Custom'>('Farm');
  const [lat, setLat] = useState('19.14');
  const [lon, setLon] = useState('73.22');
  const [radiusKm, setRadiusKm] = useState('15');
  const [threshold, setThreshold] = useState<'ALL' | 'MODERATE_PLUS' | 'HIGH_ONLY' | 'SEVERE_ONLY'>('MODERATE_PLUS');

  const fetchLocations = async () => {
    const data = await weatherApi.getLocations();
    setLocations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await weatherApi.addLocation({
      name,
      category,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      radius_km: parseFloat(radiusKm),
      notification_threshold: threshold,
      channels: ['In-App', 'Browser Push']
    });
    setName('');
    setIsAdding(false);
    fetchLocations();
  };

  const handleDelete = async (id: string) => {
    await weatherApi.deleteLocation(id);
    fetchLocations();
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">SAVED LOCATIONS & GEOFENCED WATCH ZONES</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              GEOFENCE MONITOR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configurable hyperlocal boundary buffers for villages, schools, agricultural farms, and event sites.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Protected Zone</span>
        </button>
      </div>

      {/* Add Geofence Modal / Inline Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="glass-panel p-5 rounded-2xl border border-cyan-500/40 text-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">Configure New Geofenced Zone</h3>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">Cancel</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Zone Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., Riverside Agricultural Complex"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Farm">Farm / Agriculture</option>
                <option value="Campus">University / Campus</option>
                <option value="School">School / Institution</option>
                <option value="Home">Home Community</option>
                <option value="Airport">Airport / Helipad</option>
                <option value="Custom">Custom Facility</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Alert Radius (km)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={radiusKm}
                onChange={e => setRadiusKm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Latitude (°N)</label>
              <input
                type="number"
                step="0.001"
                value={lat}
                onChange={e => setLat(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Longitude (°E)</label>
              <input
                type="number"
                step="0.001"
                value={lon}
                onChange={e => setLon(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-slate-400 font-semibold block mb-1">Notification Threshold</label>
              <select
                value={threshold}
                onChange={e => setThreshold(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="ALL">All Advisories & Watches</option>
                <option value="MODERATE_PLUS">Moderate Risk and Higher</option>
                <option value="HIGH_ONLY">High Threat and Higher</option>
                <option value="SEVERE_ONLY">Severe Warnings Only</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition"
            >
              Save & Activate Watch Buffer
            </button>
          </div>
        </form>
      )}

      {/* Geofences List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((loc) => (
          <div key={loc.id} className="glass-panel p-5 rounded-2xl border border-slate-800 text-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {loc.category.toUpperCase()}
                </span>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="text-slate-500 hover:text-red-400 transition p-1"
                  title="Remove Geofence"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-white mt-2">{loc.name}</h3>

              <div className="space-y-1.5 font-mono text-[11px] text-slate-300 mt-3 pt-3 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Centroid:</span>
                  <span>{loc.lat}°N, {loc.lon}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Buffer Radius:</span>
                  <span className="text-cyan-300 font-bold">{loc.radius_km} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alert Trigger:</span>
                  <span className="text-amber-400 font-bold">{loc.notification_threshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Channels:</span>
                  <span className="text-slate-200">{loc.channels.join(", ")}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE WATCH
              </span>
              <a href="/map" className="text-cyan-400 hover:text-cyan-300 font-sans font-medium">View on Map →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
