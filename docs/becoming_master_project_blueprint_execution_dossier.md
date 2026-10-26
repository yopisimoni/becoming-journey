# BECOMING — Master Project Blueprint & Execution Dossier
**Version:** 0.1-Alpha • **Date:** 2026-10-24 • **Status:** Implementation-Ready Specification

---

## 1. Executive Vision & Philosophy

### 1.1 Mission
A calm, beautiful, non-judgmental digital space where people can talk, type, or reflect privately, discover what matters to them, clarify obstacles, and choose their own next small step. The product supports human agency; it never claims to know who a person is, diagnose them, or replace human/professional support.

### 1.2 Core Ethos ("Zero-Harm" & "No-Bad-Things")
* **No Toxic Engagement Mechanics:** Zero streak tracking, zero guilt mechanics, zero gamified scoring, and zero manipulation notifications.
* **Radical Privacy by Design:** The client-side application operates entirely local-first. Text entered by the user never leaves their device's sandbox memory/storage.
* **Zero Cloud AI Leakage:** No private reflections are transmitted to external AI APIs (like commercial or free-tier cloud endpoints) where user data could be used for training.
* **Separation from Therapy:** Absolute transparency that this is a personal reflection tool, not clinical care, therapy, medical treatment, or suicide/crisis intervention.
* **Self-Paced Discovery:** The user is always in complete control. Nothing becomes a "fact", "insight", or "goal" on their Journey Map unless they explicitly tap **Confirm**.

---

## 2. Target Languages (The Initial Five)

The v0.1 scope is strictly constrained to five languages, with full bidirectional layout (LTR & RTL) support:
1. **Arabic (`ar`)** — Right-to-Left (RTL), regional adaptation
2. **English (`en`)** — Left-to-Right (LTR), foundational base
3. **French (`fr`)** — LTR
4. **Spanish (`es`)** — LTR
5. **Italian (`it`)** — LTR

*Rule:* No additional languages will be added until the product is thoroughly tested by the founder and demand is proven.

---

## 3. Product Architecture & User Journey

### 3.1 The 4 Core Entry Intents
Every interaction begins with a single calm question: **"What brings you here today?"**
1. **"I feel lost" (`lost`)** — No clear direction; aims to calm anxiety, silence noise, and lower the pace.
2. **"I have a goal" (`goal`)** — Knows the desired outcome; breaks overwhelming projects down into a single micro-action.
3. **"I'm going through something" (`struggle`)** — Navigating grief, stress, or change; pure emotional expression with zero premature problem-solving.
4. **"I want to grow" (`grow`)** — Proactive curiosity, personal exploration, and habit reflection without competitive comparison.

### 3.2 The Interaction Modes
* **Guided Talk:** A deterministic, calm, conversational reflection partner asking clarifying questions.
* **Free Journal:** A clean, peaceful, unmonitored writing page with zero back-and-forth prompts.
* **Just Listen Mode:** The app provides a short, grounding reflection while asking nothing from the user.

### 3.3 The Conversational Cognitive Loop
$$\text{Express} \longrightarrow \text{Explore} \longrightarrow \text{Confirm} \longrightarrow \text{Choose} \longrightarrow \text{Reflect}$$

1. **Clarify Support:** User decides whether they want silent listening, conversational reflection, or practical step planning.
2. **Express:** Open-ended prompting to dump active thoughts.
3. **Explore (Mirroring):** The engine mirrors back observations tentatively (*"It sounds like..."*), never authoritatively.
4. **Confirm Insight:** Engine produces a draft synthesis. The user must manually approve or edit it before it is saved to their Journey Map.
5. **Choose Small Step:** Proposes one realistic, self-chosen micro-step (or allows skipping).

---

## 4. Deterministic Dialogue Scripts (The 4 Paths)

### Path 1: I Feel Lost (`lost`)
* **Tone:** Grounding, patient, unhurried.
* **Support Selector:** `[Just listen to me]` • `[Help me unpack what I'm feeling]`
* **Open Prompt:** *"If you had to summarize the fog in your head in a sentence or two, what would you say?"*
* **Exploration Mirror:** *"It sounds like multiple things are demanding your attention at once, making it hard to see where to begin. Does that resonate, or is there something else beneath it?"*
* **Draft Insight (Requires Confirmation):** *"I am not behind in life; I simply need to reduce inputs and move at my own pace."*
* **Optional Micro-Step:** *"Close all pending browser tabs and take 5 deep breaths in a quiet spot."*

