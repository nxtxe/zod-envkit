[**zod-envkit**](../README.md)

***

> **getUnknownEnv**(`meta`, `env?`): `string`[]

Defined in: [env.ts:54](https://github.com/nxtxe/zod-envkit/blob/8bdd27d86193664bc2350889cf738c47edf89023/src/env.ts#L54)

Return keys present in `env` that are not defined in `meta`.

Note: the result is returned in stable alphabetical order.

## Parameters

### meta

[`EnvMeta`](../type-aliases/EnvMeta.md)

### env?

`ProcessEnv` = `process.env`

## Returns

`string`[]

## Since

1.2.0
