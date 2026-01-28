# Getting Started

This guide shows how to validate environment variables at runtime using zod-envkit.

## Install

```bash
npm add zod-envkit
```
```bash
pnpm add zod-envkit
```
```bash
yarn add zod-envkit
```
Create a single file responsible for loading and validating environment variables.

```ts
import "dotenv/config";
import { z } from "zod";
import { mustLoadEnv } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().min(1).max(65535),
});

export const env = mustLoadEnv(EnvSchema);
```

If validation fails, the application exits immediately with a readable error.

### What you get

* early failure on invalid or missing variables
* fully typed environment object
* predictable runtime behavior
* safer CI/CD deployments