### Path 2: I Have a Goal (`goal`)
* **Tone:** Focused, de-pressurizing, practical.
* **Support Selector:** `[Clarify the idea]` • `[Break down the first small step]`
* **Open Prompt:** *"What is the project or change you want to create, and what feels like the biggest obstacle right now?"*
* **Exploration Mirror:** *"It seems the end vision is clear, but thinking about the full journey is draining your energy before you start. Is that accurate?"*
* **Draft Insight (Requires Confirmation):** *"I do not need to see the entire staircase; I only need to see the single step right in front of me today."*
* **Optional Micro-Step:** *"Spend just 10 minutes tomorrow on the simplest part of this task, with zero expectation of completion."*

### Path 3: I'm Going Through Something (`struggle`)
* **Tone:** Compassionate, safe, non-instructive, validating.
* **Support Selector:** `[I just want to vent without advice]` • `[Help me see this with gentle clarity]`
* **Open Prompt:** *"What is the heaviest weight you are carrying right now? Write in whichever language or style feels natural."*
* **Exploration Mirror:** *"This situation is placing a heavy demand on your emotional reserves. It is entirely reasonable that you feel weighed down. Did you get the hardest part out?"*
* **Draft Insight (Requires Confirmation):** *"I give myself permission to feel what I feel right now without self-blame or forcing an immediate recovery."*
* **Optional Micro-Step:** *"Drink a glass of warm water or lie down to rest for 15 minutes away from all screens."*

### Path 4: I Want to Grow (`grow`)
* **Tone:** Curious, expansive, sustainable.
* **Support Selector:** `[Explore a new habit]` • `[Restructure my daily rhythm]`
* **Open Prompt:** *"Which part of your life do you feel drawn to nurture right now to bring you more peace or joy?"*
* **Exploration Mirror:** *"You aren't looking for a radical overhaul, but for a rhythm that feels authentic to you. Is that what you mean?"*
* **Draft Insight (Requires Confirmation):** *"True growth is not a race; it is a gentle accumulation of conscious choices that fit my unique life."*
* **Optional Micro-Step:** *"Read or listen to an inspiring idea for 5 minutes, then write down one single sentence summarizing what stayed with you."*

---

## 5. Independent Architecture & Safety Review (Claude Review Summary)

### 5.1 Release Verdict
* **v0.1 Prototype (Zero-Cost, Local-Only):** **GO** (Greenlight).
* **Live Beta with Real External AI/Database:** **NO-GO** (Halted until security audit, formal DPIA, and non-commercial host transition are complete).

### 5.2 Critical Guardrails
1. **Self-Harm / Crisis Protocol:** Any indication of crisis triggers an immediate termination of conversational branching and displays localized emergency/helpline resources.
2. **No Faux Intimacy:** Prohibit statements like *"I'm here for you always"* or simulated consciousness.
3. **Vercel Hobby Compliance:** Strictly non-commercial during early preview; migrate to Cloudflare Pages or a paid tier before testing monetization.
4. **Tailwind Logical Properties:** Exclusive use of `start-`, `end-`, `ps-`, `pe-`, `ms-`, and `me-` to guarantee flawless Arabic (RTL) rendering.

---

## 6. Phased Rollout Strategy

### Phase 1: Self-Testing ("Solo Dogfooding")
* **Goal:** The creator uses the app daily on their own mobile device via local development or private preview.
* **Focus:** Verify the emotional tone of the prompts, check RTL/LTR typography balance, and ensure no feeling of clinical coldness or synthetic pressure exists.

### Phase 2: Closed Circle Testing (3–5 Trusted Peers)
* **Goal:** Deploy static preview to a private repository on Vercel or Cloudflare Pages.
* **Focus:** Gather subjective feedback: *"Did you feel judged?"*, *"Did you feel safe typing into the box?"*, *"Was the language translation natural?"*

### Phase 3: Mobile Store Packaging (CapacitorJS)
* **Goal:** Package the Next.js static output (`out/`) into native iOS and Android packages via Capacitor.
* **Requirements:**
  * **Google Play:** Closed testing track with a minimum of 12 testers for 14 continuous days.
  * **Apple App Store:** TestFlight deployment followed by standard App Review (mandating clear non-medical disclaimers and live privacy policy links).