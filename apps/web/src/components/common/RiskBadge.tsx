import React from 'react';
import { SeverityLevel } from '../../types/weather';
import { AlertCircle, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface RiskBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true
}) => {
  const config = {
    LOW: {
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: ShieldCheck,
      label: 'LOW RISK',
      desc: 'Normal conditions; routine convective monitoring'
    },
    MODERATE: {
      color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
      icon: AlertCircle,
      label: 'MODERATE CAUTION',
      desc: 'Scattered storm cells; isolated lightning initiation possible'
    },
    HIGH: {
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: AlertTriangle,
      label: 'HIGH THREAT',
      desc: 'Organized convective multicellular storm; frequent cloud-to-ground strikes'
    },
    SEVERE: {
      color: 'bg-red-500/25 text-red-300 border-red-500/50 shadow-md shadow-red-500/10',
      icon: Zap,
      label: 'SEVERE ALERT',
      desc: 'Intense supercell/squall line; hazardous lightning & destructive microburst gusts'
    },
    EXTREME: {
      color: 'bg-purple-500/30 text-purple-200 border-purple-500/60 shadow-lg shadow-purple-500/20 animate-pulse',
      icon: Zap,
      label: 'EXTREME NOWCAST',
      desc: 'Unprecedented convective core; catastrophic lightning density and hail'
    }
  }[severity] || {
    color: 'bg-slate-800 text-slate-300 border-slate-700',
    icon: ShieldCheck,
    label: severity,
    desc: 'Unclassified'
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-bold'
  }[size];

  return (
    <span
      title={config.desc}
      className={`inline-flex items-center gap-1.5 font-mono font-semibold rounded-md border ${config.color} ${sizeClasses}`}
    >
      {showIcon && <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
      <span>{config.label}</span>
    </span>
  );
};
