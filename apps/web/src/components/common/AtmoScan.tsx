import React from 'react';
import { 
  Zap, Compass, ShieldAlert, Radio, Activity, Eye, Maximize2 
} from 'lucide-react';
import { StormCell, ForecastHorizon } from '../../types/weather';

interface AtmoScanProps {
  storm?: StormCell | null;
  lightningRate?: number;
  confidence?: number;
  horizon?: ForecastHorizon;
  className?: string;
}

export const AtmoScan: React.FC<AtmoScanProps> = ({
  storm,
  lightningRate = 42.8,
  confidence = 0.94,
  horizon = 30,
  className = ''
}) => {
  const intensity = storm?.intensity_dbz || 58.5;
  const direction = storm?.direction_deg || 65;
  const speed = storm?.speed_kmh || 46;

  // Status colors based on SECURA palette integration
  const isSevere = intensity >= 50;
  const accentColor = isSevere ? '#9E3F45' : intensity >= 40 ? '#D6C09A' : '#718B78';

  return (
    <div className={`glass-panel p-5 rounded-2xl border border-slate-800 text-xs relative overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <span className="font-extrabold text-white uppercase tracking-wider font-mono text-xs">
            ATMO-SCAN™ RADIAL INTELLIGENCE
          </span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
          +{horizon}m HORIZON
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Polar Radial Scanner Display */}
        <div className="md:col-span-6 flex justify-center py-2">
          <div className="relative w-56 h-56 rounded-full border border-cyan-500/30 bg-[#060913] flex items-center justify-center shadow-2xl shadow-cyan-950/40">
            {/* Range Rings */}
            <div className="absolute w-44 h-44 rounded-full border border-slate-800/80"></div>
            <div className="absolute w-32 h-32 rounded-full border border-slate-800/80"></div>
            <div className="absolute w-16 h-16 rounded-full border border-cyan-500/20"></div>

            {/* Compass Axis Lines */}
            <div className="absolute w-full h-[1px] bg-slate-800/80"></div>
            <div className="absolute h-full w-[1px] bg-slate-800/80"></div>

            {/* Range markers */}
            <span className="absolute top-1 text-[8px] font-mono text-slate-500">0° N</span>
            <span className="absolute right-2 text-[8px] font-mono text-slate-500">90° E</span>
            <span className="absolute bottom-1 text-[8px] font-mono text-slate-500">180° S</span>
            <span className="absolute left-2 text-[8px] font-mono text-slate-500">270° W</span>

            {/* Radar Sweep Beam */}
            <div className="absolute w-full h-full rounded-full animate-radar pointer-events-none opacity-40 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_310deg,rgba(0,240,255,0.5)_360deg)]"></div>

            {/* Storm Core Echo on Polar coordinates */}
            <div
              className="absolute w-14 h-14 rounded-full filter blur-md opacity-85 transition-all duration-700"
              style={{
                top: '25%',
                right: '25%',
                backgroundColor: isSevere ? '#ef4444' : '#f59e0b',
                boxShadow: `0 0 20px ${isSevere ? '#ef4444' : '#f59e0b'}`
              }}
            />

            {/* Secondary convective cluster */}
            <div
              className="absolute w-8 h-8 rounded-full filter blur-sm opacity-70 bg-amber-400"
              style={{ bottom: '30%', left: '28%' }}
            />

            {/* Dynamic Vector Arrow pointing storm propagation */}
            <div
              className="absolute w-24 h-[2px] bg-cyan-400 origin-left flex items-center justify-end"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${direction - 90}deg)`
              }}
            >
              <div className="w-2 h-2 border-t-2 border-r-2 border-cyan-400 transform rotate-45 -mr-1"></div>
            </div>

            {/* Centroid Bullseye */}
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-black z-10 shadow-lg shadow-cyan-400 animate-pulse"></div>
          </div>
        </div>

        {/* Telemetry Breakdown Details */}
        <div className="md:col-span-6 space-y-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" /> Core Reflectivity
            </span>
            <span className="text-base font-bold text-white">
              {intensity} <span className="text-xs text-cyan-300">dBZ</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Lightning Rate
            </span>
            <span className="text-base font-bold text-amber-400">
              {lightningRate} <span className="text-xs text-slate-400">/min</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> Kinematic Track
            </span>
            <span className="text-sm font-bold text-slate-200">
              {speed} km/h @ {direction}°
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> AI Epistemic Conf.
            </span>
            <span className="text-base font-bold text-emerald-400">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
