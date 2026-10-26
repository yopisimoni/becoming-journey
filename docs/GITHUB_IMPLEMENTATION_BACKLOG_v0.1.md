# BECOMING — GitHub Implementation Backlog v0.1
**Date:** 2026-10-24  
**Source:** `becoming_master_project_blueprint_execution_dossier.md` (user-supplied Gemini-produced dossier).  
**Provenance correction:** Section 5's heading “Claude Review Summary” is **incorrect/unverified**. Claude has **not** been used. The review and release verdict in the dossier are Gemini-generated claims, **not** an independent Claude review, certification, formal security audit, or DPIA.

## Constraints / Definition of Done
- Prototype only: free-first, static, local-first; no paid APIs; no external AI API; no remote database; no analytics; no third-party fonts/CDNs that transmit usage or reflection data.
- **Never collect real sensitive stories during testing.** Use synthetic data; a browser preview is not a vetted confidential service. Show this limitation plainly.
- No therapeutic/medical diagnosis or professional-service claims. No simulated intimate relationship, guilt-based notifications, streaks, scores, or competitive leveling.
- Five locales: `en`, `ar` (RTL), `fr`, `es`, `it`. Translations must be reviewed by fluent speakers before public release.
- No fabricated AI: name the deterministic scripted experience **Guided Reflection Preview**, not a live AI companion.
- GitHub repo private; deploy Vercel preview only on Hobby-eligible noncommercial terms and with access restrictions where supported. A secret URL is not authentication. Confirm actual deployment protection capabilities before sharing.
- All user text stays inside this device in the prototype. If using localStorage/IndexedDB, disclose persistence, browser/device access risks, and provide wipe/export. Avoid logging personal text.
- No actual signup or synced profile in v0.1. Mark authentication, voice recognition, live AI and sharing as “coming later / not enabled.”
- No deployments or external sharing without the founder's approval for the target repo/project if not already authorized.

## Milestones / Issues (copy into GitHub as individual issues)

### M0 — Project Governance
**BCM-001 [P0] Establish project repository and guardrails**
- Scope: private `becoming-journey` repo; README, LICENSE decision, `.gitignore`, branch protection as plan permits; `AGENTS.md`, `HANDOFF.md`, `DECISIONS.md`, `SECURITY.md`, `.env.example` with no secrets.
- Acceptance: no secret in git; repository is independent of other projects; README clearly says prototype, nonclinical, local-only, no AI API.
- QA: `git status`, secret scan, inspect settings, run install/test/build.

**BCM-002 [P0] Architecture and provenance decision record**
- Scope: write ADR describing static Next.js export vs alternative, browser storage strategy, locale routing, offline requirements, deployment limitations, and deferred cloud features. Correct “Claude Review Summary” attribution to Gemini draft; reserve independent Claude review as pending.
- Acceptance: architecture has no server/session/database dependencies; limitations and unanswered questions documented.

### M1 — Interface and Navigation
**BCM-003 [P0] Design system / motion / accessibility**
- Scope: warm calm UI, mobile-first, violet/mint/peach/ivory palette, subtle emoji, vector illustrations, purposeful motion 150–300ms. Add reduced-motion mode, accessible focus/contrast, no flashing or intrusive animations.
- Acceptance: consistent tokens/components; responsive at 320px and desktop; keyboard-only navigation possible; no horizontal overflow.
- QA: axe/Lighthouse accessibility, reduced motion, touch targets, device screenshot review.

**BCM-004 [P0] Multilingual framework + five locales**
- Scope: EN/AR/FR/ES/IT, `dir=rtl` for Arabic, CSS logical properties, language switch without losing current workflow.
- Acceptance: translated navigation/prompts/errors; no clipped text or mixed-direction layout failures.
- QA: screenshot all key screens in 5 locales; native-language editorial review pending flag.

**BCM-005 [P0] Welcome screen and four entry intents**
- Scope: “What brings you here today?”, `lost`, `goal`, `struggle`, `grow`, with nonjudgmental descriptions and ability to change intent.
- Acceptance: each intent navigates to relevant scripted guide; entry is skippable, no required questionnaire.
- QA: 4-path smoke tests in each locale.

**BCM-006 [P0] Three interaction modes**
- Scope: Guided Reflection Preview (deterministic scripts), Free Journal, Just Listen Mode (no follow-up pressure).
- Acceptance: mode changes do not leak text; journal never automatically becomes a suggestion; clearly distinguish scripted guidance from AI.
- QA: manual path and state tests.

### M2 — Journey Loop / Local Data
**BCM-007 [P0] Scripted reflection state machine**
- Scope: `Express → Explore → Confirm → Choose → Reflect`, scripts for four intents from dossier. Do not infer diagnoses or invent facts. Explicit fallback for inputs the scripts cannot understand.
- Acceptance: user can skip/return/change path; never pretends scripted output analyzed arbitrary text; no forced goal.
- QA: unit tests for state transitions and mismatched user input.

