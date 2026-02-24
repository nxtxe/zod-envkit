# Examples

Example projects that use **zod-envkit** for type-safe environment validation and env tooling.

---

## [telegram-bot](./telegram-bot)

A simple Telegram bot (Telegraf) with:

* command-based architecture (`/start`, `/ping`, `/health`)
* environment validation with **Zod + zod-envkit** at startup
* **env.meta.json** as single source for docs and `.env.example`
* scripts: `env:gen`, `env:check`, `env:show`
* graceful shutdown, ready for CI/CD

See [telegram-bot/README.md](./telegram-bot/README.md) for setup and usage.

---

## [next-app](./next-app)

A minimal Next.js (App Router) app with:

* server-side env validation in `src/lib/env.ts` via **mustLoadEnv**
* **env.meta.json** and same zod-envkit scripts as the bot
* fail-fast at build/start if env is invalid
* TypeScript, same project structure style as the bot example

See [next-app/README.md](./next-app/README.md) for setup and usage.

---

## [template](./template)

Generic env template (NODE_ENV, PORT, DATABASE_URL) for reference. Each example above has its own env in its folder.

---

## Running from the repo root

Use each example's config:

```bash
npx zod-envkit generate -c examples/telegram-bot/env.meta.json
npx zod-envkit check -c examples/next-app/env.meta.json --dotenv examples/next-app/.env,.env.example
```

Install deps and run commands inside the example folder (`telegram-bot` or `next-app`).
