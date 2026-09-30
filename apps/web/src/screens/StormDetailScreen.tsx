import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { weatherApi } from '../services/api';
import { StormCell } from '../types/weather';
import { RiskBadge } from '../components/common/RiskBadge';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { 
  Activity, ArrowRight, Clock, Compass, Gauge, 
  MapPin, ShieldAlert, TrendingUp, AlertTriangle, GitFork
} from 'lucide-react';

export const StormDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [storms, setStorms] = useState<StormCell[]>([]);
  const [activeStorm, setActiveStorm] = useState<StormCell | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStorms = async () => {
      const data = await weatherApi.getStorms();
      setStorms(data.storms);
      if (id) {
        const found = data.storms.find(s => s.id.toLowerCase() === id.toLowerCase());
        setActiveStorm(found || data.storms[0]);
      } else {
        setActiveStorm(data.storms[0]);
      }
      setLoading(false);
    };
    fetchStorms();
  }, [id]);

  if (loading || !activeStorm) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">STORM DIGITAL TWIN INSPECTOR</h1>
            <RiskBadge severity={activeStorm.severity} size="sm" />
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {activeStorm.id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time Eulerian-Lagrangian convective cell kinematic tracking & morphology analysis.
          </p>
        </div>

        {/* Storm Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {storms.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStorm(s)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition ${
                activeStorm.id === s.id
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.id} ({Math.round(s.intensity_dbz)} dBZ)
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Overview Map + Digital Twin Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map View */}
        <div className="lg:col-span-7 space-y-4">
          <InteractiveMap
            storms={[activeStorm]}
            selectedStormId={activeStorm.id}
            selectedHorizon={30}
            heightClass="h-[440px]"
          />

          {/* Morphological Event Log */}
          {activeStorm.split_merge_event && (
            <div className="glass-panel p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/20 flex items-start gap-3 text-xs">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                <GitFork className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-indigo-200">Storm Evolution & Merging Event</div>
                <p className="text-slate-300 mt-1 leading-relaxed">
                  {activeStorm.split_merge_event}. Doppler radial velocity shear signatures indicate feeder updraft ingestion.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Telemetry Cards */}
        <div className="lg:col-span-5 space-y-4">
          {/* Kinematics Card */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 text-xs">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Cell Kinematics & Physical Metrics</span>
              <span className="font-mono text-cyan-400">{activeStorm.status}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Peak Reflectivity</span>
                <span className="text-lg font-bold text-cyan-300 mt-1 block">{activeStorm.intensity_dbz} dBZ</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Echo Top Height</span>
                <span className="text-lg font-bold text-white mt-1 block">{activeStorm.vert_extent_km} km</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Propagation Speed</span>
                <span className="text-lg font-bold text-white mt-1 block">{activeStorm.speed_kmh} km/h</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Direction Vector</span>
                <span className="text-lg font-bold text-white mt-1 block">{activeStorm.direction_deg}° (ENE)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Growth Rate</span>
                <span className="text-lg font-bold text-amber-400 mt-1 block">
                  {activeStorm.growth_rate_dbz_hr > 0 ? `+${activeStorm.growth_rate_dbz_hr}` : activeStorm.growth_rate_dbz_hr} dBZ/hr
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Affected Area</span>
                <span className="text-lg font-bold text-white mt-1 block">{activeStorm.affected_area_sqkm} km²</span>
              </div>
            </div>
          </div>

          {/* Forecast Position Table */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs">
            <h4 className="font-bold text-slate-200 mb-2">Predicted Positions & Horizons</h4>
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="pb-1.5">Horizon</th>
                  <th className="pb-1.5">Coordinates</th>
                  <th className="pb-1.5">Probability</th>
                  <th className="pb-1.5 text-right">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {activeStorm.forecast_positions.map((fp) => (
                  <tr key={fp.horizon_min} className="hover:bg-slate-800/40">
                    <td className="py-2 text-cyan-400 font-bold">+{fp.horizon_min} min</td>
                    <td className="py-2 text-slate-300">{fp.lat.toFixed(2)}°N, {fp.lon.toFixed(2)}°E</td>
                    <td className="py-2 font-bold text-white">{Math.round(fp.prob * 100)}%</td>
                    <td className="py-2 text-right">
                      <RiskBadge severity={fp.severity} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
