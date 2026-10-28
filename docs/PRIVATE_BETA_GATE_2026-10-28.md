# BECOMING | Private Beta Decision Gate | 2026-10-28

**Decision: HOLD public launch. Prepare a controlled private beta, without changing production.**

## Evidence confirmed
- GitHub development branch `feat/v1-mobile-ux-fixes` at `993a38f`; working tree clean before this document.
- Vercel Preview for `993a38f` is READY. Preview is not production approval.
- Recent automated checks: 126 unit tests; 60 mobile Playwright checks across 320/375px; four mobile theme/menu layout checks; two first-visit journey checks; local-auth A/B/guest/A isolation flow passed.
- Discover activity, repeated attempts, optional reflection, and Journey Map history have been implemented.

## Actual blockers / unknowns
| Priority | Gate | Evidence to close | Owner/next action |
| --- | --- | --- | --- |
| P0 | Human usability | 3-5 external testers complete first visit and one activity without coaching; document confusion and completion | Product tester |
| P0 | Real mobile visual acceptance | Inspect actual iPhone Safari (and one Android browser) screenshots for logo, contrast, menu, text, safe areas and keyboard | Device QA |
| P0 | Local identity threat model | Local offline account is not server authentication; same-device browser storage access and legacy data need explicit disclosure | Security review |
| P0 | Data control | Confirm export/import, deletion and session-to-local changes preserve or intentionally remove data; do not promise absolute privacy | QA/security |
| P1 | First-session value | Ask each tester what BECOMING does, which action they took, and whether the journey made sense | Research |
| P1 | Revisit value | After a voluntary later revisit, capture whether previous reflection was useful; do not measure streaks | Research |
| P1 | Accessibility | Manual keyboard, screen reader, reduced motion, Arabic RTL and high zoom checks | Accessibility QA |

## Stop-loop rule
- No more general test-only commits unless a new regression or clearly missing acceptance gate is identified.
- No more visual redesign from guesses or test counts; use actual device screenshots and tester observations.
- A task is DONE only with an artifact and verifiable acceptance evidence. A new test is not proof of real-world usability.
- Focus next work on one P0 gate at a time. Do not add features, paid APIs, or launch publicly.

## First tester script (no coaching)
1. Open the preview from a phone. Say in one sentence what you think BECOMING helps you do.
2. Start without assistance, choose one activity, mark it tried and optionally write a reflection.
3. Find that activity in Journey Map. Explain whether you understand what happened and what to do next.
4. Identify anything confusing, cut off, repetitive or inaccessible; report device/browser.
5. Do not enter sensitive real-world information in this preview; use fictional examples.

## Beta go/no-go
Proceed only when all P0 gates have direct evidence, no critical privacy or navigation defect remains, and the owner explicitly approves the private-beta audience and release. Public launch is a separate decision.
