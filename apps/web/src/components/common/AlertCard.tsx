import React, { useState } from 'react';
import { WeatherAlert } from '../../types/weather';
import { RiskBadge } from './RiskBadge';
import { ShieldCheck, MapPin, Clock, Info, CheckCircle2, ChevronRight, AlertOctagon } from 'lucide-react';
import { weatherApi } from '../../services/api';

interface AlertCardProps {
  alert: WeatherAlert;
  onAcknowledged?: () => void;
  compact?: boolean;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onAcknowledged,
  compact = false
}) => {
  const [isAcking, setIsAcking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!compact);

  const handleAck = async () => {
    setIsAcking(true);
    await weatherApi.acknowledgeAlert(alert.id);
    setIsAcking(false);
    if (onAcknowledged) onAcknowledged();
  };

  const isAcked = alert.status === 'acknowledged';

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      alert.severity === 'SEVERE'
        ? 'bg-red-950/20 border-red-500/40 shadow-lg shadow-red-950/30'
        : alert.severity === 'HIGH'
        ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/30'
        : 'bg-slate-900/60 border-slate-800'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <RiskBadge severity={alert.severity} size="sm" />
            <span className="font-mono text-[10px] text-slate-400">{alert.id}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-cyan-500/20 text-cyan-300">
              {Math.round(alert.probability * 100)}% PROBABILITY
            </span>
          </div>
          <h4 className="text-sm font-bold text-white leading-snug">{alert.title}</h4>
        </div>

        {/* Status indicator */}
        {isAcked ? (
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3" /> ACKNOWLEDGED
          </span>
        ) : (
          <button
            onClick={handleAck}
            disabled={isAcking}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-red-500 hover:bg-red-400 text-white transition shadow-sm cursor-pointer"
          >
            {isAcking ? 'SAVING...' : 'ACKNOWLEDGE'}
          </button>
        )}
      </div>

      {/* Target Area & Time */}
      <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold">{alert.target_area}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-slate-400 text-[11px]">
          <Clock className="w-3.5 h-3.5" />
          <span>Valid until: {new Date(alert.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Rationale & Safety Action */}
      <div className="mt-3 space-y-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 leading-relaxed">
          <span className="text-slate-400 font-semibold block mb-0.5 text-[10px] uppercase tracking-wider">Detection Rationale:</span>
          {alert.reason}
        </div>

        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-emerald-200 leading-relaxed">
          <span className="text-emerald-400 font-semibold block mb-0.5 text-[10px] uppercase tracking-wider">Recommended Safety Action:</span>
          {alert.recommended_action}
        </div>
      </div>

      {/* Scientific Disclaimer */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
        <span>{alert.official_source_disclaimer}</span>
        <span className="font-mono">{alert.data_timestamp.substring(11, 16)} UTC</span>
      </div>
    </div>
  );
};
