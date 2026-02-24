# Next.js + zod-envkit

A minimal **Next.js** (App Router) example with:

* type-safe environment validation via **Zod + zod-envkit**
* single env module validated at build/start
* same tooling as the [Telegram bot](../telegram-bot) example: `env:gen`, `env:check`, `env:show`

---

## Features

* **Server-side env** — `NODE_ENV`, `API_SECRET`, `LOG_LEVEL` validated in `src/lib/env.ts`
* Fail-fast on invalid or missing variables (build and runtime)
* **env.meta.json** for docs and CLI; `.env.example` generated from it
* Ready for CI with `zod-envkit check`

---

## Project structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── env.ts          # Env schema + mustLoadEnv
├── .env                     # Local env (NOT committed)
├── .env.example             # Example env file
├── env.meta.json            # Env metadata for zod-envkit
├── ENV.md                   # Auto-generated env docs
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## Requirements

* **Node.js 18+**
* pnpm / npm / yarn

---

## Installation

```bash
pnpm install
# or: npm install
```

---

## Environment setup

1. Copy the example env file:

```bash
cp .env.example .env
```

2. Set required variables (at least `API_SECRET` for server):

```env
NODE_ENV=development
API_SECRET=your-secret-here
LOG_LEVEL=info
```

3. Validate environment:

```bash
pnpm run env:check
```

---

## Running the app

**Development:**

```bash
pnpm dev
```

**Build and start:**

```bash
pnpm build
pnpm start
```

If the environment is invalid, the app will fail at build or on first server load.

---

## Environment tooling (zod-envkit)

Generate env docs and `.env.example` from `env.meta.json`:

```bash
pnpm run env:gen
```

Show current environment state (masks secrets):

```bash
pnpm run env:show
```

Validate required variables (CI-friendly):

```bash
pnpm run env:check
```

---

## CI / production notes

* `.env` and `.env.local` are **never committed**
* Use `env.meta.json` and `zod-envkit check` in CI to ensure required vars are set
* Server-only variables (e.g. `API_SECRET`) are not exposed to the client; only use them in Server Components or API routes

---

## License

ISC
