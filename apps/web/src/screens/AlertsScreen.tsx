import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { WeatherAlert } from '../types/weather';
import { AlertCard } from '../components/common/AlertCard';
import { 
  ShieldAlert, CheckCircle2, Clock, Bell, Volume2, 
  Settings, Filter, Plus, Send, AlertTriangle
} from 'lucide-react';

export const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'severe' | 'lightning' | 'thunderstorm'>('all');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    const data = await weatherApi.getAlerts();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'active') return a.status === 'active';
    if (filter === 'severe') return a.severity === 'SEVERE' || a.severity === 'EXTREME';
    if (filter === 'lightning') return a.title.toLowerCase().includes('lightning') || a.reason?.toLowerCase().includes('lightning');
    if (filter === 'thunderstorm') return a.title.toLowerCase().includes('thunder') || a.title.toLowerCase().includes('storm');
    return true;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">ALERT MANAGEMENT & GEOFENCED NOTIFICATION CENTER</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
              AUDITED LIFECYCLE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active warnings, historical alerts, and explainable convective triggers with complete operator audit traceability.
          </p>
        </div>

        {/* Section 35 Filter Controls: All, Active, Severe, Lightning, Thunderstorm */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filter === 'all' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filter === 'active' ? 'bg-red-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Active ({alerts.filter(a => a.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('severe')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filter === 'severe' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Severe ({alerts.filter(a => a.severity === 'SEVERE' || a.severity === 'EXTREME').length})
          </button>
          <button
            onClick={() => setFilter('lightning')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filter === 'lightning' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Lightning
          </button>
          <button
            onClick={() => setFilter('thunderstorm')}
            className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${filter === 'thunderstorm' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            Thunderstorm
          </button>
        </div>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-xl border border-slate-800 text-slate-400 text-xs">
            No alerts currently in this state.
          </div>
        ) : (
          filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledged={fetchAlerts}
              compact={false}
            />
          ))
        )}
      </div>

      {/* Safety Policy & Official Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200 block mb-1">Non-Negotiable Product Safety Principle</span>
          THANDER AI never fabricates official meteorological warnings or emergency evacuation instructions. All directives displayed in this interface are generated from calibrated automated sensor thresholds. Official statutory directives are governed exclusively by IMD and NDMA authorities.
        </div>
      </div>
    </div>
  );
};
