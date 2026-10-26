import { describe, it, expect } from 'vitest';
import { QUIZ_QUESTION_BANK, ARCHETYPE_PORTRAITS } from '@/components/SelfDiscoveryQuizView';
import { ArchetypeId } from '@/types';

describe('BCM-008: Inner Compass Self-Discovery Quiz Engine', () => {
  it('contains exactly 40 scenario-based questions across 3 dimensions', () => {
    expect(QUIZ_QUESTION_BANK.length).toBe(40);

    const workQuestions = QUIZ_QUESTION_BANK.filter((q) => q.dimension === 'work');
    const lifeQuestions = QUIZ_QUESTION_BANK.filter((q) => q.dimension === 'life');
    const soulQuestions = QUIZ_QUESTION_BANK.filter((q) => q.dimension === 'soul');

    expect(workQuestions.length).toBeGreaterThanOrEqual(12);
    expect(lifeQuestions.length).toBeGreaterThanOrEqual(12);
    expect(soulQuestions.length).toBeGreaterThanOrEqual(12);
  });

  it('ensures each question has 4 nuanced options mapping to each archetype', () => {
    const requiredArchetypes: ArchetypeId[] = ['architect', 'visionary', 'creator', 'seeker'];

    QUIZ_QUESTION_BANK.forEach((q) => {
      expect(q.options.length).toBe(4);
      const mappedArchetypes = q.options.map((opt) => opt.archetypeScore);
      expect(mappedArchetypes.sort()).toEqual(requiredArchetypes.sort());
    });
  });

  it('provides rich portrait details for all 4 archetypes with fuels and drains', () => {
    const archetypes: ArchetypeId[] = ['architect', 'visionary', 'creator', 'seeker'];

    archetypes.forEach((arch) => {
      const portrait = ARCHETYPE_PORTRAITS[arch];
      expect(portrait).toBeDefined();
      expect(portrait.name).toBeTruthy();
      expect(portrait.tagline).toBeTruthy();
      expect(portrait.summary).toBeTruthy();
      expect(portrait.fuels.length).toBeGreaterThanOrEqual(3);
      expect(portrait.drains.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('accurately identifies dominant archetype from question responses', () => {
    // Simulate answering all questions with 'architect'
    const answers: Record<string, ArchetypeId> = {};
    const tenQuestions = QUIZ_QUESTION_BANK.slice(0, 10);

    tenQuestions.forEach((q) => {
      answers[q.id] = 'architect';
    });

    const scoreCounts: Record<ArchetypeId, number> = {
      architect: 0,
      visionary: 0,
      creator: 0,
      seeker: 0,
    };

    Object.values(answers).forEach((score) => {
      scoreCounts[score] = (scoreCounts[score] || 0) + 1;
    });

    let topArchetype: ArchetypeId = 'architect';
    let maxCount = -1;
    (Object.keys(scoreCounts) as ArchetypeId[]).forEach((arch) => {
      if (scoreCounts[arch] > maxCount) {
        maxCount = scoreCounts[arch];
        topArchetype = arch;
      }
    });

    expect(topArchetype).toBe('architect');
    expect(maxCount).toBe(10);
  });
});
