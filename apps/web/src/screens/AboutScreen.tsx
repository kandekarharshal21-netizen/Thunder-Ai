import React from 'react';
import { BookOpen, ShieldCheck, Database, Cpu, Layers, AlertCircle, Info } from 'lucide-react';

export const AboutScreen: React.FC = () => {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-white tracking-wide">SCIENTIFIC METHODOLOGY & ARCHITECTURE</h1>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            SPECIFICATION v2.4
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Mathematical definitions, sensor attribution, and physical limitations of multimodal convective nowcasting.
        </p>
      </div>

      {/* Core Architectural Diagram / Concepts */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          The THANDER AI Fusion Pipeline
        </h3>
        <p className="text-slate-300 leading-relaxed">
          THANDER AI operates an asynchronous data fusion engine combining four disparate meteorological observation regimes into a regular spatiotemporal grid before passing tensors into a hybrid Eulerian-Lagrangian deep nowcasting model.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono pt-2">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-cyan-400 font-bold block">1. Ingestion</span>
            <span className="text-[11px] text-slate-400">Doppler Radar, INSAT-3D, WWLLN & Sounding via dedicated adapters.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-cyan-400 font-bold block">2. Normalization</span>
            <span className="text-[11px] text-slate-400">Reprojection to EPSG:4326 grid, timestamp validation & missingness masks.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-cyan-400 font-bold block">3. Model Inference</span>
            <span className="text-[11px] text-slate-400">ConvLSTM & cross-attention for 15, 30, 60 & 90 min hazard estimation.</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-cyan-400 font-bold block">4. Explainability</span>
            <span className="text-[11px] text-slate-400">Real-time SHAP attribution computing individual sensor feature weights.</span>
          </div>
        </div>
      </div>

      {/* Verification Formulas */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-xs space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Standard Meteorological Verification Formulations (WMO 2x2 Contingency Table)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-emerald-400 font-bold text-xs block mb-1">Critical Success Index (CSI)</span>
            <div className="p-2 rounded bg-slate-950 text-slate-200 text-center font-bold my-2 border border-slate-800">
              CSI = Hits / (Hits + Misses + FalseAlarms)
            </div>
            <p className="text-[10px] text-slate-400">Measures overall threat accuracy without penalizing for correct negatives.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-cyan-400 font-bold text-xs block mb-1">Probability of Detection (POD)</span>
            <div className="p-2 rounded bg-slate-950 text-slate-200 text-center font-bold my-2 border border-slate-800">
              POD = Hits / (Hits + Misses)
            </div>
            <p className="text-[10px] text-slate-400">Ratio of successfully predicted convective events to all observed events.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-amber-400 font-bold text-xs block mb-1">False Alarm Ratio (FAR)</span>
            <div className="p-2 rounded bg-slate-950 text-slate-200 text-center font-bold my-2 border border-slate-800">
              FAR = FalseAlarms / (Hits + FalseAlarms)
            </div>
            <p className="text-[10px] text-slate-400">Fraction of issued warnings that did not materialize.</p>
          </div>
        </div>
      </div>

      {/* Sensor Data Attribution */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 text-xs space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          Sensor Attribution & Provenance
        </h3>
        <ul className="space-y-2 text-slate-300">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">•</span>
            <span><b>Doppler Weather Radars:</b> India Meteorological Department (IMD) S-Band / C-Band DWR network.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">•</span>
            <span><b>Geostationary Satellite:</b> Indian Space Research Organisation (ISRO) INSAT-3D/3DR Convective Channels.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">•</span>
            <span><b>Ground Lightning Detection:</b> World Wide Lightning Location Network (WWLLN) VLF & Total Lightning Network.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 font-bold">•</span>
            <span><b>Thermodynamic NWP Models:</b> European Centre for Medium-Range Weather Forecasts (ECMWF) IFS & IMD GFS.</span>
          </li>
        </ul>
      </div>

      {/* Scientific Disclaimer */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/40 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-1">Persistent Scientific Disclaimer & Statutory Notice</span>
          THANDER AI is an automated decision-support research and operational prototype developed for the Smart India Hackathon. It does not replace official meteorological warnings, nor professional meteorological judgment by authorized national meteorological services. All official emergency directives remain with the India Meteorological Department (IMD) and National Disaster Management Authority (NDMA).
        </div>
      </div>
    </div>
  );
};
