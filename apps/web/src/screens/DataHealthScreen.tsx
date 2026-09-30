import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { SystemHealthReport } from '../types/weather';
import { 
  HeartPulse, CheckCircle2, AlertTriangle, XCircle, 
  RotateCcw, Sliders, ShieldCheck, Cpu, Database, Radio
} from 'lucide-react';

export const DataHealthScreen: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    const data = await weatherApi.getDataHealth();
    setHealth(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleToggle = async (sourceType: string, currentStatus: string) => {
    await weatherApi.toggleSourceHealth(sourceType, currentStatus !== 'Online');
    await fetchHealth();
  };

  if (loading || !health) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isDegraded = health.missing_sources.length > 0;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">SENSOR DATA HEALTH & SELF-HEALING PIPELINE</h1>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              !isDegraded ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {health.overall_status.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time connector telemetry, missing-data masks, and automatic graceful degradation to reduced-input pathways.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 hover:text-cyan-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Ingestors</span>
        </button>
      </div>

      {/* Dynamic System Banner */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
        !isDegraded
          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${!isDegraded ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-sm text-white">System State: {health.overall_status}</div>
            <div className="text-xs mt-0.5 text-slate-300">
              Active Model Pathway: <b className="text-cyan-300 font-mono">{health.active_pathway}</b>
              {health.confidence_penalty > 0 && (
                <span className="text-amber-400 ml-2 font-mono">
                  (Confidence Penalty Applied: -{Math.round(health.confidence_penalty * 100)}%)
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Aggregate Quality Score</span>
            <span className="text-xl font-bold text-white">{health.system_quality_score}%</span>
          </div>
        </div>
      </div>

      {/* Sources Health Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Multimodal Ingest Connectors ({health.adapters.length})
          </h3>
          <span className="text-[10px] text-slate-400">Click actions below to simulate connector failure / self-healing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                <th className="pb-2.5">Feed Connector</th>
                <th className="pb-2.5">Type</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Freshness</th>
                <th className="pb-2.5">Quality</th>
                <th className="pb-2.5">Pipeline Action</th>
                <th className="pb-2.5 text-right">Fault Simulation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {health.adapters.map((src) => {
                const isOnline = src.status === 'Online';
                return (
                  <tr key={src.name} className="hover:bg-slate-800/30">
                    <td className="py-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>{src.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{src.type}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isOnline ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {src.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{src.freshness_min} min</td>
                    <td className="py-3 font-bold text-cyan-300">{src.quality_pct}%</td>
                    <td className="py-3 text-slate-300">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        isOnline ? 'bg-slate-800 text-slate-300' : 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
                      }`}>
                        {src.action}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleToggle(src.type, src.status)}
                        className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer ${
                          isOnline
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        }`}
                      >
                        {isOnline ? 'Simulate Outage' : 'Heal Connector'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Self-Healing Architecture Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="font-bold text-white flex items-center gap-1.5 mb-2">
            <RotateCcw className="w-4 h-4 text-cyan-400" /> Exponential Backoff Retry
          </div>
          <p className="text-slate-400 leading-relaxed">
            Transient connector timeouts automatically trigger retry intervals at 2s, 4s, 8s, and 16s before engaging cache fallbacks.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="font-bold text-white flex items-center gap-1.5 mb-2">
            <Database className="w-4 h-4 text-blue-400" /> Missing-Data Masking
          </div>
          <p className="text-slate-400 leading-relaxed">
            When a sensor drops, a binary missingness vector is injected into the multimodal fusion tensor, preventing NaN propagation.
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <div className="font-bold text-white flex items-center gap-1.5 mb-2">
            <Cpu className="w-4 h-4 text-amber-400" /> Reduced-Input Pathways
          </div>
          <p className="text-slate-400 leading-relaxed">
            The prediction engine dynamically falls back to satellite-atmospheric heuristics if Doppler radar feeds become unavailable.
          </p>
        </div>
      </div>
    </div>
  );
};
