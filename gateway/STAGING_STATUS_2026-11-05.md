# BECOMING Groq VPS staging | 2026-11-05

**Status: staged only. AI disabled. No key installed.**

- Checked SSH access to the VPS as `deploy`.
- Copied gateway service files to `/home/deploy/becoming-groq-staging/gateway` without touching other projects.
- Prepared private `runtime.env` with `GROQ_GATEWAY_ENABLED=false` and a private `secrets/` directory (mode 700).
- Gateway is configured to bind its host port only on `127.0.0.1:18771`. This must be verified at runtime.
- Container has non-root execution and read-only root-filesystem settings.
- Existing VPS `deploy` session does not have permission to access Docker daemon, so no Docker service was started.
- Mac verification: gateway tests 4/4, Docker Compose configuration check passed, TypeScript and ESLint passed.

The next operation needs an authorized VPS Docker administrator to start the service **while disabled**, verify local health and negative tests, and inspect container/network permissions. Do not supply passwords, access tokens or API keys in chat.

**Remaining release blockers:** browser BFF, user/session abuse protection, explicit consent for each approved request, provider data processing review and privacy acceptance. The application remains fully local/offline and Groq is not connected to users.
