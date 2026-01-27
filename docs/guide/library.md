# Library

zod-envkit provides a small, focused runtime API for validating `process.env`.

## loadEnv

Safely parse environment variables without throwing.

```ts
import { z } from "zod";
import { loadEnv, formatZodError } from "zod-envkit";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  PORT: z.coerce.number().int().min(1).max(65535),
});

const result = loadEnv(EnvSchema);

if (!result.ok) {
  console.error("Invalid environment:\n" + formatZodError(result.error));
  process.exit(1);
}

export const env = result.env;
````

**Returns**

* `{ ok: true, env }` on success
* `{ ok: false, error }` on validation failure

## mustLoadEnv

Fail-fast version of `loadEnv`.

```ts
import { z } from "zod";
import { mustLoadEnv } from "zod-envkit";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().min(1).max(65535),
});

export const env = mustLoadEnv(EnvSchema);
```

* throws a `ZodError` if validation fails
* recommended at application startup

## formatZodError

Convert a `ZodError` into a readable multi-line string.

```ts
import { z } from "zod";
import { loadEnv, formatZodError } from "zod-envkit";

const schema = z.object({ PORT: z.coerce.number().int() });
const res = loadEnv(schema);

if (!res.ok) {
  console.error(formatZodError(res.error));
}
```

Output format:

* one issue per line
* includes the path (e.g. `PORT`) and message

## Notes

* zod-envkit validates `process.env` only (strings) — use `z.coerce.*` to coerce values.
* Keep the env schema in one place (startup) to fail early and keep types consistent.