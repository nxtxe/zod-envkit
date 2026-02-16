[**zod-envkit**](../README.md)

***

> **getUnknownEnv**(`meta`, `env`): `string`[]

Defined in: [env.ts:50](https://github.com/nxtxe/zod-envkit/blob/f9251023c99fa2967e45b88607b7f767d7248872/src/env.ts#L50)

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
