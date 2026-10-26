# AGENTS.md — Instructions for AI Coding Assistants

This repository contains **BECOMING**, a zero-cost, local-only, static personal reflection tool built with Next.js App Router, TypeScript, and Tailwind CSS.

## Fundamental Invariants — DO NOT VIOLATE:
1. **Zero External AI Calls:** NEVER import or call OpenAI, Anthropic, Google Gemini, Ollama, HuggingFace, or any LLM API. The conversational loop is 100% deterministic, scripted, and transparently labeled as "Guided Reflection Preview".
2. **Zero Remote Databases / Telemetry:** NEVER add Firebase, Supabase, Prisma, PostgreSQL, MongoDB, Google Analytics, Sentry, Mixpanel, PostHog, or any tracking telemetry.
3. **Zero Remote CDNs / External Fonts:** All assets, fonts, and icons must be static, local, or embedded SVGs. Do not import Google Fonts via external `<link>` tags.
4. **Local Data Isolation:** User journals and reflection data must exist only in React memory or local/session storage on the user's browser. Always provide complete export (JSON/TXT) and full data wipe functionality.
5. **Confirm-Before-Save:** Insights, reflections, and goals must NEVER be committed to the Journey Map without explicit user confirmation (`Confirm` button).
6. **Bilingual / Multilingual & RTL Parity:** Always maintain all 5 locales (`en`, `ar`, `fr`, `es`, `it`). Always use Tailwind CSS logical properties (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`, `text-end`) for full Arabic RTL compatibility.
7. **Accessibility & Reduced Motion:** Respect `prefers-reduced-motion: reduce`. Ensure WCAG AA contrast, keyboard accessibility, and clean responsive views (320px, 375px, 768px, 1440px).
8. **Scope Boundary:** Do not deploy to production or external URLs without explicit user instruction. Do not touch other projects outside `/Users/mac/becoming-journey`.
