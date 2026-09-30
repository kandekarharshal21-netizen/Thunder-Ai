import React, { useState, useEffect } from 'react';
import { weatherApi } from '../services/api';
import { ReplayEvent, ReplayEventFrame } from '../types/weather';
import { 
  History, Play, Pause, RotateCcw, FastForward, 
  CheckCircle2, AlertTriangle, ArrowRight, Activity, Zap, Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from 'recharts';

export const ReplayScreen: React.FC = () => {
  const [events, setEvents] = useState<ReplayEvent[]>([]);
  const [activeEvent, setActiveEvent] = useState<ReplayEvent | null>(null);
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [comparisonMode, setComparisonMode] = useState<'reflectivity' | 'probability'>('reflectivity');

  useEffect(() => {
    const fetchReplay = async () => {
      const data = await weatherApi.getReplayEvents();
      setEvents(data);
      if (data.length > 0) setActiveEvent(data[0]);
    };
    fetchReplay();
  }, []);

  useEffect(() => {
    let timer: any;
    if (isPlaying && activeEvent) {
      timer = setInterval(() => {
        setCurrentFrameIdx((prev) => {
          if (prev >= activeEvent.frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeEvent]);

  if (!activeEvent || !activeEvent.frames || activeEvent.frames.length === 0) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentFrame: ReplayEventFrame = activeEvent.frames[currentFrameIdx] || activeEvent.frames[0];

  const chartData = (activeEvent.frames || []).map(f => ({
    time: f.time_label,
    Observed_dBZ: f.observed_dbz,
    AI_Forecast_dBZ: f.predicted_dbz,
    Observed_Strikes: f.observed_strikes,
    AI_Predicted_Prob: Math.round(f.predicted_prob * 100)
  }));

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1720px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-wide">HISTORICAL STORM REPLAY & BACKTESTING ENGINE</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SIH BENCHMARK ARENA
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Progressive frame-by-frame verification comparing AI nowcast against true historical ground observations.
          </p>
        </div>

        {/* Event Selector */}
        <div className="flex items-center gap-2">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={async () => {
                let target = ev;
                if (!target.frames || target.frames.length === 0) {
                  try {
                    const res = await fetch(`/api/v1/replay/${ev.id}`);
                    if (res.ok) target = await res.json();
                  } catch {}
                }
                setActiveEvent(target);
                setCurrentFrameIdx(0);
                setIsPlaying(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                activeEvent.id === ev.id
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {ev.name.split(" ")[0]} ({ev.date})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Event Details & Verification Scores */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">{activeEvent.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeEvent.region} • {activeEvent.date} — {activeEvent.description}</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-bold">
              Lead Time Achieved: +{activeEvent.lead_time_achieved_min} min
            </span>
          </div>
        </div>

        {/* Verification Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">POD (Hit Rate)</span>
            <span className="text-base font-bold text-emerald-400 mt-1 block">
              {(activeEvent.metrics.pod * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">FAR (False Alarm)</span>
            <span className="text-base font-bold text-amber-400 mt-1 block">
              {(activeEvent.metrics.far * 100).toFixed(1)}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">CSI (Threat Score)</span>
            <span className="text-base font-bold text-cyan-300 mt-1 block">
              {activeEvent.metrics.csi.toFixed(3)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Brier Score</span>
            <span className="text-base font-bold text-white mt-1 block">
              {activeEvent.metrics.brier_score.toFixed(3)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Avg Lead Time</span>
            <span className="text-base font-bold text-white mt-1 block">
              {activeEvent.metrics.average_lead_time_min}m
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Inference Latency</span>
            <span className="text-base font-bold text-cyan-400 mt-1 block">
              {activeEvent.metrics.inference_latency_ms} ms
            </span>
          </div>
        </div>
      </div>

      {/* Frame Playback & Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Frame Scrubber & Current Instant State */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Historical Playback: Frame {currentFrameIdx + 1} of {activeEvent.frames.length}
              </h4>
            </div>
            <span className="font-mono text-cyan-300 font-bold">{currentFrame.time_label}</span>
          </div>

          {/* Side-by-Side Comparison Box */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            {/* Ground Truth Observed */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Actual Ground Truth
              </span>
              <div className="text-2xl font-bold text-white">{currentFrame.observed_dbz} dBZ</div>
              <div className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>{currentFrame.observed_strikes} strikes recorded</span>
              </div>
            </div>

            {/* AI Nowcast Available At That Moment */}
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider block mb-1">
                AI Prediction
              </span>
              <div className="text-2xl font-bold text-cyan-300">{currentFrame.predicted_dbz} dBZ</div>
              <div className="text-xs text-white mt-1">
                Risk Prob: <b>{Math.round(currentFrame.predicted_prob * 100)}%</b>
              </div>
            </div>
          </div>

          {/* Meteorological Event Notes */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <span className="text-slate-400 font-semibold block mb-0.5 text-[10px] uppercase">
              Phase Synoptic Observations:
            </span>
            {currentFrame.event_notes}
          </div>

          {/* Timeline Playback Controls */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-cyan-500 text-black flex items-center justify-center font-bold hover:bg-cyan-400 transition"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentFrameIdx(0);
              }}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
              title="Reset to T-60m"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Step buttons */}
            <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
              {activeEvent.frames.map((f, idx) => (
                <button
                  key={f.time_label}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentFrameIdx(idx);
                  }}
                  className={`flex-1 py-1.5 text-[10px] font-mono font-bold rounded transition ${
                    currentFrameIdx === idx
                      ? 'bg-cyan-400 text-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.time_label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Comparative Error & Lead Time Verification Chart */}
        <div className="lg:col-span-6 glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Observed vs Predicted Trajectory Timeline
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => setComparisonMode('reflectivity')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  comparisonMode === 'reflectivity' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400'
                }`}
              >
                Reflectivity (dBZ)
              </button>
              <button
                onClick={() => setComparisonMode('probability')}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                  comparisonMode === 'probability' ? 'bg-amber-400 text-black font-bold' : 'text-slate-400'
                }`}
              >
                Lightning Strikes
              </button>
            </div>
          </div>

          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {comparisonMode === 'reflectivity' ? (
                  <>
                    <Bar dataKey="Observed_dBZ" fill="#3b82f6" name="Observed Radar dBZ" />
                    <Bar dataKey="AI_Forecast_dBZ" fill="#00f0ff" name="AI Forecast dBZ" />
                  </>
                ) : (
                  <>
                    <Bar dataKey="Observed_Strikes" fill="#f59e0b" name="Observed Strikes" />
                    <Bar dataKey="AI_Predicted_Prob" fill="#ef4444" name="AI Risk Probability (%)" />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
