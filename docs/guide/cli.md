# CLI

zod-envkit includes a CLI for generating env documentation and validating configuration in CI.

Run:

```bash
npx zod-envkit --help
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

### Dotenv chain

```bash
npx zod-envkit check --dotenv ".env,.env.local"
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
