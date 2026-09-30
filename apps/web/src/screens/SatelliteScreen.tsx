import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { CloudRain, Play, Pause, Thermometer, Wind, Eye, Compass, Info } from 'lucide-react';

export const SatelliteScreen: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [activeChannel, setActiveChannel] = useState<string>("Thermal IR (10.8µm)");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [frame, setFrame] = useState<number>(3);

  useEffect(() => {
    const fetchSat = async () => {
      const res = await weatherApi.getSatellite();
      setData(res);
    };
    fetchSat();
  }, []);

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const frames = [
    { label: "17:15 UTC", minTemp: -58.2, trend: "-12.0°C/hr" },
    { label: "17:30 UTC", minTemp: -64.5, trend: "-15.4°C/hr" },
    { label: "17:40 UTC", minTemp: -69.0, trend: "-17.8°C/hr" },
    { label: "17:45 UTC (Latest)", minTemp: -72.4, trend: "-18.5°C/hr" }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">INSAT-3D SATELLITE CONVECTIVE WORKSPACE</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              GEOSTATIONARY IR / VIS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cloud-top brightness temperature tracking, rapid cooling rates, and convective overshooting tops detection.
          </p>
        </div>

        {/* Channel Selector */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {["Thermal IR (10.8µm)", "Visible (0.6µm)", "Water Vapor (6.7µm)", "Convective Storm RGB"].map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannel(ch)}
              className={`px-3 py-1.5 rounded-lg border font-bold transition ${
                activeChannel === ch
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/10"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Main Satellite Visualizer Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Visual Card */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[480px] relative overflow-hidden">
          {/* Simulated Satellite Frame */}
          <div className="relative w-full h-80 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-black"></div>
            
            {/* Deep Convective Cloud Top Blob */}
            <div 
              className="w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-700 via-purple-600 to-rose-500 opacity-80 filter blur-xl animate-pulse"
              style={{ transform: `scale(${0.85 + frame * 0.08})` }}
            />
            {/* Overshooting Tops Core */}
            <div className="absolute w-20 h-20 rounded-full bg-white opacity-70 filter blur-md"></div>
            <div className="absolute text-[11px] font-mono font-bold text-white bg-slate-900/80 px-2 py-1 rounded border border-rose-500/50">
              Overshooting Top: {frames[frame].minTemp}°C
            </div>

            {/* Scale Bar */}
            <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono flex items-center gap-2 text-slate-300">
              <span>-80°C</span>
              <div className="w-24 h-2 rounded bg-gradient-to-r from-white via-rose-500 to-indigo-800"></div>
              <span>-30°C</span>
            </div>
          </div>

          {/* Time Scrubber */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded-full bg-blue-500 text-black flex items-center justify-center font-bold hover:bg-blue-400 transition"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </button>
              <div className="flex items-center gap-1.5">
                {frames.map((f, i) => (
                  <button
                    key={f.label}
                    onClick={() => setFrame(i)}
                    className={`px-2.5 py-1 rounded font-mono text-[11px] transition ${
                      frame === i ? "bg-blue-400 text-black font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="font-mono text-slate-400 text-[11px]">
              Platform: <b>{data.product.satellite_name}</b> • Latency: 5m
            </div>
          </div>
        </div>

        {/* Right Stats & Science */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-xs">
            <h3 className="font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>Cloud-Top Diagnostics</span>
              <span className="font-mono text-rose-400">Severe Updraft</span>
            </h3>

            <div className="space-y-3 font-mono">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Minimum Brightness Temp</span>
                <span className="text-xl font-bold text-rose-400 mt-1 block">{frames[frame].minTemp}°C</span>
                <span className="text-[10px] text-slate-400">Exceeds equilibrium tropopause (-68°C)</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Rapid Cooling Rate</span>
                <span className="text-xl font-bold text-amber-400 mt-1 block">{frames[frame].trend}</span>
                <span className="text-[10px] text-slate-400">Severe thunderstorm initiation threshold: &gt; -10°C/hr</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Detected Overshooting Tops</span>
                <span className="text-xl font-bold text-white mt-1 block">{data.product.overshooting_tops} Convective Cores</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold mb-1">
              <Info className="w-4 h-4" /> Satellite Convective Nowcast Rule
            </div>
            Cloud tops cooling faster than 15°C/hr with temperatures dropping below -70°C provide an early 25–40 minute lead time before the first ground lightning strike.
          </div>
        </div>
      </div>
    </div>
  );
};
