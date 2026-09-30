import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { 
  Zap, Activity, Clock, ShieldAlert, TrendingUp, 
  MapPin, Radio, Compass, Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

export const LightningScreen: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeWindow, setTimeWindow] = useState<'10m' | '30m' | '60m'>('10m');

  useEffect(() => {
    const fetchLightning = async () => {
      const res = await weatherApi.getLightning();
      setData(res);
      setLoading(false);
    };
    fetchLightning();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">LIGHTNING INTELLIGENCE & CLUSTER WORKSPACE</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              WWLLN / TLN SENSORS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time strike polarity differentiation (-CG / +CG / IC), strike rate progression, and cluster centroid mapping.
          </p>
        </div>

        {/* Time Window Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 px-2">Window:</span>
          {(['10m', '30m', '60m'] as const).map(w => (
            <button
              key={w}
              onClick={() => setTimeWindow(w)}
              className={`px-3 py-1 rounded transition ${
                timeWindow === w ? 'bg-amber-400 text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Strikes (Last {timeWindow})</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">
            {data.summary.strikes_10m}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">
            Activity: Severe Outbreak
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Strike Rate</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-2">
            {data.summary.strike_rate_per_min} <span className="text-xs text-slate-400">/min</span>
          </div>
          <div className="text-[10px] font-mono text-amber-400 mt-1">
            Accelerating (+18.4% in 15m)
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Polarity Distribution</span>
            <Filter className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-mono font-bold text-slate-200 mt-2">
            -CG: {data.summary.negative_cg_pct}% • +CG: {data.summary.positive_cg_pct}%
          </div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">
            Intra-Cloud (IC): {data.summary.intra_cloud_pct}%
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>First-Flash Marker</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-mono font-bold text-emerald-300 mt-2">
            DETECTED @ 17:28 UTC
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Preceded severe radar echo by 14m
          </div>
        </div>
      </div>

      {/* Strike Trend Chart & Cluster Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Chart (strikes/min) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Temporal Strike Rate Trend (Strikes / Minute)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">10-Minute Moving Window</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend_history}>
                <defs>
                  <linearGradient id="strikeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="strikes_per_min" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#strikeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cluster Centroids */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Detected Lightning Clusters ({data.clusters.length})
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">DBSCAN Spatial Cluster</span>
          </div>

          <div className="space-y-3 mt-3">
            {data.clusters.map((cl: any) => (
              <div key={cl.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    {cl.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    {cl.activity_level}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] font-mono text-slate-300">
                  <div>
                    <span className="text-[9px] text-slate-400 block">Centroid</span>
                    {cl.center_lat}°N, {cl.center_lon}°E
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Radius</span>
                    {cl.radius_km} km
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">Strikes</span>
                    <span className="text-cyan-300 font-bold">{cl.strike_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent High-Energy Ground Strikes Table */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
          Recent Ground Flash Precision Log (WWLLN / TLN)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <th className="pb-2">Strike ID</th>
                <th className="pb-2">Timestamp (UTC)</th>
                <th className="pb-2">Polarity Type</th>
                <th className="pb-2">Peak Current (kA)</th>
                <th className="pb-2">Coordinates</th>
                <th className="pb-2 text-right">Distance to Sensor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.recent_strikes.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="py-2 text-amber-400 font-bold">{s.id}</td>
                  <td className="py-2 text-slate-300">{s.timestamp}</td>
                  <td className="py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.polarity.includes('+') ? 'bg-yellow-500/20 text-yellow-300' :
                      s.polarity.includes('IC') ? 'bg-purple-500/20 text-purple-300' :
                      'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {s.polarity}
                    </span>
                  </td>
                  <td className="py-2 font-bold text-white">{s.peak_current_ka} kA</td>
                  <td className="py-2 text-slate-300">{s.lat.toFixed(2)}°N, {s.lon.toFixed(2)}°E</td>
                  <td className="py-2 text-right text-slate-400">{s.distance_km} km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
