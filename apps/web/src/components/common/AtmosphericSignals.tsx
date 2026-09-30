import React from 'react';
import { 
  Droplets, Zap, Gauge, Wind, CloudRain, Cloud, Activity, 
  TrendingUp, TrendingDown, ArrowRight
} from 'lucide-react';

interface AtmosphericSignalsProps {
  humidity: number;        // e.g. 74 (%)
  cape: number;            // e.g. 2840 (J/kg)
  pressure: number;        // e.g. 1004.8 (hPa)
  windSpeed: number;       // e.g. 26 (km/h)
  precip: number;          // e.g. 8.5 (mm)
  cloudCover: number;      // e.g. 78 (%)
  instabilityIndex?: string; // e.g. "Lifted Index -6.8"
  momentumState?: 'DEVELOPING' | 'INTENSIFYING' | 'STABLE' | 'WEAKENING' | 'DISSIPATING';
  momentumText?: string;
}

export const AtmosphericSignals: React.FC<AtmosphericSignalsProps> = ({
  humidity = 74,
  cape = 2840,
  pressure = 1004.8,
  windSpeed = 26.4,
  precip = 8.5,
  cloudCover = 78,
  instabilityIndex = "LI: -6.8 (High)",
  momentumState = "INTENSIFYING",
  momentumText = "Rapid intensification detected (+14.2 dBZ/hr core reflectivity surge)"
}) => {
  // Classify each signal into LOW / MODERATE / HIGH
  const getLevel = (type: string, val: number): { level: 'LOW' | 'MODERATE' | 'HIGH'; color: string } => {
    switch (type) {
      case 'cape':
        if (val > 2500) return { level: 'HIGH', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
        if (val > 1200) return { level: 'MODERATE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        return { level: 'LOW', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'humidity':
        if (val > 70) return { level: 'HIGH', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
        if (val > 50) return { level: 'MODERATE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        return { level: 'LOW', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'precip':
        if (val > 10) return { level: 'HIGH', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
        if (val > 2) return { level: 'MODERATE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        return { level: 'LOW', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'wind':
        if (val > 35) return { level: 'HIGH', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
        if (val > 18) return { level: 'MODERATE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        return { level: 'LOW', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'cloud':
        if (val > 75) return { level: 'HIGH', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
        if (val > 45) return { level: 'MODERATE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
        return { level: 'LOW', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      default:
        return { level: 'MODERATE', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    }
  };

  const signals = [
    { name: "Humidity", icon: Droplets, valStr: `${humidity}%`, ...getLevel('humidity', humidity) },
    { name: "CAPE Buoyancy", icon: Zap, valStr: `${cape} J/kg`, ...getLevel('cape', cape) },
    { name: "Pressure", icon: Gauge, valStr: `${pressure} hPa`, level: pressure < 1005 ? 'HIGH' : 'LOW', color: pressure < 1005 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { name: "Wind Velocity", icon: Wind, valStr: `${windSpeed} km/h`, ...getLevel('wind', windSpeed) },
    { name: "Precipitation", icon: CloudRain, valStr: `${precip} mm/h`, ...getLevel('precip', precip) },
    { name: "Cloud Density", icon: Cloud, valStr: `${cloudCover}%`, ...getLevel('cloud', cloudCover) },
    { name: "Instability", icon: Activity, valStr: instabilityIndex, level: 'HIGH' as const, color: 'bg-red-500/20 text-red-300 border-red-500/30' }
  ];

  return (
    <div className="p-4 rounded-2xl bg-[#090e1a] border border-slate-800 space-y-3.5 select-none">
      {/* Top Momentum Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Storm Momentum:
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-red-400" />
            {momentumState}
          </span>
        </div>
        <span className="text-[11px] text-slate-300 font-mono">
          {momentumText}
        </span>
      </div>

      {/* Atmospheric Signal Grid */}
      <div>
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
          Atmospheric Signals (Why AI Predicts Storm Risk)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {signals.map((sig) => {
            const Icon = sig.icon;
            return (
              <div 
                key={sig.name}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${sig.color}`}>
                    {sig.level}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">{sig.name}</span>
                  <span className="text-xs font-mono font-bold text-white mt-0.5 block truncate">
                    {sig.valStr}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
