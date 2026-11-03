# BECOMING | Private Beta Acceptance Record | 2026-11-03

## Decision: CONDITIONAL HOLD for external invitations

**Not a production approval.** The development Preview may be inspected by the owner. Invite external participants only after the owner checks the final restricted Preview/shareable link and accepts the guest-only, fictional-data tester protocol. Production remains unchanged.

## New evidence from this change
- Settings headline, introductory description, self-reflection/non-medical notice, and international directory link label now use all 5 supported locales. Draft wording preserves that BECOMING is not professional medical care or coaching.
- New `e2e/beta-settings-locales.spec.ts` validates Settings navigation, translated headline/notice, RTL direction for Arabic, LTR for the other four languages and no document-wide overflow at **320px and 375px**.
- 10/10 targeted Settings mobile-locale checks passed locally. This **does not** constitute testing on physical iOS Safari or Android Chrome.
- TypeScript and ESLint passed. Next.js static build passed. Unit tests: **134/134 passed**. No beta users were contacted.

## Remaining P0 gates
1. **Actual devices:** Have an owner-approved participant open the latest protected Preview on an actual iPhone Safari and Android Chrome. Record screenshots with no personal data; assess keyboard, scrolling, RTL, text clipping, navigation and touch targets.
2. **Sensitive copy review:** Review and approve long-form Settings Terms and region-specific help resources in five languages; those paragraphs are not certified translated or legally reviewed. The new notice is a draft, not a professional review.
3. **Privacy:** Test guest-only with fictional data in a private browser profile. Local browser data is not secure account storage. Local email/password signups are excluded.
4. **Usability:** Obtain consent from 3-5 independent testers; verify uncoached first-use comprehension, one completed activity, Journey Map history and clear feedback. Do not request sensitive personal reflections.

## Owner acceptance
- [ ] Latest Preview shared privately without disabling overall deployment protection
- [ ] Actual iPhone Safari smoke test, include Arabic RTL
- [ ] Actual Android Chrome smoke test
- [ ] Five-language long Terms/content reviewed
- [ ] 3-5 independent tester sessions recorded
- [ ] Critical issues fixed and independently retested
- [ ] Owner authorizes broader beta or production separately

## Regression policy
Stop recurring generic QA loops. New tests only for confirmed missing acceptance criteria or new defects. A READY Vercel status means successful build/deployment, not human acceptance.
