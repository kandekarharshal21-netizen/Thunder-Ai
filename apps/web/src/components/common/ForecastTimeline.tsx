import React from 'react';
import { ForecastHorizon } from '../../types/weather';
import { Clock, Play, Pause, FastForward } from 'lucide-react';

interface ForecastTimelineProps {
  selectedHorizon: ForecastHorizon;
  onChangeHorizon: (h: ForecastHorizon) => void;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  selectedHorizon,
  onChangeHorizon
}) => {
  const horizons: ForecastHorizon[] = [15, 30, 60, 90];

  return (
    <div className="glass-panel p-3 rounded-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-cyan-400" />
        <span className="font-semibold text-slate-200">Forecast Horizon Step:</span>
      </div>

      <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
        {horizons.map((h) => {
          const isActive = selectedHorizon === h;
          return (
            <button
              key={h}
              onClick={() => onChangeHorizon(h)}
              className={`px-3 py-1 rounded-md font-mono text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              +{h} min
            </button>
          );
        })}
      </div>

      <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
        Confidence Decay: {selectedHorizon === 15 ? '95%' : selectedHorizon === 30 ? '91%' : selectedHorizon === 60 ? '84%' : '74%'}
      </div>
    </div>
  );
};
