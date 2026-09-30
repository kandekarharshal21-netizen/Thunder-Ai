import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-[#0d1322] border border-slate-800 rounded-xl p-0.5 text-xs font-mono">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-lg transition cursor-pointer ${
          theme === 'light'
            ? 'bg-amber-500/20 text-amber-300 font-bold shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Light Mode"
      >
        <Sun className="w-3.5 h-3.5" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-lg transition cursor-pointer ${
          theme === 'dark'
            ? 'bg-cyan-500/20 text-cyan-300 font-bold shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
        title="Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
      </button>

      {!compact && (
        <button
          onClick={() => setTheme('system')}
          className={`p-1.5 rounded-lg transition cursor-pointer ${
            theme === 'system'
              ? 'bg-slate-700/60 text-slate-200 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="System Preference"
        >
          <Laptop className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
