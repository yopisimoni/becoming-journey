import { describe, it, expect } from 'vitest';
import { soundEngine, SoundscapePreset } from '@/lib/audio/soundEngine';

describe('Web Audio Sound Engine', () => {
  it('instantiates the sound engine singleton without throwing', () => {
    expect(soundEngine).toBeDefined();
    expect(typeof soundEngine.setPreset).toBe('function');
    expect(typeof soundEngine.playSingingBowlChime).toBe('function');
    expect(typeof soundEngine.playBreathBell).toBe('function');
    expect(typeof soundEngine.playCompletionChime).toBe('function');
    expect(typeof soundEngine.setVolume).toBe('function');
    expect(typeof soundEngine.stopAll).toBe('function');
  });

  it('safely handles all 10 procedural track presets and volume adjustments', () => {
    const tracks: SoundscapePreset[] = [
      'sanctuary',
      'solfeggio',
      'bowl',
      'rain',
      'ocean',
      'alpha',
      'rhodes',
      'brown',
      'breeze',
      'hearth',
    ];

    expect(() => {
      tracks.forEach((t) => {
        soundEngine.setPreset(t);
      });
      soundEngine.setVolume(0.5);
      soundEngine.playSingingBowlChime();
      soundEngine.playBreathBell();
      soundEngine.playCompletionChime();
      soundEngine.setPreset('none');
      soundEngine.stopAll();
    }).not.toThrow();
  });
});
