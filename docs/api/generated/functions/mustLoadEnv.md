[**zod-envkit**](../README.md)

***

> **mustLoadEnv**\<`T`\>(`schema`): `output`\<`T`\>

Defined in: [index.ts:98](https://github.com/nxtxe/zod-envkit/blob/d516fbb4c8248745f7d74c1f07defaf4529c33ec/src/index.ts#L98)

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

## Example

```ts
export const env = mustLoadEnv(EnvSchema);
```

## Throws

ZodError

## Since

1.0.5
