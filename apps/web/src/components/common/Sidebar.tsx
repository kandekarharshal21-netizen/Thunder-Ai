import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Map, BrainCircuit, ShieldAlert, Settings, User,
  ChevronDown, ChevronRight, Activity, Zap, History, BarChart3, HeartPulse
} from 'lucide-react';

interface SidebarProps {
  alertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ alertsCount = 2 }) => {
  const [showSecondary, setShowSecondary] = useState<boolean>(false);

  const PRIMARY_ITEMS = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map', label: 'Live Map', icon: Map },
    { path: '/ai-nowcast', label: 'AI Nowcast', icon: BrainCircuit },
    { path: '/alerts', label: 'Alerts', icon: ShieldAlert, badge: alertsCount > 0 ? `${alertsCount}` : undefined, badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/40' }
  ];

  const SECONDARY_ITEMS = [
    { path: '/storms', label: 'Storm Digital Twins', icon: Activity },
    { path: '/lightning', label: 'Lightning Feeds', icon: Zap },
    { path: '/replay', label: 'Historical Replay', icon: History },
    { path: '/analytics', label: 'Forecast Verification', icon: BarChart3 },
    { path: '/data-health', label: 'Sensor Data Health', icon: HeartPulse }
  ];

  return (
    <aside className="w-56 bg-[#080c16] border-r border-slate-800/80 hidden lg:flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none z-40">
      {/* Primary Compact Navigation */}
      <div className="p-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
        Navigation
      </div>
      <nav className="px-2 space-y-1">
        {PRIMARY_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition group-hover:text-cyan-400 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Optional Collapsible Tools Drawer */}
      <div className="px-2 mt-4 pt-3 border-t border-slate-800/60">
        <button
          onClick={() => setShowSecondary(!showSecondary)}
          className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono text-slate-400 hover:text-slate-300 rounded-lg hover:bg-slate-900/60 transition"
        >
          <span>More Tools</span>
          {showSecondary ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {showSecondary && (
          <div className="mt-1 space-y-0.5 pl-1">
            {SECONDARY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] transition ${
                      isActive ? 'text-cyan-300 font-bold bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                    }`
                  }
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Compact Section: Settings & Profile (Section 9) */}
      <div className="mt-auto p-2 border-t border-slate-800/80 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <Settings className="w-4 h-4 transition group-hover:text-cyan-400 shrink-0" />
          <span>Settings</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
              isActive
                ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`
          }
        >
          <User className="w-4 h-4 transition group-hover:text-cyan-400 shrink-0" />
          <span>Profile</span>
        </NavLink>
      </div>
    </aside>
  );
};
