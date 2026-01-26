<div align="center">
  <br />
  <p>
    <img src="./zod-envkit.svg" width="546" alt="zod-envkit" />
  </p>
  <br />
  <p>
    <a href="https://github.com/nxtxe/zod-envkit">
      <img src="https://github.com/nxtxe/zod-envkit/actions/workflows/release.yml/badge.svg" />
    </a>
    <a href="https://www.npmjs.com/package/zod-envkit">
      <img src="https://img.shields.io/npm/v/zod-envkit.svg?maxAge=100" alt="npm version" />
    </a>
    <a href="https://www.npmjs.com/package/zod-envkit">
      <img src="https://img.shields.io/npm/dt/zod-envkit.svg?maxAge=100" alt="npm downloads" />
    </a>
  </p>

  <p>
    <a href="./README.md">
      <p>English</p>
    </a>
    <a href="./README.RU.md">
      <p>Русский</p>
    </a>
  </p>
</div>

Type-safe environment variable validation and documentation using **Zod**.

**zod-envkit** is a small library + CLI that helps you treat environment variables as an  
**explicit runtime contract**, not an implicit guessing game.

- validate `process.env` at startup
- get fully typed environment variables
- generate `.env.example`
- generate readable documentation (`ENV.md`)
- inspect and verify env state via CLI
- fail fast in CI/CD before deploy

No cloud. No magic. Just code.

---

## Why

Environment variables are critical, but usually poorly handled.

Typical problems:
- `process.env` is just `string | undefined`
- missing or invalid variables fail **at runtime**
- `.env.example` and docs get outdated
- CI/CD breaks late and unpredictably

**zod-envkit** solves this by making env:
- validated early
- typed
- documented
- checkable in CI

---

## Installation

```bash
npm install zod-envkit
````

```bash
yarn add zod-envkit
```

```bash
pnpm add zod-envkit
```

---

## Library usage (runtime validation)

Create a single file responsible for loading and validating env.

```ts
import "dotenv/config";
import { z } from "zod";
import { loadEnv, mustLoadEnv, formatZodError } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.string().url(),
});
```

### Option 1 — safe mode (no throw)

```ts
const result = loadEnv(EnvSchema);

if (!result.ok) {
  console.error("Invalid environment:\n" + formatZodError(result.error));
  process.exit(1);
}

export const env = result.env;
```

### Option 2 — fail-fast (recommended)

```ts
export const env = mustLoadEnv(EnvSchema);
```

Now:

* `env.PORT` is a **number**
* `env.DATABASE_URL` is a **string**
* TypeScript knows everything at compile time
* your app fails fast if env is invalid

---

## CLI usage

The CLI works from a simple metadata file: `env.meta.json`.

By default, it is searched in:

* `./env.meta.json`
* `./examples/env.meta.json`

---

### Example `env.meta.json`

```json
{
  "NODE_ENV": {
    "description": "Runtime mode",
    "example": "development",
    "required": true
  },
  "PORT": {
    "description": "HTTP port",
    "example": "3000",
    "required": true
  },
  "DATABASE_URL": {
    "description": "Postgres connection string",
    "example": "postgresql://user:pass@localhost:5432/db",
    "required": true
  }
}
```

---

## CLI commands

### Generate `.env.example` and `ENV.md`

(Default behavior)

```bash
npx zod-envkit
```

or explicitly:

```bash
npx zod-envkit generate
```

---

### Show current environment status

Loads `.env`, masks secrets, and displays a readable table.

```bash
npx zod-envkit show
```

Shows:

* which variables are required
* which are present
* masked values for secrets (`TOKEN`, `SECRET`, `*_KEY`, etc.)

---

### Validate required variables (CI-friendly)

```bash
npx zod-envkit check
```

* exits with code `1` if any required variable is missing
* ideal for CI/CD pipelines and pre-deploy checks

Example CI step:

```bash
npx zod-envkit check
```

---

### CLI options

```bash
zod-envkit --help
```

Common flags:

```bash
zod-envkit show \
  --config examples/env.meta.json \
  --env-file .env
```

---

## Why not just dotenv?

`dotenv`:

* ❌ no validation
* ❌ no types
* ❌ no documentation
* ❌ no CI checks

`zod-envkit`:

* ✅ validation
* ✅ TypeScript inference
* ✅ documentation
* ✅ CLI tooling

They are designed to be used **together**.

---

## Design principles

* explicit configuration over magic
* no framework coupling
* small and predictable API
* library and CLI are independent but complementary
* environment variables are a runtime contract

---

## Roadmap

* [ ] schema ↔ meta consistency checks
* [ ] grouped sections in generated docs
* [ ] prettier, more human-friendly error output
* [ ] JSON schema export
* [ ] stricter validation modes for production

---

## Who is this for?

* backend and fullstack projects
* Node.js and Bun services
* CI/CD pipelines
* teams that want env errors to fail fast, not late

---

## License

MIT
