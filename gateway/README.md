# BECOMING Groq gateway: internal-only staging prototype

Status: **NOT DEPLOYED / NOT EXPOSED / NOT CONNECTED TO BECOMING UI.** No keys needed for tests.

Start only on a trusted development environment (Node 20+): `node --test gateway/server.test.mjs`. The gateway binds to **127.0.0.1 only** when run with `node gateway/server.mjs`.

Server-only environment variables to supply later, after privacy and abuse-control review:
- `GROQ_API_KEY`: private Groq key, never in frontend, GitHub, chat, or `NEXT_PUBLIC_*`
- `GATEWAY_INTERNAL_TOKEN`: independent secret for authenticated server-to-server requests (not usable as a public browser credential)
- `GROQ_GATEWAY_ENABLED`: must be `true` to call Groq; otherwise fails closed
- `GROQ_DAILY_REQUEST_CAP`: prototype per-process budget cap (default 20, insufficient for multi-replica public release)
- `GATEWAY_PORT`: optional loopback port (default 18771)

The only accepted AI input is `locale`, predefined `stage`, and `approvedForExternalProcessing:true`. The endpoint accepts **no notes, journal, vault, identity, or free-form prompts**. The prototype never logs request bodies, but this does not prove hosting/provider zero retention.

**Before enabling on VPS**: implement user/session-based abuse controls at a public BFF, durable rate limits across replicas, proper frontend per-request content approval, privacy/retention review, and integration tests. Do not send the internal token to browsers. Keep app's `SECURE_AI_GATEWAY_READY` flag false until these gates are complete. Staging must not be exposed to Internet as-is.
