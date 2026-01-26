Type-safe environment variable validation and documentation using Zod.

`zod-envkit` is a small library and CLI tool that helps you:
- validate `process.env`
- get **fully typed environment variables**
- automatically generate `.env.example`
- generate environment documentation (`ENV.md`)
- treat environment variables as an **explicit contract**, not guesswork

No cloud. No magic. Just code.

---

## Why

The problem:
- `process.env` is just `string | undefined`
- environment errors often appear **only at runtime**
- `.env.example` and documentation are often outdated or missing

The solution:
- define your environment **once**
- get:
  - early validation
  - TypeScript types
  - up-to-date `.env.example`
  - up-to-date documentation

---

## Installation

```bash
npm install zod-envkit
````

or

```bash
pnpm add zod-envkit
```

---

## Quick start

```ts
import "dotenv/config";
import { z } from "zod";
import { loadEnv, formatZodError } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535),
  DATABASE_URL: z.string().url()
});

const result = loadEnv(EnvSchema);

if (!result.ok) {
  console.error("Invalid environment:\n" + formatZodError(result.error));
  process.exit(1);
}

export const env = result.env;
```

Now:

* `env.PORT` is a **number**
* `env.DATABASE_URL` is a **string**
* TypeScript knows everything at compile time

---

## CLI: generate `.env.example` and `ENV.md`

### 1️⃣ Create `env.meta.json` in your project root

```json
{
  "NODE_ENV": {
    "description": "Application runtime environment",
    "example": "development"
  },
  "PORT": {
    "description": "HTTP server port",
    "example": "3000"
  },
  "DATABASE_URL": {
    "description": "PostgreSQL connection string",
    "example": "postgresql://user:pass@localhost:5432/db"
  }
}
```

---

### 2️⃣ Run the CLI

```bash
npx zod-envkit
```

Or locally during development:

```bash
node dist/cli.js
```

---

### 3️⃣ Output

#### `.env.example`

```env
# Application runtime environment
NODE_ENV=development

# HTTP server port
PORT=3000

# PostgreSQL connection string
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

#### `ENV.md`

```md
# Environment variables

| Key | Required | Example | Description |
|---|---:|---|---|
| NODE_ENV | yes | development | Application runtime environment |
| PORT | yes | 3000 | HTTP server port |
| DATABASE_URL | yes | postgresql://... | PostgreSQL connection string |
```

---

## CLI options

```bash
zod-envkit --help
```

```bash
zod-envkit \
  --config env.meta.json \
  --out-example .env.example \
  --out-docs ENV.md
```

---

## Why not just dotenv?

`dotenv`:

* ❌ no validation
* ❌ no types
* ❌ no documentation

`zod-envkit`:

* ✅ validation
* ✅ TypeScript inference
* ✅ documentation
* ✅ CLI tooling

They work **great together**.

---

## Design decisions

* ❌ does not try to automatically parse Zod schemas
* ❌ does not couple to any framework
* ✅ explicit configuration over magic
* ✅ small, predictable API
* ✅ library + CLI, both optional

---

## Roadmap

* [ ] schema ↔ meta consistency checks
* [ ] `zod-envkit check` (validation only)
* [ ] grouping / sections in docs
* [ ] prettier, human-friendly error output
* [ ] JSON schema export

---

## Who is this for?

* backend and fullstack projects
* Node.js / Bun services
* CI/CD pipelines
* teams that treat env as part of their contract

---

## License

MIT
