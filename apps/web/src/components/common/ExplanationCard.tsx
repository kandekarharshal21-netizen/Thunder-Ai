import React from 'react';
import { BrainCircuit, Info, ShieldCheck, HelpCircle } from 'lucide-react';
import { FeatureContribution } from '../../types/weather';

interface ExplanationCardProps {
  predictionSummary: string;
  confidence: number;
  dataQuality: 'Good' | 'Partial' | 'Poor';
  contributions: FeatureContribution[];
  modelVersion?: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  predictionSummary,
  confidence,
  dataQuality,
  contributions,
  modelVersion = "THANDER-Phase4-v2.4"
}) => {
  return (
    <div className="glass-panel p-4 rounded-xl border border-slate-800 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">AI Explainability & Diagnostics</h3>
        </div>
        <span className="font-mono text-[10px] text-slate-400">{modelVersion}</span>
      </div>

      {/* Primary Explanation */}
      <p className="mt-2.5 text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
        {predictionSummary}
      </p>

      {/* Diagnostics Row */}
      <div className="grid grid-cols-2 gap-2 mt-3 font-mono">
        <div className="p-2 rounded bg-slate-900/40 border border-slate-800/80">
          <div className="text-[10px] text-slate-400">Model Confidence</div>
          <div className="text-cyan-300 font-bold text-sm mt-0.5">
            {Math.round(confidence * 100)}%
            <span className="text-[10px] font-normal text-slate-400 ml-1.5">(Bayesian Credible Band)</span>
          </div>
        </div>

        <div className="p-2 rounded bg-slate-900/40 border border-slate-800/80">
          <div className="text-[10px] text-slate-400">Sensor Quality</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${
              dataQuality === 'Good' ? 'bg-emerald-400' : dataQuality === 'Partial' ? 'bg-amber-400' : 'bg-red-400'
            }`} />
            <span className="font-bold text-white text-sm">{dataQuality}</span>
          </div>
        </div>
      </div>

      {/* Feature Contributions SHAP Bars */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-2">
          <span>Top Contributing Observational Signals</span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> Relative Weight
          </span>
        </div>

        <div className="space-y-2.5">
          {contributions.map((feat) => {
            const isPos = feat.influence === 'positive';
            const pct = Math.abs(feat.contribution) * 100;

            return (
              <div key={feat.feature} className="group">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-300 group-hover:text-cyan-300 transition truncate max-w-[220px]">
                    {feat.display_name}
                  </span>
                  <span className={`font-mono text-[10px] font-bold ${isPos ? 'text-amber-400' : 'text-cyan-400'}`}>
                    {isPos ? `+${pct.toFixed(0)}%` : `-${pct.toFixed(0)}%`}
                  </span>
                </div>

                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isPos ? 'bg-gradient-to-r from-amber-500 to-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight group-hover:text-slate-300 transition">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
        <span>Scientific Decision-Support Tool</span>
        <a href="/explainability" className="text-cyan-400 hover:text-cyan-300 font-medium">Deep SHAP Analysis →</a>
      </div>
    </div>
  );
};
