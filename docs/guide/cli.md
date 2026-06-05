# CLI

zod-envkit includes a CLI for generating env documentation and validating configuration in CI.

Run:

```bash
npx zod-envkit --help
```

Deep handbook for onboarding and advanced workflows:

```bash
npx zod-envkit help --all
```

Language can be selected explicitly:

```bash
npx zod-envkit help --all --lang en
npx zod-envkit help --all --lang ru
```

## generate

Generate `.env.example` and documentation from `env.meta.json`.

```bash
npx zod-envkit generate
```

Common options:

```bash
npx zod-envkit generate \
  --config env.meta.json \
  --out-example .env.example \
  --out-docs ENV.md
```

### Docs format

```bash
npx zod-envkit generate --format md
npx zod-envkit generate --format json
npx zod-envkit generate --format yaml
```

### Sorting

```bash
npx zod-envkit generate --sort alpha
npx zod-envkit generate --sort required-first
npx zod-envkit generate --sort none
```

## show

Show current env status in a readable table.

* can load dotenv files
* masks secrets by default

```bash
npx zod-envkit show
```

### Dotenv chain

Load multiple files in order (later overrides earlier):

```bash
npx zod-envkit show --dotenv ".env,.env.local,.env.production"
```

### Masking

```bash
npx zod-envkit show --mask-mode partial
npx zod-envkit show --mask-mode full
npx zod-envkit show --no-mask
```

## check

Validate required environment variables.

```bash
npx zod-envkit check
```

* exits with code `0` on success
* exits with code `1` on failure

### Strict mode

Also fails if unknown variables are present (not listed in `env.meta.json`):

```bash
npx zod-envkit check --strict
```

Unknown-variable checks use **dotenv-loaded keys only** — variables present only in the host `process.env` are ignored.

### Production guard

Stricter deploy/CI checks before release or production deploy:

```bash
npx zod-envkit check --production
```

With `--production`, unknown variables from dotenv files fail the check the same way as `--strict`. Host-only variables that are not in the loaded dotenv chain are still ignored.

Use this in production pipelines when you want guardrails beyond the default `check`, without passing `--strict` explicitly. Additional production rules (empty required values, placeholder values) are added in later releases.

`--production` and `--strict` can be combined; unknown-variable validation runs once (no duplicate error sections).

### Dotenv chain

```bash
npx zod-envkit check --dotenv ".env,.env.local"
```

### Schema ↔ Meta consistency

When you maintain both a Zod schema (e.g. in `src/env.ts`) and `env.meta.json`, you can ensure they stay in sync:

```bash
npx zod-envkit check --schema dist/env.js
```

* **--schema &lt;file&gt;** — Path to a JS file that exports a Zod object (`z.object(...)`). The CLI compares its keys with `env.meta.json`: variables in the schema but not in meta, or in meta but not in the schema, are reported.
* **--schema-mode warn | strict** — `warn` (report only, exit 0) or `strict` (report and exit 1). Default: `strict`.

Example: fail the build if the schema and meta drift apart:

```bash
npx zod-envkit check --schema dist/env.js --schema-mode strict
```

## init

Bootstrap configuration from existing files.

### Create `env.meta.json` from `.env.example`

```bash
npx zod-envkit init
```

### Create `.env.example` from `env.meta.json`

```bash
npx zod-envkit init --from-meta
```

## Examples folder support

If your repository has examples:

* `./examples/env.meta.json`

the CLI will detect it automatically, or you can pass an explicit config:

```bash
npx zod-envkit generate -c examples/env.meta.json
```

## CLI contract stability

For the 1.x line, the following CLI behavior is treated as stable contract:

* `--help` lists the core commands: `generate`, `show`, `check`, `init`
* `help --all` prints an extended handbook (quick start, workflows, full command reference)
* `--version` prints a SemVer version string
* exit codes remain predictable:
  * `0` on success
  * `1` on user/config validation errors
* `show` keeps stable table header columns:
  * `Key`, `Required`, `Present`, `Value`, `Description`

Non-breaking updates may improve wording and hints, but should not change these contract points.
