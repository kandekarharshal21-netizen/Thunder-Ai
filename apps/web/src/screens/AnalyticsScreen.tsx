import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { 
  BarChart3, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck, 
  Clock, Activity, Cpu, Layers, HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';

export const AnalyticsScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const data = await weatherApi.getAnalytics();
      setAnalytics(data);
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const m = analytics.headline_metrics;

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">FORECAST VERIFICATION & MODEL MONITORING</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              WMO CONTINGENCY TABLE STANDARDS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal statistical verification: Probability of Detection (POD), False Alarm Ratio (FAR), Critical Success Index (CSI), and Reliability Calibration.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Sample Size: <b>{m.verification_events_evaluated}</b> convective events evaluated
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">POD (Hit Rate)</span>
          <div className="text-2xl font-mono font-extrabold text-emerald-400 mt-2">
            {(m.pod * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Target: &gt;85%</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">FAR (False Alarm)</span>
          <div className="text-2xl font-mono font-extrabold text-amber-400 mt-2">
            {(m.far * 100).toFixed(1)}%
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">Target: &lt;18%</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">CSI (Threat Score)</span>
          <div className="text-2xl font-mono font-extrabold text-cyan-300 mt-2">
            {m.csi.toFixed(3)}
          </div>
          <span className="text-[10px] text-cyan-400 font-mono mt-1 block">Composite Score</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Brier Score</span>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">
            {m.brier_score.toFixed(3)}
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Low Mean Sq Error</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Average Lead Time</span>
          <div className="text-2xl font-mono font-extrabold text-white mt-2">
            {m.average_lead_time_min}m
          </div>
          <span className="text-[10px] text-slate-300 font-mono mt-1 block">Before First Flash</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Inference Latency</span>
          <div className="text-2xl font-mono font-extrabold text-cyan-400 mt-2">
            {m.inference_latency_ms} ms
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">&lt;100ms Budget</span>
        </div>
      </div>

      {/* Charts Grid: Monthly CSI/POD Trend + Reliability Calibration Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Monthly CSI & POD Progression (2025–2026 Season)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Monsoon Benchmark</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthly_trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0.6, 1.0]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="pod" stroke="#10b981" strokeWidth={2.5} name="POD (Hit Rate)" />
                <Line type="monotone" dataKey="csi" stroke="#00f0ff" strokeWidth={2.5} name="CSI (Threat Score)" />
                <Line type="monotone" dataKey="far" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" name="FAR (False Alarm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reliability Calibration Plot */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Reliability Calibration Curve (Forecast vs Observed)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">Near-Perfect 45° Alignment</span>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.calibration_curve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="forecast_prob" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 1.0]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="forecast_prob" stroke="#475569" strokeDasharray="5 5" name="Perfect Reliability (y=x)" />
                <Line type="monotone" dataKey="observed_freq" stroke="#00f0ff" strokeWidth={3} name="Observed Relative Frequency" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Registry Card */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-xs">
        <h3 className="font-bold text-white uppercase tracking-wider mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
          <span>Active ML Model Registry & Provenance</span>
          <span className="font-mono text-cyan-400">Semantic Versioning</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
            <div className="flex items-center justify-between font-mono mb-2">
              <span className="text-cyan-300 font-bold">v2.4.0 (Active Production)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">PRODUCTION</span>
            </div>
            <div className="text-white font-bold">THANDER-Multimodal-Spatiotemporal-Fusion</div>
            <p className="text-[11px] text-slate-400 mt-1">Fuses Doppler radar volumes, INSAT-3D IR, WWLLN lightning, and sounding variables.</p>
            <div className="mt-3 text-[10px] font-mono text-slate-300">CSI: <b>0.784</b> • Latency: <b>84ms</b></div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between font-mono mb-2">
              <span className="text-slate-300 font-bold">v2.5.0-rc1</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">STAGING</span>
            </div>
            <div className="text-white font-bold">ConvLSTM-Transformer-DualPol</div>
            <p className="text-[11px] text-slate-400 mt-1">Spatiotemporal attention model incorporating dual-pol differential reflectivity.</p>
            <div className="mt-3 text-[10px] font-mono text-slate-300">CSI: <b>0.812</b> • Latency: <b>112ms</b></div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 opacity-60">
            <div className="flex items-center justify-between font-mono mb-2">
              <span className="text-slate-400 font-bold">v1.8.2</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">DEPRECATED</span>
            </div>
            <div className="text-slate-300 font-bold">XGBoost-Tabular-Baseline</div>
            <p className="text-[11px] text-slate-400 mt-1">Non-spatial tabular gradient boosted baseline model.</p>
            <div className="mt-3 text-[10px] font-mono text-slate-400">CSI: 0.642 • Latency: 12ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};
