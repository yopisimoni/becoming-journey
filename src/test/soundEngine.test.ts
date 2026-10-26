import { describe, it, expect } from 'vitest';
import { soundEngine } from '@/lib/audio/soundEngine';

describe('Web Audio Sound Engine', () => {
  it('instantiates the sound engine singleton without throwing', () => {
    expect(soundEngine).toBeDefined();
    expect(typeof soundEngine.setPreset).toBe('function');
    expect(typeof soundEngine.playSingingBowlChime).toBe('function');
    expect(typeof soundEngine.stopAll).toBe('function');
  });

  it('safely handles preset switching and singing bowl triggers in headless/jsdom environment', () => {
    expect(() => {
      soundEngine.setPreset('sanctuary');
      soundEngine.setPreset('rain');
      soundEngine.setPreset('bowl');
      soundEngine.playSingingBowlChime();
      soundEngine.setPreset('none');
      soundEngine.stopAll();
    }).not.toThrow();
  });
});
