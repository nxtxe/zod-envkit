[**zod-envkit**](../README.md)

***

> **getUnknownEnv**(`meta`, `env?`): `string`[]

Defined in: [env.ts:54](https://github.com/nxtxe/zod-envkit/blob/6e3aface48044ce84679d1792e0960fa78d3a7d8/src/env.ts#L54)

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
