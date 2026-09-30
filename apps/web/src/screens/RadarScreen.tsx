import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { 
  Radio, Play, Pause, RotateCcw, Layers, 
  ShieldCheck, AlertCircle, Compass, CheckCircle2
} from 'lucide-react';

export const RadarScreen: React.FC = () => {
  const [radarData, setRadarData] = useState<any>(null);
  const [selectedStation, setSelectedStation] = useState<string>("COMPOSITE");
  const [mode, setMode] = useState<"reflectivity" | "velocity">("reflectivity");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [frameIndex, setFrameIndex] = useState<number>(0);

  useEffect(() => {
    const fetchRadar = async () => {
      const data = await weatherApi.getRadar();
      setRadarData(data);
    };
    fetchRadar();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % 6);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!radarData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const frames = [
    { label: "T-25m", dbz: 42.0, time: "17:20 UTC" },
    { label: "T-20m", dbz: 46.5, time: "17:25 UTC" },
    { label: "T-15m", dbz: 51.0, time: "17:30 UTC" },
    { label: "T-10m", dbz: 54.5, time: "17:35 UTC" },
    { label: "T-5m", dbz: 57.0, time: "17:40 UTC" },
    { label: "Live (T-0m)", dbz: 58.5, time: "17:45 UTC" }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">DOPPLER WEATHER RADAR WORKSPACE</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              S/C-BAND DUAL-POL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Volumetric Doppler reflectivity (dBZ) and base radial velocity for mesocyclone shear detection.
          </p>
        </div>

        {/* Mode Selector (Reflectivity vs Velocity) */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setMode("reflectivity")}
            className={`px-3 py-1.5 rounded font-bold transition ${
              mode === "reflectivity" ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            Reflectivity (dBZ)
          </button>
          <button
            onClick={() => setMode("velocity")}
            className={`px-3 py-1.5 rounded font-bold transition ${
              mode === "velocity" ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
            }`}
          >
            Radial Velocity (m/s)
          </button>
        </div>
      </div>

      {/* Station Selector Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedStation("COMPOSITE")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
            selectedStation === "COMPOSITE"
              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10"
              : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
          }`}
        >
          National Radar Composite (All Stations)
        </button>
        {radarData.stations.map((st: any) => (
          <button
            key={st.code}
            onClick={() => setSelectedStation(st.code)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
              selectedStation === st.code
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            {st.code} • {st.name.split(" ")[0]} ({st.range_km}km)
          </button>
        ))}
      </div>

      {/* Main Radar Display Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Scope View */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden min-h-[500px]">
          {/* Radar Sweep Effect */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-cyan-500/30 flex items-center justify-center bg-[#070b14] shadow-2xl">
            {/* Concentric Range Rings */}
            <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan-500/20"></div>
            <div className="absolute w-1/2 h-1/2 rounded-full border border-cyan-500/20"></div>
            <div className="absolute w-1/4 h-1/4 rounded-full border border-cyan-500/20"></div>
            {/* Crosshairs */}
            <div className="absolute w-full h-[1px] bg-cyan-500/20"></div>
            <div className="absolute h-full w-[1px] bg-cyan-500/20"></div>

            {/* Sweep Needle */}
            <div className="absolute w-full h-full rounded-full animate-radar pointer-events-none opacity-40 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_310deg,rgba(0,240,255,0.4)_360deg)]"></div>

            {/* Storm Core Echoes Simulation */}
            <div 
              className={`absolute top-24 right-20 w-24 h-24 rounded-full filter blur-md transition-all duration-700 ${
                mode === "reflectivity" 
                  ? "bg-gradient-to-tr from-yellow-500 via-red-600 to-purple-600 opacity-80" 
                  : "bg-gradient-to-r from-red-600 via-slate-900 to-green-600 opacity-80"
              }`}
              style={{ transform: `scale(${0.9 + frameIndex * 0.05})` }}
            />
            <div 
              className="absolute bottom-28 left-20 w-16 h-16 rounded-full filter blur-md bg-gradient-to-tr from-emerald-500 to-yellow-500 opacity-70"
            />

            {/* Center Station Marker */}
            <div className="w-3 h-3 rounded-full bg-cyan-400 z-10 shadow-lg shadow-cyan-400"></div>
          </div>

          {/* Time Scrubber */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold hover:bg-cyan-400 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <div className="flex items-center gap-2">
              {frames.map((f, i) => (
                <button
                  key={f.label}
                  onClick={() => setFrameIndex(i)}
                  className={`px-3 py-1 rounded text-xs font-mono transition ${
                    frameIndex === i ? "bg-cyan-400 text-black font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Radar Station Metadata & Quality */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-xs">
            <h3 className="font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Station Metadata</span>
              <span className="font-mono text-cyan-400">Active Scan</span>
            </h3>

            <div className="space-y-2.5 font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Selected Node:</span>
                <span className="text-white font-bold">{selectedStation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Elevation Angles:</span>
                <span className="text-white">0.5°, 1.5°, 3.0°, 6.0°, 12.0°</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Max Composite dBZ:</span>
                <span className="text-amber-400 font-bold">{frames[frameIndex].dbz} dBZ</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Frame Timestamp:</span>
                <span className="text-cyan-300">{frames[frameIndex].time}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Pulse Repetition Freq:</span>
                <span className="text-slate-300">1200 Hz (Dual-PRF)</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Hydrometeor Classification (HCA)</span>
            </div>
            <p className="text-slate-300 leading-relaxed mt-1">
              Dual-polarization differential reflectivity (ZDR) and correlation coefficient (CC &lt; 0.90) indicate a mixed-phase hail core suspended at 7.2 km altitude.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
