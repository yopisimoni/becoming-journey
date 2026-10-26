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
        expect(dict.nav.sanctuaryTab).toBeTruthy();
        expect(dict.nav.journalTab).toBeTruthy();
        expect(dict.nav.mapTab).toBeTruthy();
        expect(dict.nav.momentsTab).toBeTruthy();
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

      it('defines auth dictionary strings for local-first profile management', () => {
        expect(dict.auth.signIn).toBeTruthy();
        expect(dict.auth.signUp).toBeTruthy();
        expect(dict.auth.signOut).toBeTruthy();
        expect(dict.auth.nameLabel).toBeTruthy();
        expect(dict.auth.emailLabel).toBeTruthy();
        expect(dict.auth.passwordLabel).toBeTruthy();
        expect(dict.auth.avatarLabel).toBeTruthy();
        expect(dict.auth.guest).toBeTruthy();
        expect(dict.auth.privacyNote).toBeTruthy();
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

      it('defines v0.4 breathing, quiz, calendar, habits, and vault dictionaries', () => {
        expect(dict.breathing).toBeDefined();
        expect(dict.breathing?.studioTitle).toBeTruthy();
        expect(dict.breathing?.inhale).toBeTruthy();
        expect(dict.breathing?.hold).toBeTruthy();
        expect(dict.breathing?.exhale).toBeTruthy();
        expect(dict.breathing?.t478Name).toBeTruthy();
        expect(dict.breathing?.tBoxName).toBeTruthy();
        expect(dict.breathing?.tCoherentName).toBeTruthy();

        expect(dict.quiz).toBeDefined();
        expect(dict.quiz?.title).toBeTruthy();
        expect(dict.quiz?.chooseLength).toBeTruthy();

        expect(dict.calendar).toBeDefined();
        expect(dict.calendar?.title).toBeTruthy();
        expect(dict.calendar?.addGoal).toBeTruthy();

        expect(dict.habits).toBeDefined();
        expect(dict.habits?.title).toBeTruthy();

        expect(dict.vault).toBeDefined();
        expect(dict.vault?.title).toBeTruthy();

        expect(dict.audio.studioTitle).toBeTruthy();
        expect(dict.audio.catCalm).toBeTruthy();
        expect(dict.audio.catFocus).toBeTruthy();
        expect(dict.audio.catNature).toBeTruthy();
      });

      it('defines deterministic fallback explanation', () => {
        expect(dict.fallback.heading).toBeTruthy();
        expect(dict.fallback.notice).toBeTruthy();
      });
    });
  });
});
