[**zod-envkit**](../README.md)

***

> **mustLoadEnv**\<`T`\>(`schema`): `output`\<`T`\>

Defined in: [index.ts:104](https://github.com/nxtxe/zod-envkit/blob/25e54f3e34d634bedce8655815613c84f68e9de5/src/index.ts#L104)

Fail-fast wrapper around [loadEnv](loadEnv.md).

Equivalent to: `loadEnv(schema, { throwOnError: true })` but returns typed env directly.

## Type Parameters

### T

`T` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

## Parameters

### schema

`T`

## Returns

`output`\<`T`\>

## Remarks

Load dotenv (e.g. `import "dotenv/config"`) before calling so `process.env` is populated.

## See

[loadEnv](loadEnv.md) — returns a result object instead of throwing.

## Example

```ts
export const env = mustLoadEnv(EnvSchema);
```

## Throws

ZodError

## Since

1.0.5
