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
