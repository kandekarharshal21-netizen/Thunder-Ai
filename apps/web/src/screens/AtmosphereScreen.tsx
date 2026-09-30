import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { Wind, Thermometer, Droplets, Gauge, Compass, ShieldAlert, ArrowUpRight } from 'lucide-react';

export const AtmosphereScreen: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAtmosphere = async () => {
      const res = await weatherApi.getAtmosphere();
      setData(res);
      setLoading(false);
    };
    fetchAtmosphere();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const inst = data.instability;
  const surf = data.surface;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">ATMOSPHERIC SOUNDING & INSTABILITY PROFILES</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ECMWF / RADIOSONDE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Thermodynamic indices, parcel buoyancy parameters, and deep-layer kinematic wind shear.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Status: {inst.status} • Updated Hourly
        </div>
      </div>

      {/* Primary Instability Indices Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">CAPE (J/kg)</span>
          <div className="text-2xl font-mono font-extrabold text-amber-400 mt-2">{inst.cape_j_kg}</div>
          <span className="text-[10px] text-amber-300 font-mono mt-1 block">Extreme Instability</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">CIN (J/kg)</span>
          <div className="text-2xl font-mono font-extrabold text-cyan-300 mt-2">{inst.cin_j_kg}</div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Weak Cap (Breakable)</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Lifted Index</span>
          <div className="text-2xl font-mono font-extrabold text-red-400 mt-2">{inst.lifted_index}</div>
          <span className="text-[10px] text-red-300 font-mono mt-1 block">Severe Thunderstorm</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">K-Index</span>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">{inst.k_index}</div>
          <span className="text-[10px] text-amber-300 font-mono mt-1 block">80–90% Storm Risk</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">0–6km Shear</span>
          <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-2">{inst.bulk_shear_0_6km_kts} kts</div>
          <span className="text-[10px] text-slate-300 font-mono mt-1 block">Supercell Supportive</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Precip Water</span>
          <div className="text-2xl font-mono font-extrabold text-blue-400 mt-2">{inst.precipitable_water_mm} mm</div>
          <span className="text-[10px] text-blue-300 font-mono mt-1 block">Tropical Moisture</span>
        </div>
      </div>

      {/* Surface AWS Mesonet + Thermodynamic Interpretation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Surface Weather Station Mesonet */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 text-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-bold text-white uppercase tracking-wider">Surface Automated Mesonet (AWS)</h3>
            <span className="font-mono text-cyan-400">10m Tower Observations</span>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-red-400" /> Temperature / Dew
              </span>
              <div className="text-lg font-bold text-white mt-1">{surf.surface_temp_c}°C / {surf.dew_point_c}°C</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-400" /> Relative Humidity
              </span>
              <div className="text-lg font-bold text-cyan-300 mt-1">{surf.relative_humidity_pct}%</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-amber-400" /> Pressure (MSL)
              </span>
              <div className="text-lg font-bold text-white mt-1">{surf.pressure_hpa} hPa</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Wind className="w-3 h-3 text-emerald-400" /> Sustained / Peak Gust
              </span>
              <div className="text-lg font-bold text-amber-400 mt-1">{surf.wind_speed_kmh} / {surf.wind_gust_kmh} km/h</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 leading-relaxed">
            <b>Meteorological Summary:</b> {inst.interpretation}
          </div>
        </div>

        {/* Sounding Pressure Levels Table (Skew-T style) */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <h3 className="font-bold text-white uppercase tracking-wider">Vertical Radiosonde Sounding Profile</h3>
            <span className="font-mono text-slate-400 text-[10px]">Freezing Level: {inst.freezing_level_m} m AGL</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[10px] uppercase">
                  <th className="pb-2">Pressure (hPa)</th>
                  <th className="pb-2">Height (m)</th>
                  <th className="pb-2">Temp (°C)</th>
                  <th className="pb-2">Dew Point (°C)</th>
                  <th className="pb-2">Wind Speed (kts)</th>
                  <th className="pb-2 text-right">Wind Dir (°)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.sounding_levels.map((lvl: any) => (
                  <tr key={lvl.pressure_hpa} className="hover:bg-slate-800/40">
                    <td className="py-2 text-cyan-400 font-bold">{lvl.pressure_hpa}</td>
                    <td className="py-2 text-slate-300">{lvl.height_m}</td>
                    <td className="py-2 font-bold text-white">{lvl.temp_c}°C</td>
                    <td className="py-2 text-slate-300">{lvl.dew_point_c}°C</td>
                    <td className="py-2 text-amber-300">{lvl.wind_speed_kts}</td>
                    <td className="py-2 text-right text-slate-400">{lvl.wind_dir_deg}°</td>
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
