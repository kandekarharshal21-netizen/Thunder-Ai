import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { AIPrediction, ForecastHorizon } from '../types/weather';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  BrainCircuit, ShieldAlert, Zap, CloudLightning, Wind, 
  HelpCircle, CheckCircle2, AlertTriangle, ArrowRight, Gauge
} from 'lucide-react';

export const PredictionScreen: React.FC = () => {
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [selectedHorizon, setSelectedHorizon] = useState<ForecastHorizon>(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      const data = await weatherApi.getPredictions();
      setPrediction(data);
      setLoading(false);
    };
    fetchPrediction();
  }, []);

  if (loading || !prediction) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeHorizon = prediction.horizons.find(h => h.horizon_min === selectedHorizon) || prediction.horizons[0];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">AI NOWCASTING PREDICTION ENGINE</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Baseline AI/Atmospheric Risk Model (baseline-v1)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent physics-informed convective nowcasting fusing thermodynamic instability, satellite IR cooling, radar reflectivity trends, and lightning strike frequency.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Model Version:</span>
          <span className="text-cyan-400 font-bold">baseline-v1</span>
        </div>
      </div>

      {/* Section 22 Summary Bar: Affected Region, Movement, Expected Peak */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Affected Region</span>
          <span className="text-sm font-bold text-white mt-1 block">Sangamner & Pune-Nashik Corridor</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Cell Movement</span>
          <span className="text-sm font-bold text-cyan-300 mt-1 block">ENE (65°) @ 46 km/h</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block font-semibold">Expected Peak Hazard</span>
          <span className="text-sm font-bold text-amber-400 mt-1 block">Within 22–35 min</span>
        </div>
      </div>

      {/* Forecast Horizon Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {prediction.horizons.map((h) => {
          const isSelected = selectedHorizon === h.horizon_min;
          return (
            <div
              key={h.horizon_min}
              onClick={() => setSelectedHorizon(h.horizon_min)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/15 ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">+{h.horizon_min} MIN</span>
                <RiskBadge severity={h.severity} size="sm" />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Thunderstorm</div>
                  <div className="text-xl font-mono font-extrabold text-white">
                    {Math.round(h.thunderstorm_prob * 100)}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Lightning</div>
                  <div className="text-xl font-mono font-extrabold text-cyan-400">
                    {Math.round(h.lightning_prob * 100)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Horizon Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Probabilities & Uncertainty Bands */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Nowcast Hazard Horizon (+{activeHorizon.horizon_min} min)
            </h3>
            <span className="text-xs font-mono text-cyan-300">Confidence: {Math.round(activeHorizon.confidence * 100)}%</span>
          </div>

          {/* Hazard Meters */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Thunderstorm Probability</span>
                <span className="text-white font-mono">{Math.round(activeHorizon.thunderstorm_prob * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 via-amber-500 to-red-600 rounded-full"
                  style={{ width: `${activeHorizon.thunderstorm_prob * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                <span>Uncertainty lower: {Math.round(activeHorizon.uncertainty_lower * 100)}%</span>
                <span>Upper: {Math.round(activeHorizon.uncertainty_upper * 100)}%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-slate-300">Cloud-to-Ground Lightning Probability</span>
                <span className="text-cyan-400 font-mono">{Math.round(activeHorizon.lightning_prob * 100)}%</span>
              </div>
              <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  style={{ width: `${activeHorizon.lightning_prob * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Hail Risk (&gt;1cm)</span>
                <span className="text-base font-mono font-bold text-amber-300 mt-1 block">
                  {Math.round(activeHorizon.hail_prob * 100)}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Peak Outflow Gust</span>
                <span className="text-base font-mono font-bold text-cyan-300 mt-1 block">
                  {activeHorizon.wind_gust_kmh} km/h
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed">
            <b>Scientific Synthesis:</b> {prediction.primary_explanation}
          </div>
        </div>

        {/* Right: SHAP Feature Contributions & Model Progression */}
        <div className="lg:col-span-6 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>SHAP Feature Attribution Breakdown</span>
              <span className="text-[10px] font-mono text-slate-400">Multimodal Deep Fusion</span>
            </h3>

            <div className="space-y-3">
              {prediction.contributions.map((feat) => {
                const isPos = feat.influence === 'positive';
                const pct = Math.abs(feat.contribution) * 100;
                return (
                  <div key={feat.feature} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200">{feat.display_name}</span>
                      <span className={`font-mono font-bold ${isPos ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {isPos ? `+${pct.toFixed(0)}%` : `-${pct.toFixed(0)}%`}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${isPos ? 'bg-amber-400' : 'bg-cyan-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Progression Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <h4 className="font-bold text-slate-200 mb-2">Model Architecture Progression</h4>
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
              <div className="p-2 rounded bg-slate-800/40 text-slate-400">Phase 1: Deterministic</div>
              <div className="p-2 rounded bg-slate-800/40 text-slate-400">Phase 2: XGBoost</div>
              <div className="p-2 rounded bg-slate-800/40 text-slate-400">Phase 3: ConvLSTM</div>
              <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">
                Phase 4: Multimodal (Active)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
