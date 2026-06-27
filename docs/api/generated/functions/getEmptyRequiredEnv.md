[**zod-envkit**](../README.md)

***

> **getEmptyRequiredEnv**(`meta`, `env`): `string`[]

Defined in: [env.ts:55](https://github.com/nxtxe/zod-envkit/blob/0c9a53271099c245d2ca4ef19568ad5b8dec23a3/src/env.ts#L55)

Return required keys from `meta` that are present in `env` but empty after trim.

Used by the CLI in `--production` mode to catch dotenv entries like `PORT=` or `PORT="   "`
without changing default `check` behavior for whitespace-only values.

## Parameters

### meta

[`EnvMeta`](../type-aliases/EnvMeta.md)

### env

`Record`\<`string`, `string`\>

## Returns

`string`[]

## Since

1.5.1
