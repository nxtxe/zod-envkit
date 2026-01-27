[**zod-envkit**](../README.md)

***

[zod-envkit](../README.md) / mustLoadEnv

# Function: mustLoadEnv()

> **mustLoadEnv**\<`T`\>(`schema`): `output`\<`T`\>

Defined in: [index.ts:31](https://github.com/nxtxe/zod-envkit/blob/b6f764eaacf94eec48e893481f4401c998032db3/src/index.ts#L31)

Convenience wrapper around loadEnv(schema, { throwOnError: true })
Returns typed env or throws ZodError

## Type Parameters

### T

`T` *extends* `ZodType`\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

## Parameters

### schema

`T`

## Returns

`output`\<`T`\>
