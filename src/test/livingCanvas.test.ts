import { describe, it, expect } from 'vitest';
import {
  getCircadianPhase,
  CIRCADIAN_PALETTES,
  LIVING_MOTION,
} from '@/lib/theme/livingCanvasTokens';

describe('Living Canvas & Circadian Motion Architecture (v0.9)', () => {
  it('correctly calculates circadian phases across a 24-hour cycle', () => {
    // Dawn: 5am - 9am
    expect(getCircadianPhase(5)).toBe('dawn');
    expect(getCircadianPhase(7)).toBe('dawn');
    expect(getCircadianPhase(9)).toBe('dawn');

    // Day: 10am - 4pm
    expect(getCircadianPhase(10)).toBe('day');
    expect(getCircadianPhase(12)).toBe('day');
    expect(getCircadianPhase(16)).toBe('day');

    // Dusk: 5pm - 8pm
    expect(getCircadianPhase(17)).toBe('dusk');
    expect(getCircadianPhase(19)).toBe('dusk');
    expect(getCircadianPhase(20)).toBe('dusk');

    // Night: 9pm - 4am
    expect(getCircadianPhase(21)).toBe('night');
    expect(getCircadianPhase(23)).toBe('night');
    expect(getCircadianPhase(0)).toBe('night');
    expect(getCircadianPhase(3)).toBe('night');
  });

  it('provides complete circadian color palettes for all 4 phases', () => {
    const phases: Array<keyof typeof CIRCADIAN_PALETTES> = ['dawn', 'day', 'dusk', 'night'];

    phases.forEach((p) => {
      const palette = CIRCADIAN_PALETTES[p];
      expect(palette).toBeDefined();
      expect(palette.name).toBeTruthy();
      expect(palette.canvasBg).toMatch(/^#|^rgba/);
      expect(palette.accentPrimary).toMatch(/^#|^rgba/);
      expect(palette.accentSecondary).toMatch(/^#|^rgba/);
      expect(palette.glowColor).toMatch(/^#|^rgba/);
      expect(palette.textPrimary).toMatch(/^#|^rgba/);
    });
  });

  it('exports high-performance Apple-grade motion specifications', () => {
    expect(LIVING_MOTION.gentleEase).toEqual([0.16, 1, 0.3, 1]);
    expect(LIVING_MOTION.springSnappy.stiffness).toBe(260);
    expect(LIVING_MOTION.springSnappy.damping).toBe(24);
    expect(LIVING_MOTION.springGentle.stiffness).toBe(120);
    expect(LIVING_MOTION.springGentle.damping).toBe(18);
  });
});
