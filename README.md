# BECOMING — Guided Reflection Preview

> **IMPORTANT NON-CLINICAL NOTICE:**  
> BECOMING is an exploratory, deterministic personal reflection tool. It is **not** clinical care, psychotherapy, psychiatric diagnosis, or medical treatment, and does **not** provide emergency suicide or crisis intervention. If you are experiencing a mental health emergency, please contact your local healthcare provider or emergency crisis service immediately.

---

## 1. Overview & Vision
BECOMING is a calm, non-judgmental digital space designed to support self-reflection, emotional clarification, and self-directed micro-actions. It honors human agency:
- **No external AI APIs:** Operates with a purely deterministic, scripted dialogue engine. User entries are never passed to commercial or cloud LLMs.
- **Radical local privacy:** Everything runs client-side in the browser. Zero telemetry, zero analytics tracking, zero remote database storage, and zero CDN/remote font network calls.
- **Zero toxic mechanics:** Zero streaks, zero gamification, zero guilt notifications, and zero manipulation loops.
- **Confirm-before-save:** No insight or micro-step is saved to a journey map without explicit user confirmation.

---

## 2. Core Features (v0.1 / BCM-001–013)
- **5 Supported Locales:** English (`en`), Arabic (`ar` with full RTL & logical properties), French (`fr`), Spanish (`es`), and Italian (`it`).
- **4 Entry Intents:**
  1. *I feel lost* (`lost`) — Calms cognitive overload and narrows focus.
  2. *I have a goal* (`goal`) — Breaks overwhelming projects into one tangible micro-step.
  3. *I'm going through something* (`struggle`) — Compassionate space for expression without unsolicited advice.
  4. *I want to grow* (`grow`) — Sustainable habit exploration and self-discovery.
- **3 Interaction Modes:**
  1. *Guided Reflection Preview:* Scripted cognitive loop (`Express → Explore → Confirm → Choose → Reflect`).
  2. *Free Journal:* Private, unmonitored writing canvas with word count and manual download/wipe.
  3. *Just Listen Mode:* Grounding, peaceful reflection requiring nothing from the user.
- **Local Data Management:** Local/session storage only with complete export (JSON/Text) and one-click data wipe controls.
- **Accessibility & Responsiveness:** Responsive across mobile (320px, 375px), tablet (768px), and desktop (1440px) with `prefers-reduced-motion` compliance.

---

## 3. Technology Stack
- **Framework:** Next.js (App Router, static export `output: 'export'`)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with CSS logical properties (`ps-`, `pe-`, `ms-`, `me-`, `start-`, `end-`)
- **Icons:** Embedded SVG icons (no external web font downloads)
- **Testing:** Vitest (unit/integration) and Playwright (end-to-end / network isolation audit)
- **Linting:** ESLint with strict TypeScript rules

---

## 4. Getting Started Locally

### Prerequisites
- Node.js >= 18 (Tested on Node 20 / 24)
- npm >= 9

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality Verification
```bash
# Run unit tests
npm run test

# Run linting
npm run lint

# Run type check
npm run typecheck

# Build static output
npm run build

# Run Playwright E2E tests
npm run test:e2e
```

---

## 5. Deployment and Cloud Boundaries
In accordance with the v0.1 milestone specification:
- Deployment to public hosting or Vercel preview is deferred until authorized.
- This application requires zero environment variables and no backend API keys.
- Real user stories must **never** be gathered during testing; synthetic data only.
