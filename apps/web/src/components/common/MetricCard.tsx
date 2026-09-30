import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  horizon?: number;
  confidence?: number;
  statusColor?: 'cyan' | 'amber' | 'red' | 'emerald';
  onClick?: () => void;
  isActive?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  horizon,
  confidence,
  statusColor = 'cyan',
  onClick,
  isActive = false
}) => {
  const colorMap = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20 group-hover:border-cyan-400',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-950/20 group-hover:border-amber-400',
    red: 'border-red-500/30 text-red-400 bg-red-950/20 group-hover:border-red-400',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20 group-hover:border-emerald-400'
  };

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-4 rounded-xl border transition-all duration-200 group ${
        onClick ? 'cursor-pointer hover:bg-slate-900/90 hover:scale-[1.01]' : ''
      } ${isActive ? 'ring-2 ring-cyan-400 border-cyan-400 shadow-lg shadow-cyan-500/10' : 'border-slate-800'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg border ${colorMap[statusColor]} transition`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              {title}
            </span>
            {horizon && (
              <span className="text-[10px] font-mono text-cyan-400 font-medium">
                +{horizon}m horizon
              </span>
            )}
          </div>
        </div>

        {confidence !== undefined && (
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">AI Conf.</span>
            <span className="text-xs font-mono font-bold text-slate-200">
              {Math.round(confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-mono font-extrabold tracking-tight text-white">
          {value}
        </span>
        {unit && <span className="text-xs text-slate-400 font-medium">{unit}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
        <span>{subtext || "Real-time telemetry"}</span>
        {trend && (
          <div className={`flex items-center gap-1 font-mono text-[10px] ${
            trend === 'up' ? 'text-amber-400' : trend === 'down' ? 'text-emerald-400' : 'text-slate-400'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            <span>{trendValue || (trend === 'up' ? 'Surging' : 'Easing')}</span>
          </div>
        )}
      </div>
    </div>
  );
};
