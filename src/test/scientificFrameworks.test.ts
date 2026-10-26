import { describe, it, expect } from 'vitest';
import {
  SCIENTIFIC_FRAMEWORKS,
  BIG5_QUESTIONS,
  scoreBig5,
  LOCUS_QUESTIONS,
  scoreLocus,
  EQ_SQ_QUESTIONS,
  scoreEqSq,
  MBTI_QUESTIONS,
  scoreMbti,
  TRUE_COLOURS_QUESTIONS,
  scoreTrueColours,
} from '@/lib/frameworks/scientificQuizzes';

describe('Scientific Self-Discovery Frameworks', () => {
  it('defines 5 world-renowned psychological assessments with valid metadata', () => {
    expect(SCIENTIFIC_FRAMEWORKS).toHaveLength(5);
    const ids = SCIENTIFIC_FRAMEWORKS.map((f) => f.id);
    expect(ids).toContain('big5');
    expect(ids).toContain('locus_of_control');
    expect(ids).toContain('empathizing_systemizing');
    expect(ids).toContain('mbti16');
    expect(ids).toContain('true_colours');
  });

  describe('1. Big 5 Personality (OCEAN Rhythm)', () => {
    it('has 10 non-judgmental OCEAN questions with 4 options each', () => {
      expect(BIG5_QUESTIONS).toHaveLength(10);
      BIG5_QUESTIONS.forEach((q) => {
        expect(q.prompt).toBeTruthy();
        expect(q.options.length).toBeGreaterThanOrEqual(4);
      });
    });

    it('scores Big 5 OCEAN dimensions accurately', () => {
      const sampleAnswers: Record<string, number> = {
        b5_1: 4,
        b5_2: 3,
        b5_3: 4,
        b5_4: 4,
        b5_5: 3,
        b5_6: 4,
        b5_7: 3,
        b5_8: 4,
        b5_9: 4,
        b5_10: 3,
      };
      const result = scoreBig5(sampleAnswers);
      expect(result.frameworkId).toBe('big5');
      expect(result.primaryResult).toBeTruthy();
      expect(result.summary).toBeTruthy();
      expect(result.strengths.length).toBeGreaterThan(0);
      expect(result.growthEdges.length).toBeGreaterThan(0);
      expect(result.empoweringMantra).toBeTruthy();
    });
  });

  describe('2. Locus of Control (The Agency Mirror)', () => {
    it('has 8 Julian Rotter agency questions', () => {
      expect(LOCUS_QUESTIONS).toHaveLength(8);
    });

    it('identifies internal sovereignty vs external drift accurately', () => {
      const internalAnswers: Record<string, number> = {
        loc_1: 4,
        loc_2: 4,
        loc_3: 4,
        loc_4: 4,
        loc_5: 4,
        loc_6: 4,
        loc_7: 4,
        loc_8: 4,
      };
      const result = scoreLocus(internalAnswers);
      expect(result.frameworkId).toBe('locus_of_control');
      expect(result.primaryResult).toContain('Sovereign');
      expect(result.scores.internal_agency).toBeGreaterThan(70);
    });
  });

  describe('3. Empathizing–Systemizing (Cognitive Lens)', () => {
    it('has 10 Baron-Cohen EQ vs SQ questions', () => {
      expect(EQ_SQ_QUESTIONS).toHaveLength(10);
    });

    it('computes empathizing and systemizing scores and generates cognitive profile', () => {
      const answers: Record<string, number> = {
        eq_sq_1: 4,
        eq_sq_2: 4,
        eq_sq_3: 4,
        eq_sq_4: 4,
        eq_sq_5: 4,
        eq_sq_6: 2,
        eq_sq_7: 2,
        eq_sq_8: 2,
        eq_sq_9: 2,
        eq_sq_10: 2,
      };
      const result = scoreEqSq(answers);
      expect(result.frameworkId).toBe('empathizing_systemizing');
      expect(result.scores.empathizing).toBeGreaterThan(0);
      expect(result.scores.systemizing).toBeGreaterThan(0);
    });
  });

  describe('4. Personality Type Indicator (16-Type Compass)', () => {
    it('has 12 MBTI questions covering E/I, S/N, T/F, J/P', () => {
      expect(MBTI_QUESTIONS).toHaveLength(12);
    });

    it('synthesizes a 4-letter type and career/relationship guidance', () => {
      const answers: Record<string, number> = {
        mb_1: 1, // I
        mb_2: 1, // I
        mb_3: 1, // I
        mb_4: 2, // N
        mb_5: 2, // N
        mb_6: 2, // N
        mb_7: 2, // F
        mb_8: 2, // F
        mb_9: 2, // F
        mb_10: 1, // J
        mb_11: 1, // J
        mb_12: 1, // J
      };
      const result = scoreMbti(answers);
      expect(result.frameworkId).toBe('mbti16');
      expect(result.primaryResult).toContain('INFJ');
      expect(result.summary).toBeTruthy();
    });
  });

  describe('5. True Colours Temperament (Communication Blueprint)', () => {
    it('has 8 temperament questions covering Green, Blue, Gold, Orange', () => {
      expect(TRUE_COLOURS_QUESTIONS).toHaveLength(8);
    });

    it('assigns vibrant dominant temperament and communication blueprint', () => {
      const answers: Record<string, number> = {
        tc_1: 2, // Blue
        tc_2: 2, // Blue
        tc_3: 2, // Blue
        tc_4: 2, // Blue
        tc_5: 2, // Blue
        tc_6: 2, // Blue
        tc_7: 2, // Blue
        tc_8: 2, // Blue
      };
      const result = scoreTrueColours(answers);
      expect(result.frameworkId).toBe('true_colours');
      expect(result.primaryResult).toContain('Blue');
    });
  });
});
