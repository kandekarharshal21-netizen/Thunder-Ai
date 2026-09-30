import React, { useState } from 'react';
import { HeartPulse, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Sliders } from 'lucide-react';
import { DataSourceHealth } from '../../types/weather';
import { weatherApi } from '../../services/api';

interface DataHealthCardProps {
  adapters: DataSourceHealth[];
  qualityScore: number;
  activePathway: string;
  onRefresh?: () => void;
}

export const DataHealthCard: React.FC<DataHealthCardProps> = ({
  adapters,
  qualityScore,
  activePathway,
  onRefresh
}) => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleToggle = async (sourceType: string, currentStatus: string) => {
    setIsSimulating(true);
    await weatherApi.toggleSourceHealth(sourceType, currentStatus !== 'Online');
    setIsSimulating(false);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">Sensor Health & Self-Healing</h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-emerald-400">
          <span>{qualityScore}%</span>
          <span className="text-[10px] text-slate-400 font-normal">Quality Score</span>
        </div>
      </div>

      {/* Active Pipeline Pathway */}
      <div className="mt-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Pipeline Pathway</span>
          <span className="text-xs font-mono font-semibold text-cyan-300">{activePathway}</span>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
      </div>

      {/* Sources Mini List */}
      <div className="mt-3 space-y-2">
        {adapters.map((src) => {
          const isOnline = src.status === 'Online';
          return (
            <div
              key={src.name}
              className="p-2 rounded-lg bg-slate-900/40 border border-slate-800/80 flex items-center justify-between group hover:border-slate-700 transition"
            >
              <div className="flex items-center gap-2 min-w-0">
                {isOnline ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <div className="truncate">
                  <div className="text-[11px] font-medium text-slate-200 truncate">{src.type}</div>
                  <div className="text-[9px] font-mono text-slate-400">{src.freshness_min}m ago • {src.quality_pct}%</div>
                </div>
              </div>

              {/* Real-time self healing toggle button */}
              <button
                disabled={isSimulating}
                onClick={() => handleToggle(src.type, src.status)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition ${
                  isOnline
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40'
                    : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-emerald-500/20 hover:text-emerald-300'
                }`}
                title="Click to simulate connector failure / recovery"
              >
                {isOnline ? 'ONLINE (Kill)' : 'OFFLINE (Heal)'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
        <span className="text-slate-400">Click button above to test graceful degradation</span>
        <a href="/data-health" className="text-cyan-400 hover:text-cyan-300 font-medium">Full Diagnostics →</a>
      </div>
    </div>
  );
};
