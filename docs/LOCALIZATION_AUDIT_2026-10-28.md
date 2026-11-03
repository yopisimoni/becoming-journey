# BECOMING | Five-Language Localization Audit | 2026-10-28

**Decision: PARTIAL. Core Discover route verified in five languages; whole-app localization NOT complete.**

## Evidence
- English, Arabic, French, Spanish, Italian: Playwright `e2e/five-locale-journey.spec.ts` passed 5/5 at mobile viewport 320px against the latest locally built preview.
- Assertions: translated Discover heading, localized first activity title, Journey Map reachable, back to Sanctuary, no page-wide horizontal overflow.
- Previous tests checked Discover translations in four non-English languages. This is not a real-device or screen-reader acceptance test.

## Unresolved content / review queue (do not declare 100% translation)
| Location | Confirmed issue | Priority |
|---|---|---|
| Settings > Terms | Long non-clinical disclaimer and regional support directory written directly in English | P0 before public multilingual release; legal/safety copy needs human review |
| Settings > About | Long philosophy/about paragraphs hardcoded in English | P1 |
| Dashboard | Dynamic quotations, philosophical authors/themes and some motivational copy are English content | P1 |
| Expanded studios (Good Vibes, Habits, Calendar, Rituals, Vault, Quiz) | Not covered by five-language navigation test; separately audit for hardcoded UI | P1 |
| Mobile browsers | No real iPhone Safari or Android-device text clipping / RTL inspection completed | P0 before external beta claims |

## Correct next action
1. Translate and review the Settings terms and About content with native speakers, preserving important meaning and regional resources.
2. Audit expanded studios as a batch; avoid isolated three-label commits.
3. Add a complete cross-locale route test only after translated content is in place, then execute real-device Arabic RTL and long French/Italian labels.
4. Report completion by screen, not by number of commits or successful compilation.

## Stop-loop rule
Only close localization after every supported route has a five-language copy review and measured RTL/layout acceptance. Success in the Discover path cannot be extrapolated to every screen.

## 2026-10-28 follow-up: About copy
- Settings > About main philosophy paragraphs now use five-language copy. Absolute claims such as "100% private" and "free forever" were replaced with bounded browser-storage language rather than translated as promises.
- This is a **copy improvement**, not legal approval. Longer Terms disclaimer and assistance directory still require review, and other studio content is not marked complete.
- No new features, no production changes, no public-release authorization.


## 2026-11-02 GitHub-only audit: confirmed untranslated strings
This scan inspected current source on `feat/v1-mobile-ux-fixes`, without running the application. Examples are source line numbers at inspection time, not full counts of untranslated content:

| Screen | Examples confirmed in source | Follow-up |
| --- | --- | --- |
| Dashboard | `Progress to Next Stage` (207); `Reflect in Journal` (411); `Confirmed insights` (426); English example placeholders (271, 292, 313) | Move remaining UI labels/placeholders to five-language dictionaries |
| SelfDiscoveryQuiz | `Inner Compass` (883), `Work Rhythm & Craft` (1226), `What Naturally Fuels You` (1271), `Saved to Journey Map` (1317) | Audit results and quiz labels together |
| HabitBalance | `Copy Script` (424); English reflective prompts and task examples (453, 461, 506, 519) | Translate interactive controls and prompts |
| HorizonCalendar | English goal/action placeholders (161, 175, 188, 202, 286) | Translate examples used while entering data |
| SecretVault | `Ephemeral Release` (122), `Seal Away a Thought` (249); sensitive-content placeholders (144, 261, 270) | Review language and privacy wording together |
| GoodVibes | English custom-card placeholder (409) | Translate card editor instructions |
| Settings > Terms | Long English non-clinical terms and support information remain in source | Qualified human review of safety/legal translation required |

**Coverage limitation:** this is a targeted static scan, not a complete runtime accessibility or legal review. No source changes, build checks, or device tests were performed in this audit. The connected Mac was offline; do not claim these issues are resolved.

**Single closure gate:** translate all listed controls and safety content in a batched change, run TypeScript/lint/unit/build, then Playwright five-locale full-route checks; native-language review and real-device RTL inspection remain separate acceptance requirements.

## 2026-11-02 batch localization implementation
- Introduced shared `src/locales/screenCopy.ts` translations for 24 confirmed labels and placeholders across Dashboard, Habit Balance, Secret Vault, Self Discovery Quiz and Good Vibes.
- Validation: TypeScript, ESLint, 129 unit tests, Next.js build, 5/5 Playwright core-locale navigation at 320px passed on connected Mac.
- **Still open:** long Settings Terms / safety content requires approved translations; dynamic quotes and additional prompts remain; real-device RTL and full studios route coverage still unverified. This is not a 100%-localized release gate.
- Production unchanged. Development branch only.

## 2026-11-03 additional localization closure pass
- Completed nine more translated placeholders across Horizon Calendar, Habit Balance and Secret Vault, through `additionalScreenCopy` shared dictionary.
- Five new unit assertions verify all new prompts have distinct Arabic, French, Spanish and Italian translations, while English and unknown keys fall back safely.
- Latest local verification: TypeScript and ESLint passed; unit tests **134/134**; Next.js static build passed; core five-language Playwright journey **10/10** across mobile 320px and 375px.
- **Not verified:** all long Terms/safety wording, dynamically generated quotes, complete screen-by-screen translation, browser/device physical RTL testing, third-party consent, production readiness. Beta remains **guest-only with fictional data** pending these gates.
- Decision: close this particular batch without claiming the full translation project is finished; do not invite external multilingual testers on a blanket completeness claim.
