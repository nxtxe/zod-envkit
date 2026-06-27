[**zod-envkit**](../README.md)

***

> **getUnknownEnv**(`meta`, `env?`): `string`[]

Defined in: [env.ts:80](https://github.com/nxtxe/zod-envkit/blob/0c9a53271099c245d2ca4ef19568ad5b8dec23a3/src/env.ts#L80)

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
