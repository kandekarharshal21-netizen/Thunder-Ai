import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant = 'full'
}) => {
  const sizeMap = {
    sm: { img: 'w-7 h-7', text: 'text-sm', badge: 'text-[9px]' },
    md: { img: 'w-9 h-9', text: 'text-base', badge: 'text-[10px]' },
    lg: { img: 'w-12 h-12', text: 'text-xl', badge: 'text-xs' },
    xl: { img: 'w-16 h-16', text: 'text-2xl', badge: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official THUNDER AI Circular Emblem Badge */}
      <div className={`relative ${currentSize.img} rounded-xl overflow-hidden shrink-0 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500/40 hover:ring-cyan-400 transition bg-slate-950 flex items-center justify-center`}>
        <img
          src="/logo.png"
          alt="THANDER AI Official Emblem"
          className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
          onError={(e) => {
            // Fallback SVG if image not yet loaded
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {/* Brand Typography */}
      {showText && variant === 'full' && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-wider text-white ${currentSize.text} font-mono`}>
              THANDER
            </span>
            <span className={`px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-extrabold border border-cyan-500/30 ${currentSize.badge}`}>
              AI
            </span>
          </div>
          <span className="text-[9px] text-slate-400 font-mono tracking-tight mt-0.5 font-medium hidden sm:block">
            ATMOSPHERIC NOWCASTING
          </span>
        </div>
      )}
    </div>
  );
};
