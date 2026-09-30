import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, UserProfile } from '../services/auth';
import { 
  User, Shield, Mail, Building, Key, 
  LogOut, CheckCircle2, Clock, MapPin, Radio 
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">OPERATIONAL OFFICER PROFILE</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Role clearances, assigned meteorological sectors, and authenticated session credentials.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Identity Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-24 h-24 rounded-2xl object-cover ring-2 ring-cyan-400/50 shadow-xl"
        />

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {user.role.toUpperCase()}
            </span>
          </div>

          <div className="text-xs text-slate-400 flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 font-mono">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-400" />
              {user.organization || 'National Severe Convection Group'}
            </span>
          </div>

          <div className="text-[11px] text-emerald-400 font-mono flex items-center justify-center sm:justify-start gap-1.5 pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Session Verified • JWT Valid</span>
          </div>
        </div>
      </div>

      {/* Operational Clearances */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-xs space-y-4">
        <h3 className="font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
          <span>Security Clearances & Privileges</span>
          <Shield className="w-4 h-4 text-cyan-400" />
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Radar & Satellite Telemetry</span>
            <p className="text-slate-400 text-[11px]">Unrestricted raw volume scan and infrared product access.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Emergency Warning Issuance</span>
            <p className="text-slate-400 text-[11px]">Authorized to dispatch and acknowledge localized severe storm alerts.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Geofence Administration</span>
            <p className="text-slate-400 text-[11px]">Create and modify perimeter radii for schools, farms, and campuses.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-bold text-slate-200 block mb-1">Audit Ledger Inspection</span>
            <p className="text-slate-400 text-[11px]">Review immutable historical records and model inference timestamps.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
