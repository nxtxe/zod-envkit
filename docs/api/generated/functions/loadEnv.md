[**zod-envkit**](../README.md)

***

> **loadEnv**\<`T`\>(`schema`, `opts?`): [`LoadEnvFail`](../type-aliases/LoadEnvFail.md) \| [`LoadEnvOk`](../type-aliases/LoadEnvOk.md)\<`T`\>

Defined in: [index.ts:71](https://github.com/nxtxe/zod-envkit/blob/73ec75f40db0e0caf6dc091774017654bdfb18f9/src/index.ts#L71)

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
