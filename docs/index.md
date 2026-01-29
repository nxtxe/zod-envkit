<div align="center">
  <br />

  <img src="/zod-envkit.svg" width="546" alt="zod-envkit" />

  <br />

 <a href="https://github.com/nxtxe/zod-envkit" style="display: inline-block; margin-right: 10px;">
  <img src="https://github.com/nxtxe/zod-envkit/actions/workflows/release.yml/badge.svg" />
</a>
<a href="https://www.npmjs.com/package/zod-envkit" style="display: inline-block; margin-right: 10px;">
  <img src="https://img.shields.io/npm/v/zod-envkit.svg?maxAge=100" alt="npm version" />
</a>
<a href="https://www.npmjs.com/package/zod-envkit" style="display: inline-block;">
  <img src="https://img.shields.io/npm/dt/zod-envkit.svg?maxAge=100" alt="npm downloads" />
</a>

</div>


# zod-envkit

Type-safe environment variable validation and documentation using **Zod**.

zod-envkit helps you treat environment variables as an **explicit runtime contract**, not an implicit guessing game.

## Features

- Runtime validation with Zod
- Fully typed `process.env`
- CLI for env inspection and CI checks
- Auto-generated `.env.example`
- Documentation generation (`md`, `json`, `yaml`)
- Strict validation for CI/CD

## Quickstart

```bash
npm install zod-envkit
````

```bash
yarn add zod-envkit
```

```bash
pnpm add zod-envkit
```

## Example

```ts
import "dotenv/config";
import { z } from "zod";
import { mustLoadEnv } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int(),
});

export const env = mustLoadEnv(EnvSchema);
```