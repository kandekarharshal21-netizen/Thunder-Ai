import React from 'react';
import { Zap, CloudLightning, Activity, ShieldCheck, ArrowUpRight } from 'lucide-react';

interface AtmoPulseProps {
  thunderProb: number;      // e.g. 0.72 (72%)
  lightningProb: number;    // e.g. 0.64 (64%)
  confidence: number;       // e.g. 0.91 (91%)
  intensity: string;        // e.g. "STRONG" | "SEVERE"
  stormStatus?: string;     // e.g. "STORM INTENSIFYING"
  lightningWindow?: string; // e.g. "18–32 min"
  trend?: string;           // e.g. "↑ Intensifying"
}

export const AtmoPulse: React.FC<AtmoPulseProps> = ({
  thunderProb = 0.72,
  lightningProb = 0.64,
  confidence = 0.91,
  intensity = "STRONG",
  stormStatus = "STORM INTENSIFYING",
  lightningWindow = "18–32 min",
  trend = "↑ Increasing"
}) => {
  const thPct = Math.round(thunderProb * 100);
  const ltPct = Math.round(lightningProb * 100);
  const confPct = Math.round(confidence * 100);

  // SVG circular arc calculations (radius 110 & 92)
  const thCircumference = 2 * Math.PI * 110;
  const thStrokeDashoffset = thCircumference - (thPct / 100) * thCircumference;

  const ltCircumference = 2 * Math.PI * 92;
  const ltStrokeDashoffset = ltCircumference - (ltPct / 100) * ltCircumference;

  const isSevere = thunderProb >= 0.70 || lightningProb >= 0.70;
  const pulseSpeed = isSevere ? '1.5s' : '3s';

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center p-6 rounded-3xl bg-[#090e1a]/95 border border-slate-800 shadow-2xl overflow-hidden select-none">
      
      {/* Background radial glow */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{
          background: isSevere ? 'radial-gradient(circle, #ef4444 0%, transparent 70%)' : 'radial-gradient(circle, #06b6d4 0%, transparent 70%)'
        }}
      />

      {/* Header Tag */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
          ATMO PULSE™ • RADIAL CONVECTIVE SYNTHESIS
        </span>
      </div>

      {/* Main Circular Intelligence Stage */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        
        {/* SVG Concentric Gauge Rings */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
          {/* Track background rings */}
          <circle
            cx="130"
            cy="130"
            r="110"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-800/80"
          />
          <circle
            cx="130"
            cy="130"
            r="92"
            stroke="currentColor"
            strokeWidth="7"
            fill="transparent"
            className="text-slate-800/60"
          />

          {/* Outer Ring: Thunderstorm Risk */}
          <circle
            cx="130"
            cy="130"
            r="110"
            stroke={isSevere ? '#ef4444' : '#f59e0b'}
            strokeWidth="8"
            strokeDasharray={thCircumference}
            strokeDashoffset={thStrokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />

          {/* Inner Ring: Lightning Risk */}
          <circle
            cx="130"
            cy="130"
            r="92"
            stroke="#06b6d4"
            strokeWidth="7"
            strokeDasharray={ltCircumference}
            strokeDashoffset={ltStrokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center: Current Atmospheric State with dynamic pulse */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          {/* Pulsing Core Ring */}
          <div 
            className="absolute w-36 h-36 rounded-full border border-cyan-500/30 animate-ping pointer-events-none opacity-40"
            style={{ animationDuration: pulseSpeed }}
          />
          
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Atmospheric State
            </span>
            <span className={`text-base sm:text-lg font-black tracking-tight leading-tight block ${
              isSevere ? 'text-red-400' : 'text-amber-400'
            }`}>
              {stormStatus}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 mt-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              {intensity}
            </span>
          </div>
        </div>

      </div>

      {/* Surrounding Telemetry Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6 text-center font-mono">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Thunderstorm</span>
          <span className="text-base font-bold text-amber-400 mt-0.5 block">{thPct}%</span>
          <span className="text-[9px] text-slate-400">{trend}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Lightning</span>
          <span className="text-base font-bold text-cyan-300 mt-0.5 block">{ltPct}%</span>
          <span className="text-[9px] text-cyan-400">{lightningWindow}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
          <span className="text-base font-bold text-emerald-400 mt-0.5 block">{confPct}%</span>
          <span className="text-[9px] text-slate-400">High Trust</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Intensity</span>
          <span className="text-base font-bold text-red-400 mt-0.5 block">{intensity}</span>
          <span className="text-[9px] text-red-300 font-bold">58.5 dBZ Peak</span>
        </div>
      </div>

    </div>
  );
};
