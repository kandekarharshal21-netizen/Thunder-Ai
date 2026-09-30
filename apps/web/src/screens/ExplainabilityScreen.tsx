import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { AIPrediction } from '../types/weather';
import { 
  SlidersHorizontal, BrainCircuit, ShieldAlert, 
  HelpCircle, Info, CheckCircle2, TrendingUp, AlertTriangle
} from 'lucide-react';

export const ExplainabilityScreen: React.FC = () => {
  const [prediction, setPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPred = async () => {
      const data = await weatherApi.getPredictions();
      setPrediction(data);
      setLoading(false);
    };
    fetchPred();
  }, []);

  if (loading || !prediction) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">EXPLAINABLE AI & SCIENTIFIC TRANSPARENCY</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              SHAP / INTEGRATED GRADIENTS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent meteorological signal attribution explaining why the AI nowcast elevated localized hazard levels.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          Model: {prediction.model_version}
        </div>
      </div>

      {/* Uncertainty UX: Confidence vs Hazard Probability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Hazard Event Probability</span>
            <span className="font-mono text-amber-400 font-bold text-sm">89%</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            The mathematical likelihood of severe cloud-to-ground lightning occurring within the target corridor over the +30m horizon.
          </p>
          <div className="h-2 w-full bg-slate-900 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '89%' }}></div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
            <span className="text-slate-400 uppercase tracking-wider font-semibold">Model Epistemic Confidence</span>
            <span className="font-mono text-cyan-400 font-bold text-sm">{Math.round(prediction.overall_confidence * 100)}%</span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Model certainty given active sensor data quality and observation freshness. Reduces gracefully if sensors disconnect.
          </p>
          <div className="h-2 w-full bg-slate-900 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${prediction.overall_confidence * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Feature Contributions Detailed List */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Observational Signal Attribution (SHAP Values)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Relative Influence Weight</span>
        </div>

        <div className="space-y-4">
          {prediction.contributions.map((feat) => {
            const isPos = feat.influence === 'positive';
            const pct = Math.abs(feat.contribution) * 100;
            return (
              <div key={feat.feature} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isPos ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                    <span className="text-sm font-bold text-white">{feat.display_name}</span>
                  </div>
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    isPos ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {isPos ? `+${pct.toFixed(1)}% Hazard Influence` : `-${pct.toFixed(1)}% Negative Influence`}
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isPos ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scientific Transparency Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200 block mb-1">Scientific Attribution Principles</span>
          THANDER AI provides explainability via post-hoc feature attribution (SHapley Additive exPlanations) and integrated gradients across radar reflectivity tensors. Explanations indicate observational feature correlation with severe convective outcomes and do not replace physical meteorological diagnosis.
        </div>
      </div>
    </div>
  );
};
