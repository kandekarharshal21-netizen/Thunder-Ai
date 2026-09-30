// Audio Synthesizer service conforming to Section 31, 32, and 74
// Generates professional warning tones without external audio dependencies

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    const saved = localStorage.getItem('thander-sound-muted');
    this.isMuted = saved === 'true';
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('thander-sound-muted', String(muted));
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play alert tone based on severity
  public playAlert(severity: 'INFO' | 'WARNING' | 'SEVERE' = 'WARNING') {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (severity === 'INFO') {
        // Clean single chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (severity === 'WARNING') {
        // Dual-tone atmospheric pulse
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.setValueAtTime(554.37, now + 0.12); // C#5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.08, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        // Severe: Urgent dual-frequency pulse (10 seconds)
        osc.type = 'sawtooth';
        
        // Create 20 rapid pulses over 10 seconds
        for (let i = 0; i < 20; i++) {
          osc.frequency.setValueAtTime(740, now + i * 0.5);
          osc.frequency.setValueAtTime(587, now + i * 0.5 + 0.25);
        }
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.setValueAtTime(0.15, now + 9.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 10.0);
        osc.start(now);
        osc.stop(now + 10.0);
      }
    } catch (e) {
      // Audio autoplay restrictions or context blocked
    }
  }

  // Optional subtle low thunder rumble for explicit user interaction
  public playSubtleThunder() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise synthesis
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        data[i] = (b0 + b1 + b2) * 0.1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Low pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, now);
      filter.frequency.exponentialRampToValueAtTime(45, now + 1.2);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 1.5);
    } catch (e) {}
  }
}

export const soundService = new SoundService();
