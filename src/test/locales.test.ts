import { describe, it, expect } from 'vitest';
import { locales, supportedLocales, getDictionary } from '@/locales';
import { Locale, EntryIntent } from '@/types';

describe('BCM-004: Multilingual Framework & Five Locales', () => {
  const expectedLocales: Locale[] = ['en', 'ar', 'fr', 'es', 'it'];
  const expectedIntents: EntryIntent[] = ['lost', 'goal', 'struggle', 'grow'];

  it('contains exactly the 5 target locales', () => {
    expect(supportedLocales.map((l) => l.code).sort()).toEqual(expectedLocales.sort());
  });

  it('Arabic locale is correctly configured with isRtl=true and other locales isRtl=false', () => {
    expect(locales.ar.isRtl).toBe(true);
    expect(locales.en.isRtl).toBe(false);
    expect(locales.fr.isRtl).toBe(false);
    expect(locales.es.isRtl).toBe(false);
    expect(locales.it.isRtl).toBe(false);
  });

  expectedLocales.forEach((code) => {
    describe(`Locale: ${code}`, () => {
      const dict = getDictionary(code);

      it('has non-empty navigation, sanctuary entrance, and audio strings', () => {
        expect(dict.nav.title).toBeTruthy();
        expect(dict.nav.prototypeBadge).toBeTruthy();
        expect(dict.disclaimer.bannerText).toBeTruthy();
        expect(dict.disclaimer.crisisHotlines.length).toBeGreaterThan(0);
        expect(dict.sanctuary.headline).toBeTruthy();
        expect(dict.sanctuary.subtext).toBeTruthy();
        expect(dict.sanctuary.beginWithSound).toBeTruthy();
        expect(dict.sanctuary.beginSilence).toBeTruthy();
        expect(dict.audio.sanctuary).toBeTruthy();
        expect(dict.audio.rain).toBeTruthy();
        expect(dict.audio.bowl).toBeTruthy();
      });

      it('defines all 4 entry intents with diagnostic question tree and 3 options', () => {
        expectedIntents.forEach((intent) => {
          const intentMeta = dict.welcome.intents[intent];
          expect(intentMeta.title).toBeTruthy();
          expect(intentMeta.tagline).toBeTruthy();
          expect(intentMeta.description).toBeTruthy();

          const script = dict.scripts[intent];
          expect(script.tone).toBeTruthy();
          expect(script.openPrompt).toBeTruthy();
          expect(script.explorationMirror).toBeTruthy();
          expect(script.draftInsight).toBeTruthy();
          expect(script.optionalMicroStep).toBeTruthy();
          expect(script.listenGrounding).toBeTruthy();
          expect(script.supportSelectors.length).toBeGreaterThanOrEqual(2);

          // Sanctuary Upgrade Multi-Option Self-Discovery Tree
          expect(script.diagnostic).toBeDefined();
          expect(script.diagnostic.diagnosticQuestion).toBeTruthy();
          expect(script.diagnostic.diagnosticOptions.length).toBeGreaterThanOrEqual(4);
          expect(script.diagnostic.deepeningQuestion).toBeTruthy();
          expect(script.diagnostic.deepeningOptions.length).toBeGreaterThanOrEqual(3);
          expect(script.diagnostic.threeInsights.length).toBeGreaterThanOrEqual(3);
          expect(script.diagnostic.threeSteps.length).toBeGreaterThanOrEqual(3);
        });
      });

      it('defines all 3 interaction modes', () => {
        expect(dict.welcome.modes.guided.name).toBeTruthy();
        expect(dict.welcome.modes.journal.name).toBeTruthy();
        expect(dict.welcome.modes.listen.name).toBeTruthy();
      });

      it('defines all 5 stages of the cognitive loop', () => {
        expect(dict.stages.express.label).toBeTruthy();
        expect(dict.stages.explore.label).toBeTruthy();
        expect(dict.stages.confirm.label).toBeTruthy();
        expect(dict.stages.choose.label).toBeTruthy();
        expect(dict.stages.reflect.label).toBeTruthy();
      });

      it('includes deterministic fallback explanation', () => {
        expect(dict.fallback.heading).toBeTruthy();
        expect(dict.fallback.notice).toBeTruthy();
      });
    });
  });
});
