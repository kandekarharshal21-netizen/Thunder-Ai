import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Navigation, Search, CheckCircle2, 
  User, ShieldAlert, Bell, ChevronDown, Radio,
  RefreshCw, Volume2, VolumeX
} from 'lucide-react';
import { ForecastHorizon } from '../../types/weather';
import { weatherApi } from '../../services/api';
import { authService, UserProfile } from '../../services/auth';
import { soundService } from '../../services/sound';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  horizon: ForecastHorizon;
  onHorizonChange: (h: ForecastHorizon) => void;
  activeLocation: string;
  onLocationChange: (loc: string, coords?: [number, number]) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  secondsAgo?: number;
  alertsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  horizon,
  onHorizonChange,
  activeLocation,
  onLocationChange,
  onRefresh,
  isRefreshing = false,
  secondsAgo = 18,
  alertsCount = 2
}) => {
  const [time, setTime] = useState<string>('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundService.getMuted());
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(authService.getUser());
    const handleAuthChange = () => setUser(authService.getUser());
    window.addEventListener('thander-auth-changed', handleAuthChange);

    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      window.removeEventListener('thander-auth-changed', handleAuthChange);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle location search query debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await weatherApi.searchLocations(searchQuery);
      setSearchResults(results);
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Browser Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const rev = await weatherApi.reverseGeocode(latitude, longitude);
        onLocationChange(rev.name, [latitude, longitude]);
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundService.setMuted(next);
  };

  return (
    <header className="h-16 bg-[#080c16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-50 select-none">
      
      {/* 1. THANDER AI Logo */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="hover:opacity-90 transition">
          <Logo size="md" />
        </Link>
      </div>

      {/* 2. Current Location (Section 10) */}
      <div className="relative flex items-center gap-2" ref={searchRef}>
        <div className="flex items-center bg-[#0d1322] border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-left font-bold text-slate-100 hover:text-cyan-300 transition flex items-center gap-1.5 max-w-[180px] sm:max-w-xs truncate cursor-pointer"
            title="Change Location"
          >
            <span className="truncate">{activeLocation}</span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {/* Locate GPS Button */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="ml-2 pl-2 border-l border-slate-700/80 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
            title="Detect GPS Location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'text-cyan-400 animate-spin' : ''}`} />
          </button>
        </div>

        {/* Location Search Modal */}
        {isSearchOpen && (
          <div className="absolute top-12 left-0 w-72 sm:w-80 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, district, or PIN..."
                autoFocus
                className="w-full pl-8 pr-3 py-1.5 bg-[#080c16] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/60 text-xs">
              {searchResults.length > 0 ? (
                searchResults.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onLocationChange(loc.name, [loc.lat, loc.lon]);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left py-2 px-2 hover:bg-slate-800/60 rounded-lg text-slate-200 hover:text-cyan-300 transition flex items-center justify-between"
                  >
                    <span className="truncate">{loc.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">Select</span>
                  </button>
                ))
              ) : searchQuery.length >= 2 ? (
                <div className="py-3 text-center text-slate-500 text-[11px]">No cities found</div>
              ) : (
                <div className="py-2 space-y-1">
                  <div className="text-[10px] uppercase font-mono text-slate-500 font-bold px-1">Suggested Locations</div>
                  {["Sangamner, Maharashtra", "Nashik, Maharashtra", "Mumbai, Maharashtra", "Pune, Maharashtra"].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        onLocationChange(preset);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left py-1.5 px-2 hover:bg-slate-800/60 rounded-lg text-slate-300 hover:text-cyan-300 transition text-xs"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Live Status + Last Updated + Theme Switcher + User Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        
        {/* Live Status & Data Freshness */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE</span>
          </div>

          <span className="text-slate-400 text-[11px]">
            {isRefreshing ? (
              <span className="text-cyan-300 animate-pulse">Updating atmospheric data...</span>
            ) : (
              `Updated ${secondsAgo}s ago`
            )}
          </span>
        </div>

        {/* Refresh button */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg bg-[#0d1322] border border-slate-800 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
            title="Force Telemetry Sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        )}

        {/* Audio Mute/Unmute Toggle */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-lg bg-[#0d1322] border border-slate-800 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
          title={isMuted ? "Unmute alert tones" : "Mute alert tones"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
        </button>

        {/* Theme Switcher (Section 4 & 10) */}
        <ThemeToggle compact={true} />

        {/* Notification Bell */}
        <Link
          to="/alerts"
          className="relative p-1.5 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
          title="Active Alerts Center"
        >
          <Bell className="w-4 h-4" />
          {alertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
          )}
        </Link>

        {/* User Profile */}
        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-90 transition cursor-pointer"
        >
          {user ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-cyan-400/50"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
          )}
        </Link>
      </div>

    </header>
  );
};
