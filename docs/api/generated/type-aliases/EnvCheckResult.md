[**zod-envkit**](../README.md)

***

> **EnvCheckResult** = `object`

Defined in: [env.ts:13](https://github.com/nxtxe/zod-envkit/blob/19d243b411f03c2044fae7f59e0c66676d1d1e90/src/env.ts#L13)

Result of validating an env object against [EnvMeta](EnvMeta.md).

- `missing`: required keys that are missing or empty
- `unknown`: keys present in env but not described in meta

## Since

1.2.0

## Properties

### missing

> **missing**: `string`[]

Defined in: [env.ts:15](https://github.com/nxtxe/zod-envkit/blob/19d243b411f03c2044fae7f59e0c66676d1d1e90/src/env.ts#L15)

***

### ok

> **ok**: `boolean`

Defined in: [env.ts:14](https://github.com/nxtxe/zod-envkit/blob/19d243b411f03c2044fae7f59e0c66676d1d1e90/src/env.ts#L14)

***

### unknown

> **unknown**: `string`[]

Defined in: [env.ts:16](https://github.com/nxtxe/zod-envkit/blob/19d243b411f03c2044fae7f59e0c66676d1d1e90/src/env.ts#L16)
