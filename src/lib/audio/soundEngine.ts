/**
 * BECOMING Soundscape Engine (Web Audio API)
 * 10-Track Procedural Synthesizer.
 * 100% procedural, zero-dependency, zero remote network requests.
 */

export type SoundscapePreset =
  | 'none'
  | 'sanctuary'
  | 'solfeggio'
  | 'bowl'
  | 'rain'
  | 'ocean'
  | 'alpha'
  | 'rhodes'
  | 'brown'
  | 'breeze'
  | 'hearth';

export type SoundscapeCategory = 'calm' | 'focus' | 'nature';

export interface SoundscapeTrackMeta {
  id: SoundscapePreset;
  category: SoundscapeCategory;
  defaultLabel: string;
  description: string;
}

export const SOUNDSCAPE_TRACKS: SoundscapeTrackMeta[] = [
  // Calm & Relief
  { id: 'sanctuary', category: 'calm', defaultLabel: '432Hz Sanctuary Pad', description: 'Harmonic fifths and slow LFO lowpass breath' },
  { id: 'solfeggio', category: 'calm', defaultLabel: '528Hz Harmonic Resonance', description: 'Harmonic acoustic resonance for deep relaxation and calm' },
  { id: 'bowl', category: 'calm', defaultLabel: 'Tibetan Singing Bowls', description: 'Rich harmonic overtones with subtle acoustic beating' },
  { id: 'rain', category: 'calm', defaultLabel: 'Midnight Rain', description: 'Gentle pink/brown noise and soft lowpass rain drops' },
  { id: 'ocean', category: 'calm', defaultLabel: 'Ocean Tide Waves', description: 'Slow 8-second sinusoidal gain swells mimicking ocean surf' },
  // Focus & Clarity
  { id: 'alpha', category: 'focus', defaultLabel: 'Alpha Wave Focus (10Hz)', description: 'Calm 10Hz binaural pulse for focused clarity' },
  { id: 'rhodes', category: 'focus', defaultLabel: 'Ambient Rhodes Chords', description: 'Warm electric piano modal triad chords with chorus' },
  { id: 'brown', category: 'focus', defaultLabel: 'Velvet Brown Noise', description: 'Deep low-pass Brownian noise for deep cognitive calm' },
  // Nature & Warmth
  { id: 'breeze', category: 'nature', defaultLabel: 'Forest Breeze', description: 'Modulated whisper of gentle wind through trees' },
  { id: 'hearth', category: 'nature', defaultLabel: 'Cozy Hearth Fire', description: 'Warm low rumble with subtle organic crackles' },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private currentPreset: SoundscapePreset = 'none';
  private masterGain: GainNode | null = null;
  private volume: number = 0.65; // User volume 0.0 - 1.0
  private baseGainValue: number = 0.22;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private isMuted: boolean = false;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.baseGainValue * this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public getPreset(): SoundscapePreset {
    return this.currentPreset;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(val: number): void {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.baseGainValue * this.volume, now + 0.05);
    }
  }

  public stopAll(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    try {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.25);
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
        this.masterGain.gain.setValueAtTime(this.baseGainValue * this.volume, this.ctx.currentTime);
      }
    }, 300);
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
        case 'solfeggio':
          this.playSolfeggio528();
          break;
        case 'bowl':
          this.playGentleBowlDrone();
          break;
        case 'rain':
          this.playSoftRain();
          break;
        case 'ocean':
          this.playOceanWaves();
          break;
        case 'alpha':
          this.playAlphaWaveFocus();
          break;
        case 'rhodes':
          this.playAmbientRhodes();
          break;
        case 'brown':
          this.playBrownNoise();
          break;
        case 'breeze':
          this.playForestBreeze();
          break;
        case 'hearth':
          this.playHearthFire();
          break;
      }
    }, 350);
  }

  // 1. 432Hz Sanctuary Pad
  private playWarmSanctuary(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(460, now);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.07, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);

    const freqs = [216, 216.5, 432, 433.2, 528];
    const gains = [0.22, 0.18, 0.15, 0.12, 0.08];

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(gains[idx], now + 2);

      osc.connect(g);
      g.connect(filter);
      osc.start(now);
      this.activeNodes.push(osc, g);
    });

    filter.connect(this.masterGain);
    this.activeNodes.push(lfo, lfoGain, filter);
  }

  // 2. 528Hz Solfeggio Peace
  private playSolfeggio528(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freqs = [264, 528, 528.8, 1056];
    const gains = [0.24, 0.28, 0.16, 0.05];

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, now);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(gains[idx], now + 2.5);

      osc.connect(g);
      g.connect(filter);
      osc.start(now);
      this.activeNodes.push(osc, g);
    });

    filter.connect(this.masterGain);
    this.activeNodes.push(filter);
  }

  // 3. Tibetan Singing Bowls
  private playGentleBowlDrone(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const freqs = [172.06, 344.12, 516.18, 688.24];
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15 / (idx + 1), now + 3);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(now);
      this.activeNodes.push(osc, gain);
    });
  }

  // 4. Midnight Rain
  private playSoftRain(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 2.6;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(620, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 2);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    whiteNoise.start(now);

    this.activeNodes.push(whiteNoise, filter, gain);
  }

  // 5. Ocean Tide Waves
  private playOceanWaves(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.6;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.05, now);

    // LFO to oscillate wave swell every 8 seconds
    const waveLfo = ctx.createOscillator();
    waveLfo.frequency.setValueAtTime(0.125, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.25, now);

    waveLfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);
    waveLfo.start(now);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    noiseSource.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.masterGain);
    noiseSource.start(now);

    this.activeNodes.push(noiseSource, waveLfo, lfoGain, filter, waveGain);
  }

  // 6. Alpha Wave Focus (10Hz)
  private playAlphaWaveFocus(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Carrier frequency 216Hz, modulated with 10Hz amplitude tremolo
    const carrier = ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(216, now);

    const tremoloLfo = ctx.createOscillator();
    tremoloLfo.frequency.setValueAtTime(10, now); // 10Hz Alpha rhythm

    const tremoloDepth = ctx.createGain();
    tremoloDepth.gain.setValueAtTime(0.08, now);
    tremoloLfo.connect(tremoloDepth);

    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.18, now);
    tremoloDepth.connect(amp.gain);

    carrier.connect(amp);
    amp.connect(this.masterGain);

    tremoloLfo.start(now);
    carrier.start(now);

    this.activeNodes.push(carrier, tremoloLfo, tremoloDepth, amp);
  }

  // 7. Ambient Rhodes Chords
  private playAmbientRhodes(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Cmaj9 peaceful ambient chord (C3: 130.81, G3: 196, B3: 246.94, D4: 293.66, E4: 329.63)
    const chordFreqs = [130.81, 196.0, 246.94, 293.66, 329.63];
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, now);

    chordFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 / Math.sqrt(idx + 1), now + 3);

      osc.connect(gain);
      gain.connect(filter);
      osc.start(now);
      this.activeNodes.push(osc, gain);
    });

    filter.connect(this.masterGain);
    this.activeNodes.push(filter);
  }

  // 8. Velvet Brown Noise
  private playBrownNoise(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.0;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 1.5);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(now);

    this.activeNodes.push(source, filter, gain);
  }

  // 9. Forest Breeze
  private playForestBreeze(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.8;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, now);
    filter.Q.setValueAtTime(1.8, now);

    const breezeLfo = ctx.createOscillator();
    breezeLfo.frequency.setValueAtTime(0.18, now);
    const breezeDepth = ctx.createGain();
    breezeDepth.gain.setValueAtTime(140, now);
    breezeLfo.connect(breezeDepth);
    breezeDepth.connect(filter.frequency);
    breezeLfo.start(now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 2);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    source.start(now);

    this.activeNodes.push(source, breezeLfo, breezeDepth, filter, gain);
  }

  // 10. Cozy Hearth Fire
  private playHearthFire(): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Warm low-frequency rumble
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(120, now);

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const rumbleGain = ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.001, now);
    rumbleGain.gain.linearRampToValueAtTime(0.22, now + 1.5);

    noise.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.masterGain);
    noise.start(now);

    this.activeNodes.push(noise, rumbleFilter, rumbleGain);
  }

  // One-shot Singing Bowl Chime
  public playSingingBowlChime(): void {
    const ctx = this.initContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const chimeGain = ctx.createGain();
    chimeGain.gain.setValueAtTime(0.001, now);
    chimeGain.gain.linearRampToValueAtTime(0.25 * this.volume, now + 0.05);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

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
    setTimeout(() => chimeGain.disconnect(), 3400);
  }

  // Breath pacing bell chime (soft harmonic bell for breathing studio phase transitions)
  public playBreathBell(type: 'inhale' | 'hold' | 'exhale' | 'rest' = 'inhale'): void {
    const ctx = this.initContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const bellGain = ctx.createGain();
    bellGain.gain.setValueAtTime(0.001, now);
    bellGain.gain.linearRampToValueAtTime(0.18 * this.volume, now + 0.03);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    const baseFreq = type === 'inhale' ? 528 : type === 'hold' ? 660 : 432;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 2, now);

    const osc2Gain = ctx.createGain();
    osc2Gain.gain.setValueAtTime(0.2, now);

    osc.connect(bellGain);
    osc2.connect(osc2Gain);
    osc2Gain.connect(bellGain);

    bellGain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 2.1);
    osc2.stop(now + 2.1);

    setTimeout(() => bellGain.disconnect(), 2200);
  }

  // Completion chime
  public playCompletionChime(): void {
    this.playSingingBowlChime();
  }
}

export const soundEngine = new SoundEngine();
