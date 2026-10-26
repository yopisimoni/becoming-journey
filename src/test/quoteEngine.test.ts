import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  PHILOSOPHICAL_QUOTES,
  getRandomQuote,
  getSessionQuote,
  rotateSessionQuote,
  fetchAiStageGreeting,
} from '@/lib/quotes/quoteEngine';

describe('BCM-013 / v0.6: Dynamic Session Wisdom & Quote Engine', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('contains at least 50 rich philosophical quotes', () => {
    expect(PHILOSOPHICAL_QUOTES.length).toBeGreaterThanOrEqual(50);
    PHILOSOPHICAL_QUOTES.forEach((q) => {
      expect(q.id).toBeTruthy();
      expect(q.quote).toBeTruthy();
      expect(q.author).toBeTruthy();
      expect(q.theme).toBeTruthy();
    });
  });

  it('avoids immediate back-to-back repetitions with getRandomQuote', () => {
    const firstQuote = PHILOSOPHICAL_QUOTES[0];
    for (let i = 0; i < 20; i++) {
      const next = getRandomQuote(firstQuote.id);
      expect(next.id).not.toBe(firstQuote.id);
    }
  });

  it('caches the session quote in sessionStorage and rotates on demand', () => {
    const initial = getSessionQuote();
    expect(initial).toBeDefined();
    expect(sessionStorage.getItem('becoming_session_quote_v1')).toContain(initial.id);

    // Repeated call in the same session returns identical quote
    const secondCall = getSessionQuote();
    expect(secondCall.id).toBe(initial.id);

    // Explicit rotate generates a new quote and updates storage
    const rotated = rotateSessionQuote();
    expect(rotated.id).not.toBe(initial.id);
    expect(sessionStorage.getItem('becoming_session_quote_v1')).toContain(rotated.id);
  });

  it('fetchAiStageGreeting returns null when AI is disabled or keys are missing', async () => {
    const resDisabled = await fetchAiStageGreeting(
      { enabled: false, apiKey: '', endpoint: '' },
      'The Spark',
      'The quiet ember of awareness'
    );
    expect(resDisabled).toBeNull();

    const resNoKey = await fetchAiStageGreeting(
      { enabled: true, apiKey: '', endpoint: 'https://api.openai.com/v1/chat/completions' },
      'The Spark',
      'The quiet ember'
    );
    expect(resNoKey).toBeNull();
  });

  it('fetchAiStageGreeting safely falls back to null when network request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network offline'));

    const res = await fetchAiStageGreeting(
      { enabled: true, apiKey: 'sk-test', endpoint: 'https://api.openai.com/v1/chat/completions' },
      'The Sovereign',
      'Quiet self-mastery'
    );

    expect(res).toBeNull();
  });

  it('fetchAiStageGreeting parses valid AI response and marks quote as isAiGenerated', async () => {
    const mockPayload = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              quote: 'May your steps today be as unhurried as the sunrise.',
              theme: 'Patient Dawn',
              author: 'Sanctuary Mirror',
            }),
          },
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockPayload,
    } as unknown as Response);

    const res = await fetchAiStageGreeting(
      { enabled: true, apiKey: 'sk-test', endpoint: 'https://api.openai.com/v1/chat/completions' },
      'The Architect',
      'Intentional craft'
    );

    expect(res).not.toBeNull();
    expect(res?.quote).toBe('May your steps today be as unhurried as the sunrise.');
    expect(res?.theme).toBe('Patient Dawn');
    expect(res?.isAiGenerated).toBe(true);
  });
});
