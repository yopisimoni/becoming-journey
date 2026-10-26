/**
 * BECOMING Soundscape Engine (Web Audio API)
 * 100% procedural, zero-dependency, zero remote network requests.
 */

export type SoundscapePreset = 'none' | 'sanctuary' | 'rain' | 'bowl';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentPreset: SoundscapePreset = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private isMuted: boolean = false;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public getPreset(): SoundscapePreset {
    return this.currentPreset;
  }

  public stopAll(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    
    // Quick ramp down
    try {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
    } catch {
      // ignore
    }

    setTimeout(() => {
      this.activeNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch {
          // ignore
        }
      });
      this.activeNodes = [];
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      }
    }, 350);
  }

  public setPreset(preset: SoundscapePreset): void {
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    this.stopAll();
    this.currentPreset = preset;

    if (preset === 'none' || this.isMuted) {
      return;
    }

    setTimeout(() => {
      if (this.currentPreset !== preset || this.isMuted) return;

      switch (preset) {
        case 'sanctuary':
          this.playWarmSanctuary();
          break;
        case 'rain':
          this.playSoftRain();
          break;
        case 'bowl':
          this.playGentleBowlDrone();
          break;
      }
    }, 400);
  }

  /**
   * Preset 1: Warm Sanctuary
   * 432Hz & 528Hz Solfeggio harmonic drone with gentle LFO filtering
   */
  private playWarmSanctuary(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, now);

    // LFO for breathing filter movement
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, now); // ~12 second breath cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(140, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);

    // Frequencies: 216Hz, 432Hz, 528Hz (warm fifths and healing harmonics)
    const freqs = [216, 216.5, 432, 433.2, 528];
    const gains = [0.22, 0.18, 0.15, 0.12, 0.08];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);

      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(gains[idx], now + 2.5);

      osc.connect(g);
      g.connect(filter);
      osc.start(now);

      this.activeNodes.push(osc, g);
    });

    filter.connect(this.masterGain);
    this.activeNodes.push(lfo, lfoGain, filter);
  }

  /**
   * Preset 2: Soft Rain
   * Procedural pink/brown noise with soft warm lowpass filter
   */
  private playSoftRain(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 3; // 3-second noise loop
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Pink/brown integration
      lastOut = output[i];
      output[i] *= 2.8; // Gain boost
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 2);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start(now);

    this.activeNodes.push(whiteNoise, filter, gain);
  }

  /**
   * Preset 3: Continuous gentle singing bowl hum
   */
  private playGentleBowlDrone(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freqs = [172.06, 344.12, 516.18]; // Om / Platonic Year tone
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + 3);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);

      this.activeNodes.push(osc, gain);
    });
  }

  /**
   * One-shot Singing Bowl Chime for gentle card transitions or insight confirmation
   */
  public playSingingBowlChime(): void {
    const ctx = this.initContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0.001, now);
    chimeGain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

    // Harmonic singing bowl partials
    const partials = [
      { freq: 432, gain: 0.6 },
      { freq: 864, gain: 0.25 },
      { freq: 1188, gain: 0.15 },
    ];

    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, now);

      pGain.gain.setValueAtTime(p.gain, now);

      osc.connect(pGain);
      pGain.connect(chimeGain);

      osc.start(now);
      osc.stop(now + 3.3);
    });

    chimeGain.connect(ctx.destination);

    setTimeout(() => {
      chimeGain.disconnect();
    }, 3400);
  }
}

export const soundEngine = new SoundEngine();
