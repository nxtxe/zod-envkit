[**zod-envkit**](../README.md)

***

> **getUnknownEnv**(`meta`, `env`): `string`[]

Defined in: [env.ts:50](https://github.com/nxtxe/zod-envkit/blob/46042981f146f021919da8a4a713b2d251c542d9/src/env.ts#L50)

Return keys present in `env` that are not defined in `meta`.

Note: the result is returned in stable alphabetical order.

## Parameters

### meta

[`EnvMeta`](../type-aliases/EnvMeta.md)

### env

`ProcessEnv` = `process.env`

## Returns

`string`[]

## Since

1.1.0
