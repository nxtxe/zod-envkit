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
    <a href="./README.md">English</a> |
    <a href="./README.RU.md">Русский</a>
  </p>
</div>

Type-safe environment variable validation and documentation using **Zod**.

**zod-envkit** is a small, explicit library + CLI that treats environment variables as an  
**explicit runtime contract**, not an implicit guessing game.

- validate `process.env` at startup
- get fully typed environment variables
- generate `.env.example`
- generate documentation (`ENV.md`, `ENV.json`, `ENV.yaml`)
- inspect env state via CLI (with secret masking)
- validate env strictly in CI/CD
- bootstrap configuration via `zod-envkit init`
- load multiple `.env*` files with priority

No cloud. No magic. Just code.

---

## Why

Environment variables are critical, but are usually handled poorly.

Typical problems:

- `process.env` is just `string | undefined`
- missing or invalid variables fail **at runtime**
- `.env.example` and docs drift out of sync
- CI/CD breaks late and unpredictably

**zod-envkit** solves this by making env:

- validated early
- typed
- documented
- checkable in CI

---

## When to use

Use **zod-envkit** if:

- you want env errors to fail **at startup**, not in production
- you use TypeScript and care about correct types
- you want `.env.example` and docs from a single source of truth
- you want CI to catch missing / unknown variables

## When NOT to use

Skip **zod-envkit** if:

- your project is extremely small and informal
- you don’t control environment variables at all
- you expect automatic schema introspection or “magic” behavior

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

### Safe mode (no throw)

```ts
const result = loadEnv(EnvSchema);

if (!result.ok) {
  console.error("Invalid environment:\n" + formatZodError(result.error));
  process.exit(1);
}

export const env = result.env;
```

### Fail-fast mode (recommended)

```ts
export const env = mustLoadEnv(EnvSchema);
```

Now:

* `env.PORT` is a **number**
* `env.DATABASE_URL` is a **string**
* TypeScript knows everything at compile time
* the app fails fast if env is invalid

---

## CLI usage

The CLI works from a metadata file: `env.meta.json`.

By default, it is searched in:

* `./env.meta.json`
* `./examples/env.meta.json`

---

## Example `env.meta.json`

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

### Generate `.env.example` and documentation

(Default behavior)

```bash
npx zod-envkit
```

or explicitly:

```bash
npx zod-envkit generate
```

Generate docs in different formats:

```bash
npx zod-envkit generate --format json
npx zod-envkit generate --format yaml
```

Control sorting:

```bash
npx zod-envkit generate --sort alpha
npx zod-envkit generate --sort required-first
```

---

### Show current environment status

Loads dotenv files, masks secrets, and displays a readable table.

```bash
npx zod-envkit show
```

Advanced options:

```bash
npx zod-envkit show --mask-mode full
npx zod-envkit show --no-mask
npx zod-envkit show --dotenv ".env,.env.local,.env.production"
```

---

### Validate environment (CI-friendly)

```bash
npx zod-envkit check
```

Strict mode (fail on unknown variables):

```bash
npx zod-envkit check --strict
```

* exits with code `1` if required variables are missing
* in `--strict` mode also fails on unknown variables

---

### Initialize configuration

Bootstrap configuration from existing files.

Generate `env.meta.json` from `.env.example`:

```bash
npx zod-envkit init
```

Generate `.env.example` from existing metadata:

```bash
npx zod-envkit init --from-meta
```

---

## Stability & Versioning

`zod-envkit` follows **Semantic Versioning**.

### Stable public API (1.x)

**Library:**

* `loadEnv`
* `mustLoadEnv`
* `formatZodError`
* `checkEnv`
* `getMissingEnv`
* `getUnknownEnv`
* `isSecretKey`
* `generateEnvExample`
* `generateEnvDocs`

**CLI:**

* `generate`, `show`, `check`, `init`
* documented flags and exit codes

### What is considered breaking

* changing function signatures or return types
* removing or renaming public exports
* removing or renaming CLI commands or flags
* changing exit code semantics
* changing default CLI behavior

Non-breaking:

* adding new optional features
* adding new flags
* improving error messages or formatting

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

## License

MIT
