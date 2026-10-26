import { describe, it, expect } from 'vitest';
import {
  EVOLUTION_STAGES,
  calculateEvolutionLevel,
  getStageInfo,
  getNextStageInfo,
  INITIAL_EVOLUTION_PROGRESS,
} from '@/lib/evolution/evolutionEngine';

describe('Zero-to-Hero Evolution Engine', () => {
  it('defines 5 progression stages from Spark to Sovereign', () => {
    expect(EVOLUTION_STAGES).toHaveLength(5);
    expect(EVOLUTION_STAGES[0].title).toBe('The Spark (Zero)');
    expect(EVOLUTION_STAGES[1].title).toBe('The Seeker');
    expect(EVOLUTION_STAGES[2].title).toBe('The Observer');
    expect(EVOLUTION_STAGES[3].title).toBe('The Architect');
    expect(EVOLUTION_STAGES[4].title).toBe('The Sovereign (Hero)');
  });

  it('calculates levels strictly based on monotonic XP without penalties', () => {
    expect(calculateEvolutionLevel(0)).toBe(1);
    expect(calculateEvolutionLevel(99)).toBe(1);
    expect(calculateEvolutionLevel(100)).toBe(2);
    expect(calculateEvolutionLevel(249)).toBe(2);
    expect(calculateEvolutionLevel(250)).toBe(3);
    expect(calculateEvolutionLevel(499)).toBe(3);
    expect(calculateEvolutionLevel(500)).toBe(4);
    expect(calculateEvolutionLevel(999)).toBe(4);
    expect(calculateEvolutionLevel(1000)).toBe(5);
    expect(calculateEvolutionLevel(5000)).toBe(5);
  });

  it('retrieves stage info and next stage appropriately', () => {
    const stage2 = getStageInfo(2);
    expect(stage2.level).toBe(2);
    expect(stage2.title).toBe('The Seeker');

    const nextFrom2 = getNextStageInfo(2);
    expect(nextFrom2?.level).toBe(3);
    expect(nextFrom2?.title).toBe('The Observer');

    const nextFrom5 = getNextStageInfo(5);
    expect(nextFrom5).toBeNull();
  });

  it('starts with non-punishing initial progress', () => {
    expect(INITIAL_EVOLUTION_PROGRESS.totalXp).toBeGreaterThanOrEqual(0);
    expect(INITIAL_EVOLUTION_PROGRESS.currentLevel).toBe(1);
    expect(INITIAL_EVOLUTION_PROGRESS.history.length).toBeGreaterThan(0);
  });
});
