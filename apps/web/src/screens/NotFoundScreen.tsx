import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, Compass } from 'lucide-react';

export const NotFoundScreen: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="font-mono text-xs font-bold text-cyan-400 tracking-widest uppercase">
          404 • SECTOR UNREACHABLE
        </div>

        <h1 className="text-2xl font-black text-white">Geospatial Target Not Found</h1>

        <p className="text-xs text-slate-400 leading-relaxed">
          The requested coordinate or meteorological workspace does not exist in the active observation catalog.
        </p>

        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition shadow-md shadow-cyan-500/20"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            to="/"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Product Overview
          </Link>
        </div>
      </div>
    </div>
  );
};
