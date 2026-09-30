import React, { useState, useEffect } from 'react';
import { InteractiveMap } from '../components/map/InteractiveMap';
import { weatherApi } from '../services/api';
import { StormCell, SavedLocation, LightningStrike, ForecastHorizon } from '../types/weather';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Layers, MapPin, Activity, Zap, Radio, CloudRain, 
  Wind, Crosshair, Eye, ShieldAlert, ArrowUpRight, Clock
} from 'lucide-react';

interface StormMapScreenProps {
  horizon: ForecastHorizon;
  onHorizonChange: (h: ForecastHorizon) => void;
  activeLocation?: string;
  activeCoords?: [number, number];
  onLocationChange?: (name: string, coords?: [number, number]) => void;
}

export const StormMapScreen: React.FC<StormMapScreenProps> = ({
  horizon,
  onHorizonChange,
  activeLocation = "Sangamner, Maharashtra",
  activeCoords = [19.5761, 74.2070],
  onLocationChange
}) => {
  const [storms, setStorms] = useState<StormCell[]>([]);
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [strikes, setStrikes] = useState<LightningStrike[]>([]);
  const [selectedStorm, setSelectedStorm] = useState<StormCell | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [sData, locData, lData] = await Promise.all([
        weatherApi.getStorms(),
        weatherApi.getLocations(),
        weatherApi.getLightning()
      ]);
      setStorms(sData.storms);
      setLocations(locData);
      setStrikes(lData.recent_strikes);
      if (sData.storms.length > 0) {
        setSelectedStorm(sData.storms[0]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-[1720px] mx-auto">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">FULL GEOSPATIAL STORM INTELLIGENCE</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              LAYER SYNTHESIS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive multi-layer geospatial digital twin tracking storm trajectories and convective initiation.
          </p>
        </div>

        {/* Forecast Horizon Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 px-2 font-mono">Horizon:</span>
          {([15, 30, 60, 90] as ForecastHorizon[]).map(h => (
            <button
              key={h}
              onClick={() => onHorizonChange(h)}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer ${
                horizon === h ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              +{h}m
            </button>
          ))}
        </div>
      </div>

      {/* Main Map with Full Height */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Canvas */}
        <div className="lg:col-span-9">
          <InteractiveMap
            storms={storms}
            selectedStormId={selectedStorm?.id}
            onSelectStorm={(s) => setSelectedStorm(s)}
            savedLocations={locations}
            lightningStrikes={strikes}
            selectedHorizon={horizon}
            heightClass="h-[640px] lg:h-[720px]"
            centerCoords={activeCoords}
            onLocationChange={onLocationChange}
            activeLocationName={activeLocation}
          />
        </div>

        {/* Right Inspector & Storm Selector */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Storm Selector */}
          <div className="glass-panel p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
              <span>Tracked Storm Cells</span>
              <span className="font-mono text-cyan-400">{storms.length} Active</span>
            </h3>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {storms.map((cell) => {
                const isSelected = selectedStorm?.id === cell.id;
                return (
                  <div
                    key={cell.id}
                    onClick={() => setSelectedStorm(cell)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white">{cell.id}</span>
                      <RiskBadge severity={cell.severity} size="sm" />
                    </div>
                    <div className="text-[11px] font-medium text-slate-300 mt-1 truncate">{cell.name}</div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1.5">
                      <span className="text-cyan-400 font-bold">{cell.intensity_dbz} dBZ</span>
                      <span>{cell.speed_kmh} km/h @ {cell.direction_deg}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Storm Detail Inspector */}
          {selectedStorm && (
            <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white">Digital Twin Telemetry</span>
                <span className="font-mono text-[10px] text-cyan-400">{selectedStorm.status}</span>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Centroid Coordinates:</span>
                  <span className="text-white">{selectedStorm.lat.toFixed(2)}°N, {selectedStorm.lon.toFixed(2)}°E</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Peak Echo Top:</span>
                  <span className="text-white">{selectedStorm.vert_extent_km} km</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Affected Polygon Area:</span>
                  <span className="text-white">{selectedStorm.affected_area_sqkm} km²</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Growth / Decay Trend:</span>
                  <span className="text-amber-300">+{selectedStorm.growth_rate_dbz_hr} dBZ/hr</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">First Detection:</span>
                  <span className="text-slate-300">{selectedStorm.first_seen.substring(11, 16)} UTC</span>
                </div>
              </div>

              {selectedStorm.split_merge_event && (
                <div className="p-2 rounded bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-300">
                  <b>Event Log:</b> {selectedStorm.split_merge_event}
                </div>
              )}

              <a
                href="/storms"
                className="block text-center py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition"
              >
                Inspect Full Storm Trajectory →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
