[**zod-envkit**](../README.md)

***

> **loadEnv**\<`T`\>(`schema`, `opts?`): [`LoadEnvFail`](../type-aliases/LoadEnvFail.md) \| [`LoadEnvOk`](../type-aliases/LoadEnvOk.md)\<`T`\>

Defined in: [index.ts:74](https://github.com/nxtxe/zod-envkit/blob/e40a655270798157a2afc4388f9a490576efd12b/src/index.ts#L74)

Validate `process.env` using a Zod schema.

- On success: returns `{ ok: true, env }` (typed).
- On failure:
  - returns `{ ok: false, error }` by default
  - throws `ZodError` if `opts.throwOnError === true`

## Type Parameters

### T

`T` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

## Parameters

### schema

`T`

### opts?

[`LoadEnvOptions`](../type-aliases/LoadEnvOptions.md)

## Returns

[`LoadEnvFail`](../type-aliases/LoadEnvFail.md) \| [`LoadEnvOk`](../type-aliases/LoadEnvOk.md)\<`T`\>

## Remarks

Load dotenv (e.g. `import "dotenv/config"`) before calling so `process.env` is populated.

## See

[mustLoadEnv](mustLoadEnv.md) — fail-fast variant that returns env directly.

## Example

```ts
const result = loadEnv(EnvSchema);
if (!result.ok) {
  console.error("Invalid environment:\n" + formatZodError(result.error));
  process.exit(1);
}
export const env = result.env;
```

## Since

1.0.0
