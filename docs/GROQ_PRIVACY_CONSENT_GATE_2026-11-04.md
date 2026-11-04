# BECOMING | Voluntary AI and Groq Privacy Gate | 2026-11-04

**Decision: AI OFF at runtime.** The app remains fully usable without external AI. Opting in today saves a local preference, **not permission to send reflections**. No Groq key or production gateway is configured by this change.

## Implemented protections
- Replaced browser BYOK endpoint/key form with a five-language, opt-in preference dialog. The default is unchecked. The user can disable it again.
- Legacy `becoming_ai_settings_v1` data is deleted from local and session storage on app initialization. No implicit consent is inherited. `becoming_ai_settings_v2` persists **only** `{ "enabled": true|false }` in the chosen local/session storage mode.
- The context sanitizes input settings before persisting them: arbitrary provider URLs, model IDs and API keys are dropped.
- Both previous browser-based reflection and AI greeting network paths are disabled with `SECURE_AI_GATEWAY_READY = false` and use the existing local fallback.
- Unit tests check the fail-closed path; browser E2E checks old-key removal, opt-in choice and preference persistence.

## Required before connecting Groq (NOT implemented)
1. Create an authenticated or abuse-resistant server-side HTTPS proxy with a server-only Groq API key. **Never** expose any Groq key in Next.js public environment variables, JavaScript bundles or browser storage.
2. Keep opt-in OFF by default. Request clear approval **before every submission**, displaying exactly what text will be sent, the provider name, and the option to cancel or use local mode.
3. Do **not** transmit Journal history, Secret Vault content, real identifiers, location or account information. Use minimum required fictional/test inputs during initial beta; stop and seek confirmation if potentially sensitive.
4. Set content length limits, server-side schema validation, moderation/safety fallback, rate limits, request timeout and cost caps. Do not allow instructions in user-generated text to override policy. AI output must not diagnose, direct major life decisions or simulate a personal relationship.
5. Review Groq's current API terms, retention policies, available zero-retention settings and subprocessors with appropriate legal/privacy reviewers. Public privacy policy must accurately describe any third-party processing and data transfers. **No sale or advertising use of personal reflections.** Do not claim zero logging without a verified provider agreement and infrastructure audit.
6. Provide one-click withdrawal of AI permission and a way to delete local preference, then verify no new provider requests occur after revocation. Record release acceptance evidence.

## Remaining launch blockers
- Long five-language Terms/privacy copy requires human review.
- Actual Safari iPhone and Android Chrome acceptance, especially Arabic RTL.
- Real consenting tester sessions; use guest mode and fictional data only until approved.

Production and external-user invitations are out of scope for this branch.
