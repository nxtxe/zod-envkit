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
yarn add zod-envkit
pnpm add zod-envkit
bun add zod-envkit
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

Production guard (stricter deploy/CI checks; unknown dotenv keys fail like `--strict`):

```bash
npx zod-envkit check --production
```

* exits with code `1` if required variables are missing
* in `--strict` mode also fails on unknown variables (dotenv-loaded keys only)
* with `--production` also fails on unknown dotenv variables (same dotenv-only scope as `--strict`)

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

### Public API stability (1.x)

Everything listed below is treated as **stable public API** for the whole 1.x line.

**Library exports (entrypoint `zod-envkit`):**

- `loadEnv`
- `mustLoadEnv`
- `formatZodError`
- `checkEnv`
- `getMissingEnv`
- `getUnknownEnv`
- `isSecretKey`
- `generateEnvExample`
- `generateEnvDocs`
- `sortMetaEntries`
- related public types: `EnvMeta`, `EnvMetaEntry`, `EnvCheckResult`, `GenerateDocsOptions`, `DocsFormat`, `SortMode`

**CLI contract:**

- commands: `generate`, `show`, `check`, `init`
- documented flags and defaults
- exit code behavior (success = `0`, user error = `1`)

### Breaking change policy

A **breaking** change (major) includes:

- changing signatures or return shapes of the stable exports
- removing/renaming public exports
- removing/renaming CLI commands or flags
- changing CLI default behavior (e.g. what `zod-envkit` does with no args)
- changing exit code semantics
- changing output format contracts in a way that breaks existing tooling

A **non-breaking** change (minor/patch) includes:

- adding new exports (backwards compatible)
- adding new CLI flags (backwards compatible)
- adding new optional fields to `env.meta.json`
- improving error messages or docs output while keeping it valid

### What’s new in 1.2.0

Version **1.2.0** focuses on reliability, contract enforcement, and CI readiness.

Highlights:

- hardened strict mode behavior (`check --strict`) for CI usage
- deterministic dotenv priority handling
- improved secret masking guarantees in `show`
- expanded preprod test suite (smoke, contract, CLI E2E, robustness)
- CI pipeline enforces: build → tests → docs build

This is the point where `zod-envkit` stops being “just a helper” and becomes a
**stable environment contract tool for CI/CD pipelines**.

---

## Why not just dotenv?

`dotenv`:

- ❌ no validation
- ❌ no types
- ❌ no documentation
- ❌ no CI checks

`zod-envkit`:

- ✅ validation
- ✅ TypeScript inference
- ✅ documentation
- ✅ CLI tooling

They are designed to be used **together**.

---

## Design principles

- explicit configuration over magic
- no framework coupling
- small and predictable API
- library and CLI are independent but complementary
- environment variables are a runtime contract

---

## License

MIT