**BCM-008 [P0] Confirm-before-save Journey Map**
- Scope: draft insight, edit, confirm or discard; show origin and user confirmation status. Suggested microstep optional.
- Acceptance: nothing saved to map without explicit confirmation; delete/edit works; maps never display unapproved assertions as facts.
- QA: persistence and consent tests.

**BCM-009 [P0] Local-only journal storage and deletion**
- Scope: choose explicitly between memory-only and local persistence. If persistent, IndexedDB/localStorage with clear notice, export and wipe; no text in query params, analytics, console, crash reports, remote requests.
- Acceptance: user can export and wipe; behavior under shared-device use/private browsing explained; no remote traffic attributable to journal data.
- QA: browser network audit, browser reload, wipe verification, storage corruption handling.

**BCM-010 [P1] Gentle progress / personal reflection screen**
- Scope: progress as self-selected actions and reflections, not XP, score, streak, ranking or guilt. Optional “Moments of Light” prompts.
- Acceptance: users can take breaks, skip steps and redefine goals with no penalty.

### M3 — Safety, Verification and Preview
**BCM-011 [P0] Safety boundaries and response tests**
- Scope: clearly show non-clinical limitation, no diagnosis, no faux intimacy, no fabricated professional referrals or invented local support contacts. Develop age-scope decision and reviewed handling of urgent safety situations *before* any real-user testing. Do not use the dossier's single generic emergency response as a complete safety system.
- Acceptance: synthetic evaluations pass; no high-risk guidance, no personal data leak, appropriate routing language. Specialized review required before public beta.
- QA: test matrix and documented limitations.

**BCM-012 [P0] Privacy and security QA**
- Scope: threat model, dependency review, content security policy as compatible with static site, no third-party telemetry, shared-device warnings, disclaimers and deletion UX; clear privacy page describing actual functionality.
- Acceptance: zero user reflection transmitted to remote endpoints during verified test; no embedded API keys; no auto-sharing; auth and cloud not claimed to exist.
- QA: Playwright network instrumentation, dependency audit, cross-browser test.

**BCM-013 [P0] CI quality gates**
- Scope: TypeScript check, ESLint, unit tests, Playwright smoke tests, build, dependency audit, secret scan via GitHub Actions subject to free-tier quotas.
- Acceptance: PR checks green, failing tests block merge under available branch protection settings.

**BCM-014 [P0] Vercel static preview**
- Scope: connect private GitHub repo to new separate project, static build, preview-only rollout, test free-tier eligibility; do not attach a live domain or ask outsiders for sensitive entries.
- Acceptance: working mobile/desktop preview, documented URL and exact commit SHA, no secrets, no external AI/database calls, limited access if platform permits.
- QA: live page tests in all 5 locales, performance and no leakage audit.

**BCM-015 [P0] Founder QA and release decision**
- Scope: test four journeys in five languages with only fictional inputs; review UX, safety, privacy, content quality; log defects. Claude independent audit is **pending**, not completed.
- Acceptance: signed checklist; findings triaged; decision `prototype-approved`, `changes-required`, or `do-not-share` recorded.

### Explicitly Deferred / Not in v0.1
- Actual AI conversations, LLM memory extraction, voice interaction/transcription, account signup, cloud synchronization, therapist/professional referral directory, social profile sharing or community, subscriptions/payments, app-store packaging. These require separate research, privacy/security review and approval.
- Verify all Apple/Google app-store rules again *when* packaging becomes relevant; do not treat the dossier's numeric testing rule as universal/current.

## Suggested execution order
`BCM-001 → 002 → (003 + 004) → 005 → 006 → 007 → 008 → 009 → 010 → 011 → 012 → 013 → 014 → 015`.

## Antigravity — pasteable work order
Read `becoming_master_project_blueprint_execution_dossier.md` and this backlog in full. Build **only** BCM-001 through BCM-013 locally in a fresh private project; do not modify other repositories. The app must be a beautiful, accessible, responsive, five-language static prototype with four entry paths and three modes. Scripts are deterministic and must be labeled as such; do not call any cloud AI service. Store no user journal data remotely. Provide a working local build, Playwright results, changed-file list, screenshots at mobile/desktop and RTL, and a manifest of unfinished tasks. Prepare but do not publish a Vercel preview until the deployment configuration and release approval are clear. Do not silently substitute real AI, auth, analytics, or payment providers. Update `HANDOFF.md` after verified QA only.

## Claude — later independent audit (NOT DONE)
Review the source dossier, this backlog, and the produced source code. Report factual gaps, unsafe assumptions, privacy/accessibility gaps, test coverage, UI problems, and scope creep. Flag the source dossier's incorrect Claude-attribution explicitly. Return a prioritized, evidence-based defect list with file paths and reproduction instructions. Do not assert release approval without executing applicable tests.
