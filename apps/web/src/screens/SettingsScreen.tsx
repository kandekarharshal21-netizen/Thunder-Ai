import React, { useState, useEffect } from 'react';
import { 
  Settings, Globe, Bell, MapPin, Volume2, VolumeX,
  CheckCircle2, Save, Sun, Moon, Monitor, Smartphone, RefreshCw
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { soundService } from '../services/sound';
import { notificationService } from '../services/notification';

export const SettingsScreen: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [defaultLocation, setDefaultLocation] = useState<string>(() => {
    return localStorage.getItem('thander-default-location') || 'Sangamner, Maharashtra';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => !soundService.getMuted());
  const [browserNotifications, setBrowserNotifications] = useState<boolean>(() => {
    return notificationService.getPermission() === 'granted';
  });
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => {
    return localStorage.getItem('thander-vibration') !== 'false';
  });
  const [units, setUnits] = useState<'metric' | 'nautical' | 'imperial'>(() => {
    return (localStorage.getItem('thander-units') as any) || 'metric';
  });
  const [refreshInterval, setRefreshInterval] = useState<number>(() => {
    return Number(localStorage.getItem('thander-refresh-interval')) || 30;
  });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleToggleNotifications = async (enable: boolean) => {
    if (enable) {
      const granted = await notificationService.requestPermission();
      setBrowserNotifications(granted);
    } else {
      setBrowserNotifications(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('thander-default-location', defaultLocation);
    soundService.setMuted(!soundEnabled);
    localStorage.setItem('thander-vibration', String(vibrationEnabled));
    localStorage.setItem('thander-units', units);
    localStorage.setItem('thander-refresh-interval', String(refreshInterval));

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">USER & OPERATIONAL SETTINGS</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure theme tokens, default sector, emergency warnings, audio alarms, and data synchronization.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Operational settings saved successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* 1. Theme Selection (Section 4 & 66) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between pb-2 border-b border-slate-800">
            <span>Interface Theme</span>
            <Sun className="w-3.5 h-3.5 text-cyan-400" />
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Command center high contrast' },
              { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Daylight clean visibility' },
              { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS preference' }
            ].map(item => {
              const Icon = item.icon;
              const isSelected = theme === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTheme(item.id as any)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-md shadow-cyan-500/10' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Default Sector / Location (Section 66) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between pb-2 border-b border-slate-800">
            <span>Primary Default Location</span>
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          </h3>
          <div className="text-xs space-y-2">
            <label className="text-slate-400 font-medium block">
              Default sector loaded upon initial application launch:
            </label>
            <select
              value={defaultLocation}
              onChange={e => setDefaultLocation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="Sangamner, Maharashtra">Sangamner, Maharashtra (19.576°N, 74.207°E)</option>
              <option value="Nashik, Maharashtra">Nashik, Maharashtra (19.997°N, 73.789°E)</option>
              <option value="Mumbai, Maharashtra">Mumbai, Maharashtra (19.076°N, 72.877°E)</option>
              <option value="Thane, Maharashtra">Thane, Maharashtra (19.218°N, 72.978°E)</option>
              <option value="Pune, Maharashtra">Pune, Maharashtra (18.520°N, 73.856°E)</option>
              <option value="New Delhi, Delhi NCR">New Delhi, Delhi NCR (28.613°N, 77.209°E)</option>
            </select>
          </div>
        </div>

        {/* 3, 4, 5. Alerts & Notification Dispatches (Audio, Push, Vibration) */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between pb-2 border-b border-slate-800">
            <span>Emergency Alert Dispatches (Section 31 & 66)</span>
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
          </h3>
          <div className="space-y-3 text-xs">
            {/* Audio Alert */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                <div>
                  <span className="font-bold text-white block">Alert Sound</span>
                  <span className="text-[11px] text-slate-400">Play professional synthesized acoustic tone on severe alerts (no loop)</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={e => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </label>

            {/* Browser Notifications */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="font-bold text-white block">Browser Desktop Notifications</span>
                  <span className="text-[11px] text-slate-400">Receive system notifications via Web Notifications API</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={browserNotifications}
                onChange={e => handleToggleNotifications(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </label>

            {/* Vibration */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-white block">Device Vibration</span>
                  <span className="text-[11px] text-slate-400">Haptic feedback on supported mobile devices upon severe warning</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={e => setVibrationEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* 6. Units of Measurement */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between pb-2 border-b border-slate-800">
            <span>Units of Measurement (Section 95)</span>
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'metric', label: 'Metric (Standard Indian)', desc: '°C, km/h, mm, dBZ' },
              { id: 'nautical', label: 'Aviation / Nautical', desc: 'Knots (kts), FL, NM' },
              { id: 'imperial', label: 'Imperial', desc: '°F, mph, in' }
            ].map(u => {
              const isSelected = units === u.id;
              return (
                <button
                  type="button"
                  key={u.id}
                  onClick={() => setUnits(u.id as any)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{u.label}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">{u.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Data Refresh Preference */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center justify-between pb-2 border-b border-slate-800">
            <span>Data Refresh Preference (Section 36 & 66)</span>
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          </h3>
          <div className="text-xs space-y-2">
            <label className="text-slate-400 font-medium block">
              Automated polling frequency for atmospheric telemetry:
            </label>
            <select
              value={refreshInterval}
              onChange={e => setRefreshInterval(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value={15}>Every 15 seconds (High Intensity / Radar Flash)</option>
              <option value={30}>Every 30 seconds (Standard Operational - Recommended)</option>
              <option value={60}>Every 60 seconds (API Saver / Low Bandwidth)</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Apply Operational Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
