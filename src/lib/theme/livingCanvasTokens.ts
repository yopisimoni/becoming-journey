/**
 * BECOMING — Circadian Living Canvas Design Tokens (v0.9)
 * Centralized theme tokens, circadian calculations, motion configs, and color palettes.
 */

export type CircadianPhase = 'dawn' | 'day' | 'dusk' | 'night';

export interface CircadianPalette {
  name: string;
  canvasBg: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  accentSecondary: string;
  glowColor: string;
  gradientMesh: string;
}

export const CIRCADIAN_PALETTES: Record<CircadianPhase, CircadianPalette> = {
  dawn: {
    name: 'Sunrise Amber (Dawn)',
    canvasBg: '#FFFDF9',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    cardBorder: 'rgba(217, 119, 54, 0.15)',
    textPrimary: '#1A1D20',
    textSecondary: '#64748B',
    accentPrimary: '#D97736', // Sunrise Amber
    accentSecondary: '#F3BB91', // Soft Peach
    glowColor: 'rgba(217, 119, 54, 0.25)',
    gradientMesh: 'from-amber-100/40 via-orange-50/30 to-rose-100/20',
  },
  day: {
    name: 'Daylight Alabaster & Sage',
    canvasBg: '#FBF9F5', // Alabaster
    cardBg: 'rgba(255, 255, 255, 0.95)',
    cardBorder: 'rgba(91, 123, 109, 0.16)',
    textPrimary: '#1A1D20', // Heading Ink
    textSecondary: '#475569',
    accentPrimary: '#5B7B6D', // Botanical Sage
    accentSecondary: '#D97736',
    glowColor: 'rgba(91, 123, 109, 0.2)',
    gradientMesh: 'from-emerald-50/40 via-stone-50/30 to-amber-50/20',
  },
  dusk: {
    name: 'Twilight Slate & Dusk',
    canvasBg: '#131A2B', // Twilight Slate
    cardBg: 'rgba(19, 26, 43, 0.85)',
    cardBorder: 'rgba(129, 140, 248, 0.2)',
    textPrimary: '#F1F5F9', // Soft White
    textSecondary: '#94A3B8',
    accentPrimary: '#818CF8', // Lavender Glow
    accentSecondary: '#38BDF8', // Cyan Atmosphere
    glowColor: 'rgba(129, 140, 248, 0.3)',
    gradientMesh: 'from-indigo-950/70 via-purple-950/40 to-slate-900/60',
  },
  night: {
    name: 'Velvet Obsidian Sanctuary',
    canvasBg: '#0B0F19', // Velvet Obsidian
    cardBg: 'rgba(11, 15, 25, 0.9)',
    cardBorder: 'rgba(56, 189, 248, 0.16)',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    accentPrimary: '#38BDF8', // Cyan Atmosphere
    accentSecondary: '#818CF8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    gradientMesh: 'from-slate-950/90 via-indigo-950/60 to-black',
  },
};

/**
 * Derives current circadian phase from a given hour (0-23).
 * Defaults to current local hour.
 */
export function getCircadianPhase(hour: number = new Date().getHours()): CircadianPhase {
  if (hour >= 5 && hour < 10) return 'dawn';
  if (hour >= 10 && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'dusk';
  return 'night';
}

/**
 * Reusable Apple-grade Framer Motion curves and easing specs.
 */
export const LIVING_MOTION = {
  // Apple-standard gentle decelerate curve for page/card entrances
  gentleEase: [0.16, 1, 0.3, 1] as const,
  // Smooth spring curve for responsive touch elements
  springSnappy: {
    type: 'spring' as const,
    stiffness: 260,
    damping: 24,
  },
  springGentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 18,
  },
  // Continuous breathing cycle sine curve
  breathingWave: {
    duration: 5.5,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: [0.45, 0.05, 0.55, 0.95] as const,
  },
  // Reduced-motion immediate fallback
  reducedInstant: {
    duration: 0,
  },
};
