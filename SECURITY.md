# Security Policy & Safety Disclosures

## Non-Clinical Scope & Safe Use
BECOMING is an experimental, deterministic personal reflection tool designed for low-stakes self-inquiry and journaling.
- It is **not** a clinical healthcare software system, medical device, psychiatric diagnosis platform, or crisis management tool.
- It is strictly **unsuited** for acute mental health distress or crisis intervention.
- In any critical or crisis situation, users are strongly urged to consult local certified health providers or emergency hotlines immediately.

## Privacy & Architecture Guarantees
1. **Zero Remote Data Transmission:** User reflections, journal entries, selected intents, and journey map cards remain solely on the client device in browser memory or explicitly controlled local storage.
2. **Zero Third-Party Telemetry:** No Google Analytics, Mixpanel, Sentry, or tracking pixels exist within this project.
3. **Zero AI API Exfiltration:** The conversational experience is 100% deterministic and scripted. No user input is ever forwarded to OpenAI, Anthropic, Google, or any remote inference endpoint.
4. **No External CDNs or Fonts:** All font stacks rely on standard local system fonts (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, etc.) and bundled SVG icons, precluding IP tracking via third-party asset requests.

## Reporting a Security or Privacy Vulnerability
If you discover a privacy leak, unintentional data transmission, or security defect:
1. Please do not file public issues containing exploit details.
2. Report the vulnerability privately to the project repository maintainers.
3. We take private local-first guarantees seriously and will patch any telemetry or storage defect promptly.
