import { describe, it, expect } from 'vitest';
import { generateDiscoveryReflection, AISettings, DynamicDiscoveryResult } from '@/lib/engine/aiAdapter';
import { getDictionary } from '@/locales';

describe('aiAdapter: Offline deterministic default & bridge behavior', () => {
  const dict = getDictionary('en');
  const fallbackDefaults: DynamicDiscoveryResult = {
    empatheticMirror: dict.scripts.lost.explorationMirror,
    threeInsights: dict.scripts.lost.diagnostic.threeInsights,
    threeSteps: dict.scripts.lost.diagnostic.threeSteps,
  };

  const disabledConfig: AISettings = {
    enabled: false,
    endpoint: '',
    apiKey: '',
    model: 'gpt-4o-mini',
  };

  it('returns local deterministic insights and steps when AI mode is disabled', async () => {
    const result = await generateDiscoveryReflection({
      intent: 'lost',
      rootFeeling: 'Unsure which path aligns with my values',
      userNotes: 'I feel completely overwhelmed by everything.',
      perspective: 'Give yourself permission to pause without feeling behind',
      fallbackDefaults,
      aiSettings: disabledConfig,
    });

    expect(result.threeInsights.length).toBe(3);
    expect(result.threeSteps.length).toBe(3);
    expect(result.threeInsights[0]).toContain('behind');
  });

  it('safely falls back to local defaults if fetch fails or endpoint is unreachable', async () => {
    const failingConfig: AISettings = {
      enabled: true,
      apiKey: 'test-invalid-key',
      endpoint: 'https://localhost:9999/v1/chat/completions',
      model: 'gpt-4o-mini',
    };

    const result = await generateDiscoveryReflection({
      intent: 'goal',
      rootFeeling: 'Big vision, unclear first step',
      userNotes: 'I want to write a book',
      perspective: 'Break the project down',
      fallbackDefaults: {
        empatheticMirror: dict.scripts.goal.explorationMirror,
        threeInsights: dict.scripts.goal.diagnostic.threeInsights,
        threeSteps: dict.scripts.goal.diagnostic.threeSteps,
      },
      aiSettings: failingConfig,
    });

    expect(result.threeInsights.length).toBe(3);
    expect(result.threeSteps.length).toBe(3);
  });
});
