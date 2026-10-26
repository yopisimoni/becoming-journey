/**
 * BECOMING Optional AI Companion API Bridge
 * 
 * Default: 100% local, offline, deterministic.
 * Zero network calls unless explicitly configured and enabled by the user in settings.
 */

export interface AISettings {
  enabled: boolean;
  endpoint: string; // e.g., 'https://api.openai.com/v1/chat/completions'
  apiKey: string;
  model: string;
}

export const DEFAULT_AI_SETTINGS: AISettings = {
  enabled: false,
  endpoint: '',
  apiKey: '',
  model: 'gpt-4o-mini',
};

export interface DynamicDiscoveryResult {
  empatheticMirror: string;
  threeInsights: [string, string, string];
  threeSteps: [string, string, string];
}

/**
 * Generates discovery reflections either via client-side local deterministic templates (default)
 * or via optional direct user-supplied API endpoint.
 */
export async function generateDiscoveryReflection({
  intent,
  rootFeeling,
  userNotes,
  perspective,
  fallbackDefaults,
  aiSettings,
}: {
  intent: string;
  rootFeeling: string;
  userNotes: string;
  perspective: string;
  fallbackDefaults: DynamicDiscoveryResult;
  aiSettings?: AISettings;
}): Promise<DynamicDiscoveryResult> {
  // If not enabled or no key provided, return pure local fallback instantly
  if (!aiSettings?.enabled || !aiSettings.apiKey.trim() || !aiSettings.endpoint.trim()) {
    return fallbackDefaults;
  }

  try {
    const prompt = `You are a calm, gentle, non-clinical reflection companion for the personal reflection space "BECOMING".
The user feels "${intent}".
Their identified root feeling: "${rootFeeling}".
Their perspective: "${perspective}".
Their notes: "${userNotes || 'None'}".

Respond strictly with valid JSON with these 3 keys:
{
  "empatheticMirror": "One or two sentences mirroring what they are experiencing with deep warmth and zero judgment.",
  "threeInsights": [
    "Insight 1 (grounding truth)",
    "Insight 2 (liberating perspective)",
    "Insight 3 (gentle self-compassion)"
  ],
  "threeSteps": [
    "Step 1 (very small, physical/sensory micro-step, e.g. glass of water, step outside)",
    "Step 2 (5-minute mindful reflection or boundary)",
    "Step 3 (permissive rest or gentle pause)"
  ]
}`;

    const response = await fetch(aiSettings.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiSettings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: aiSettings.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You provide short, poetic, deeply non-clinical, gentle reflection cards. Format strictly as JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.warn('Optional AI endpoint returned error, falling back to local engine');
      return fallbackDefaults;
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';
    const cleaned = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (
      parsed.empatheticMirror &&
      Array.isArray(parsed.threeInsights) &&
      parsed.threeInsights.length >= 3 &&
      Array.isArray(parsed.threeSteps) &&
      parsed.threeSteps.length >= 3
    ) {
      return {
        empatheticMirror: parsed.empatheticMirror,
        threeInsights: [parsed.threeInsights[0], parsed.threeInsights[1], parsed.threeInsights[2]],
        threeSteps: [parsed.threeSteps[0], parsed.threeSteps[1], parsed.threeSteps[2]],
      };
    }

    return fallbackDefaults;
  } catch (err) {
    console.warn('Optional AI request failed, utilizing local deterministic engine:', err);
    return fallbackDefaults;
  }
}
