/**
 * BECOMING Zero-to-Hero Evolution Engine
 * 5 Stages of Becoming: Organic, non-punishing progression.
 * Strict Invariant: Level and XP never reset or decrease due to missed days.
 */

import { EvolutionStageLevel, EvolutionStageInfo, EvolutionProgress } from '@/types';

export const EVOLUTION_STAGES: EvolutionStageInfo[] = [
  {
    level: 1,
    title: 'The Spark (Zero)',
    subtitle: 'Awakening & Conscious Turning Point',
    mantra: '“I refuse to waste my short life chasing things that hurt my soul.”',
    description:
      'The turning point where you wake up to your life. You realize that drifting aimlessly, scrolling endlessly, or chasing toxic loops is a waste of your precious time. You ignite the quiet spark to change.',
    requiredXp: 0,
  },
  {
    level: 2,
    title: 'The Seeker',
    subtitle: 'Radical Self-Inquiry & Honesty',
    mantra: '“I ask honest questions to know who I truly am and why I react.”',
    description:
      'You look in the mirror with courageous tenderness. You take self-discovery quizzes, investigate your root patterns, and face your flaws without shame or pretense.',
    requiredXp: 100,
  },
  {
    level: 3,
    title: 'The Observer',
    subtitle: 'Unhurried Breath & Stillness',
    mantra: '“I take it easy, breathe deeply, and observe my thoughts without panic.”',
    description:
      'You learn the power of the space between stimulus and response. You stop frantically jumping from thought to thought. You sit in quiet stillness, breathe with the lotus, and let storms pass.',
    requiredXp: 250,
  },
  {
    level: 4,
    title: 'The Architect',
    subtitle: 'Breaking Bad Habits & Building Boundaries',
    mantra: '“I am good, but never used. I build my days with quiet boundaries and clean habits.”',
    description:
      'You stop letting people walk over you. You put down cigarettes, doomscrolling, and toxic habits. You plant supportive routines, nourish your body, and construct a sanctuary of order and health.',
    requiredXp: 500,
  },
  {
    level: 5,
    title: 'The Sovereign (Hero)',
    subtitle: 'Peaceful Mastery & Living Rightly',
    mantra: '“I live with grounded responsibility. My dreams come true because I live rightly today.”',
    description:
      'The hero of your own life story. You walk with grounded self-responsibility, generous empathy, and unshakable inner peace. You don’t judge others; you make your highest dreams real by living honorably every single day.',
    requiredXp: 1000,
  },
];

export function calculateEvolutionLevel(xp: number): EvolutionStageLevel {
  if (xp >= 1000) return 5;
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}

export function getStageInfo(level: EvolutionStageLevel): EvolutionStageInfo {
  return EVOLUTION_STAGES.find((s) => s.level === level) || EVOLUTION_STAGES[0];
}

export function getNextStageInfo(level: EvolutionStageLevel): EvolutionStageInfo | null {
  if (level >= 5) return null;
  return EVOLUTION_STAGES.find((s) => s.level === level + 1) || null;
}

export const INITIAL_EVOLUTION_PROGRESS: EvolutionProgress = {
  totalXp: 50, // Starting spark
  currentLevel: 1,
  activitiesCompleted: 1,
  history: [
    {
      activity: 'Ignited The Spark of Becoming',
      xpEarned: 50,
      timestamp: new Date().toISOString(),
    },
  ],
};
