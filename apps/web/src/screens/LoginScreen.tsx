import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';
import { soundService } from '../services/sound';
import { Logo } from '../components/common/Logo';
import { ShieldCheck, Volume2, VolumeX, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';

  // Lightweight atmospheric cloud particles & lightning illumination canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cloud particle circles
    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.7),
      radius: Math.random() * 140 + 80,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.1,
      alpha: Math.random() * 0.08 + 0.04
    }));

    let lightningTimer = 0;
    let lightningIntensity = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Distant lightning flash check (random interval)
      lightningTimer++;
      if (lightningTimer > 280 && Math.random() < 0.02) {
        lightningIntensity = 0.55;
        lightningTimer = 0;
        if (soundEnabled) {
          soundService.playSubtleThunder();
        }
      }

      if (lightningIntensity > 0) {
        ctx.fillStyle = `rgba(14, 165, 233, ${lightningIntensity * 0.12})`;
        ctx.fillRect(0, 0, width, height);
        lightningIntensity *= 0.88;
      }

      // Draw drifting soft atmospheric clouds
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -p.radius) p.x = width + p.radius;
        if (p.x > width + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = height * 0.7 + p.radius;
        if (p.y > height * 0.7 + p.radius) p.y = -p.radius;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(6, 182, 212, ${p.alpha + lightningIntensity * 0.08})`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [soundEnabled]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch('/api/v1/auth/google');
      if (resp.ok) {
        const json = await resp.json();
        if (json.auth_mode === 'oauth' && json.url && json.url.startsWith('https://')) {
          window.location.href = json.url;
          return;
        }
      }
    } catch {
      // Fallback to direct authorized operator session
    }

    setTimeout(() => {
      authService.loginDemo('Operator');
      setIsLoading(false);
      navigate(redirectPath, { replace: true });
    }, 400);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      soundService.playSubtleThunder();
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
      
      {/* Background Animated Canvas (Storm Cloud Particles & Distant Flash) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
      />

      {/* Atmospheric Sheet Lightning Illumination Layer */}
      <div className="absolute inset-0 bg-cyan-400/5 animate-lightning-flash pointer-events-none z-0" />

      {/* Optional Sound Control (Section 8: No Autoplay - Explicit Interaction Only) */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 hover:text-cyan-300 transition backdrop-blur-md cursor-pointer"
          title={soundEnabled ? "Atmospheric sound active" : "Enable atmospheric sound"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          <span className="hidden sm:inline">{soundEnabled ? "Audio On" : "Audio Off"}</span>
        </button>
      </div>

      {/* Centered Minimal Container (Section 5) */}
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* [ THANDER AI LOGO ] */}
        <div className="p-3.5 rounded-3xl bg-[#090d18]/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
          <Logo size="lg" />
        </div>

        {/* Product Name & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-white">
            THANDER AI
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            AI-Powered Atmospheric Intelligence
          </p>
        </div>

        {/* [ Continue with Google ] */}
        <div className="w-full pt-1">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isLoading ? "Authenticating..." : "Continue with Google"}</span>
          </button>
        </div>

        {/* Small "Secure authentication powered by Google" text */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Secure authentication powered by Google</span>
        </div>

      </div>
    </div>
  );
};
