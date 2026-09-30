import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, Radio, CloudRain, Wind, ShieldAlert, ArrowRight, 
  Activity, CheckCircle2, ChevronRight, Layers, BarChart3, Database,
  Eye, AlertTriangle, Play, Cpu, ShieldCheck, RefreshCw, FileText
} from 'lucide-react';
import { Logo } from '../components/common/Logo';

export const LandingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* SECTION 1: Top Navbar with Official THANDER AI Logo */}
      <nav className="h-20 border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <Logo size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <Link to="/dashboard" className="hover:text-cyan-400 transition">Command Center</Link>
          <Link to="/map" className="hover:text-cyan-400 transition">Live Storm Map</Link>
          <Link to="/prediction" className="hover:text-cyan-400 transition">AI Predictions</Link>
          <Link to="/lightning" className="hover:text-cyan-400 transition">Lightning Intelligence</Link>
          <Link to="/replay" className="hover:text-cyan-400 transition">Historical Replay</Link>
          <Link to="/data-health" className="hover:text-cyan-400 transition">Data Health</Link>
          <Link to="/about" className="hover:text-cyan-400 transition">How It Works</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition"
          >
            Sign In
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition transform hover:-translate-y-0.5"
          >
            <span>Explore Live Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* SECTION 1 (cont): Hero Section */}
      <section className="relative px-6 lg:px-16 pt-16 pb-20 max-w-7xl mx-auto overflow-hidden">
        {/* Background Atmospheric Glow */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>ATMOSPHERIC INTELLIGENCE COMMAND PLATFORM</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              THANDER AI
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 bg-clip-text text-transparent">
                "Predict Before It Strikes."
              </span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              AI-powered thunderstorm and lightning nowcasting using radar, satellite, lightning and atmospheric intelligence.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition transform hover:-translate-y-0.5"
              >
                <span>Explore Live Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm flex items-center gap-2 transition"
              >
                <span>View How It Works</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>

            {/* Live Telemetry Ticker */}
            <div className="mt-10 p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Active Convective Alert</span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                Cell <span className="text-cyan-400 font-bold">ST-2026-0001</span>: <span className="text-amber-400 font-bold">58.5 dBZ</span> • <span className="text-red-400 font-bold">42.8 strikes/min</span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 ml-auto">
                Lead Time: 52.4 min (CSI: 0.784)
              </div>
            </div>
          </div>

          {/* SECTION 2: Live Intelligence Preview (Miniature Storm Intelligence Visual) */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                  <span className="font-bold text-sm text-white font-mono">NOWCAST SYNTHESIS</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                  SEVERE RISK
                </span>
              </div>

              {/* Miniature Interactive Radar Visual */}
              <div className="mt-4 relative h-48 rounded-2xl bg-[#090d18] border border-slate-800 flex items-center justify-center overflow-hidden">
                {/* Circular range rings */}
                <div className="absolute w-40 h-40 rounded-full border border-cyan-500/20"></div>
                <div className="absolute w-24 h-24 rounded-full border border-cyan-500/30"></div>
                <div className="absolute w-12 h-12 rounded-full border border-cyan-500/40"></div>
                {/* Radar sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent origin-center animate-spin" style={{ animationDuration: '4s' }}></div>
                {/* Storm cell dot with forecast path */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-[10px] font-mono text-white font-bold mt-1 bg-black/60 px-2 py-0.5 rounded">
                    ST-2026-0001 (58 dBZ)
                  </span>
                  <span className="text-[9px] font-mono text-cyan-300">Track: +15m → +30m ENE</span>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Lightning Probability (+30m)</span>
                    <span className="text-cyan-400 font-mono font-bold">89%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Thunderstorm Probability (+30m)</span>
                    <span className="text-amber-400 font-mono font-bold">92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  to="/map"
                  className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-center text-xs font-bold text-white transition"
                >
                  Full Radar Map
                </Link>
                <Link
                  to="/alerts"
                  className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition"
                >
                  Active Alert
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: How THANDER AI Works */}
      <section className="py-16 px-6 lg:px-16 border-t border-slate-800/80 bg-[#070b14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              END-TO-END PIPELINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              How THANDER AI Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From multi-sensor ingestion to machine-calibrated risk nowcasting in under 90 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative">
              <span className="text-2xl font-black text-cyan-400/30 font-mono block mb-2">01</span>
              <h3 className="font-bold text-white text-sm">Data Ingestion</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Ingests Doppler radar volume scans, INSAT-3D thermal infrared, ground WWLLN lightning, and atmospheric soundings.
              </p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative">
              <span className="text-2xl font-black text-cyan-400/30 font-mono block mb-2">02</span>
              <h3 className="font-bold text-white text-sm">Feature Normalization</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Calculates dBZ trends, cloud-top cooling rates (-18°C/hr), CAPE thermodynamic buoyancy, and strike frequency.
              </p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative">
              <span className="text-2xl font-black text-cyan-400/30 font-mono block mb-2">03</span>
              <h3 className="font-bold text-white text-sm">Nowcast Inference</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Backend prediction engine estimates hazard probabilities at +15, +30, +60, and +90 minute horizons.
              </p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative">
              <span className="text-2xl font-black text-cyan-400/30 font-mono block mb-2">04</span>
              <h3 className="font-bold text-white text-sm">Geofenced Alerting</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Evaluates intersection against registered infrastructure geofences with hysteresis deduplication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Multi-source Data Fusion */}
      <section className="py-16 px-6 lg:px-16 border-t border-slate-800/80 bg-[#090d18]/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              MULTISOURCE DATA FUSION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              4 Distinct Meteorological Ingestion Channels
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Integrated via extensible provider adapters with automatic fallback to secondary mesonet channels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Doppler Weather Radar</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                IMD S/C-Band radar volume scans delivering reflectivity (dBZ) and storm motion vectors.
              </p>
              <div className="mt-3 text-[10px] font-mono text-cyan-400">Freshness: &lt; 2 min</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                <CloudRain className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">INSAT-3D Thermal IR</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                10.8µm clean infrared tracking cloud-top cooling and deep convective updraft overshooting tops.
              </p>
              <div className="mt-3 text-[10px] font-mono text-blue-400">Resolution: 4 km spatial</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Ground Lightning Network</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                WWLLN & Earth Networks strike sensors capturing strike polarity (+/- CG) and strike density.
              </p>
              <div className="mt-3 text-[10px] font-mono text-amber-400">Latency: &lt; 45 seconds</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <Wind className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Atmospheric Sounding & NWP</h4>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Profiles evaluating CAPE (&gt;2,800 J/kg), CIN, Lifted Index, and 0–6 km bulk shear.
              </p>
              <div className="mt-3 text-[10px] font-mono text-emerald-400">Open-Meteo & IMD GFS</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 & 6: AI Prediction & Explainable AI */}
      <section className="py-16 px-6 lg:px-16 border-t border-slate-800/80 bg-[#070b14]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              EXPLAINABLE AI ENGINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Separating Hazard Probability from Model Confidence
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              Every forecast generated by THANDER AI includes transparent SHAP-inspired feature attribution. Operators understand <i>why</i> a thunderstorm is flagged, not just a black-box percentage.
            </p>
            <div className="mt-6 space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300 font-bold block mb-1">Radar Reflectivity Surge (+38% contribution)</span>
                <p className="text-slate-400 text-[11px]">Core reflectivity increased +14.2 dBZ/hr, reaching 58.5 dBZ supercell threshold.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300 font-bold block mb-1">Cloud-Top Rapid Cooling (+26% contribution)</span>
                <p className="text-slate-400 text-[11px]">INSAT thermal infrared indicates tops plunged to -72°C overshooting tropopause.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-cyan-300 font-bold block mb-1">Thermodynamic Buoyancy (+22% contribution)</span>
                <p className="text-slate-400 text-[11px]">Surface CAPE exceeding 2,840 J/kg provides high kinetic energy for updraft acceleration.</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Multi-Horizon Predictability Curve
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>+15 min (Immediate Nowcast)</span>
                  <span className="text-red-400 font-bold">94% Thunder / 91% Lightning</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>+30 min (Tactical Decision)</span>
                  <span className="text-red-400 font-bold">89% Thunder / 85% Lightning</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '89%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>+60 min (Operational Advisory)</span>
                  <span className="text-amber-400 font-bold">76% Thunder / 68% Lightning</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '76%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>+90 min (Outlook Horizon)</span>
                  <span className="text-cyan-400 font-bold">58% Thunder / 44% Lightning</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
            </div>
            <div className="pt-2 text-right">
              <Link to="/explainability" className="text-xs text-cyan-400 hover:text-cyan-300 font-bold">
                Inspect Complete XAI Attribution Matrix →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7, 8 & 9: Hyperlocal Alerts, Historical Replay, System Health */}
      <section className="py-16 px-6 lg:px-16 border-t border-slate-800/80 bg-[#090d18]/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Hyperlocal Alerts & Geofencing</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Draw customized geofences for schools, airports, metro transit, and farmland. Receive real-time push alerts with rule hysteresis deduplication.
              </p>
            </div>
            <Link to="/alerts" className="mt-5 text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1">
              <span>Open Alert Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-4">
                <Play className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Historical Storm Replay</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Step frame-by-frame through historic extreme convective squalls (e.g., Delhi Squall Line) and benchmark model lead time against ground truth.
              </p>
            </div>
            <Link to="/replay" className="mt-5 text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
              <span>Launch Backtest Replay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Self-Healing Data Health</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Real-time quality scoring across all 5 adapters. If Doppler radar experiences an outage, system gracefully downgrades to satellite-atmospheric pathway.
              </p>
            </div>
            <Link to="/data-health" className="mt-5 text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1">
              <span>View Data Health Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 10 & 11: Methodology & Call To Action */}
      <section className="py-20 px-6 lg:px-16 border-t border-slate-800/80 bg-gradient-to-b from-[#070b14] to-[#04060c] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <Logo size="lg" />
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
            Built for National Emergency Response & Disaster Mitigation
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
            THANDER AI conforms to WMO nowcasting standards and delivers verifiable lead time for agricultural safety, aviation routing, and urban resilience.
          </p>
          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-sm shadow-2xl shadow-cyan-500/30 transition transform hover:-translate-y-1 cursor-pointer"
            >
              Enter Atmospheric Command Center
            </Link>
            <Link
              to="/about"
              className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-bold text-sm transition"
            >
              Read Full Technical Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 12: Footer */}
      <footer className="py-10 px-6 lg:px-16 border-t border-slate-800/80 bg-[#04060c] text-xs text-slate-500 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <div>
            <div className="text-slate-300 font-bold font-mono">THANDER AI METEOROLOGICAL INTELLIGENCE</div>
            <div>Smart India Hackathon • Real-Time Convective Decision Support</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 font-mono text-xs">
          <Link to="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link>
          <Link to="/map" className="hover:text-cyan-400 transition">Interactive Map</Link>
          <Link to="/prediction" className="hover:text-cyan-400 transition">Nowcast Models</Link>
          <Link to="/replay" className="hover:text-cyan-400 transition">Historical Replay</Link>
          <Link to="/analytics" className="hover:text-cyan-400 transition">Verification Analytics</Link>
          <Link to="/about" className="hover:text-cyan-400 transition">Methodology</Link>
          <Link to="/login" className="hover:text-cyan-400 transition">Sign In</Link>
        </div>
      </footer>
    </div>
  );
};
