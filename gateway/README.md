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

## Docker staging layout (safe, disabled by default)
`compose.yaml` binds container port 18771 to VPS **127.0.0.1:18771 only**. The app binds on 0.0.0.0 **inside** its private container so Docker port mapping works; it does not expose a public host port. Container runs non-root with dropped capabilities, read-only filesystem, CPU/memory limits, and no-new-privileges.

A privileged Docker operator must review `compose.yaml` and then, on the VPS under `~/becoming-groq-staging/gateway`, create a `runtime.env` from `runtime.env.example` and an empty `secrets/` folder owned by deploy (mode 700). The container remains disabled even if it starts. Never copy a real key into GitHub, terminal history, shell command arguments, chat or frontend environment files.

**When approved for private gateway testing only**, create `secrets/groq_api_key` and `secrets/gateway_internal_token` with restricted mode 600 using a private interactive secret entry, outside shell history and logs. They are mounted as read-only files rather than environment variables. Do not enable public network exposure or set `GROQ_GATEWAY_ENABLED=true` until the remaining frontend/BFF safety gates are independently verified. If the privileged Docker operator is unavailable, leave the staging files in place and do not modify existing containers.
