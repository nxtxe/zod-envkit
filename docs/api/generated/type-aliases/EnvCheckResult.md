[**zod-envkit**](../README.md)

***

> **EnvCheckResult** = `object`

Defined in: [env.ts:17](https://github.com/nxtxe/zod-envkit/blob/6e3aface48044ce84679d1792e0960fa78d3a7d8/src/env.ts#L17)

Result of validating an env object against [EnvMeta](EnvMeta.md).

- `missing`: required keys that are missing or empty
- `unknown`: keys present in env but not described in meta

## Since

1.2.0

## Properties

### missing

> **missing**: `string`[]

Defined in: [env.ts:19](https://github.com/nxtxe/zod-envkit/blob/6e3aface48044ce84679d1792e0960fa78d3a7d8/src/env.ts#L19)

***

### ok

> **ok**: `boolean`

Defined in: [env.ts:18](https://github.com/nxtxe/zod-envkit/blob/6e3aface48044ce84679d1792e0960fa78d3a7d8/src/env.ts#L18)

***

### unknown

> **unknown**: `string`[]

Defined in: [env.ts:20](https://github.com/nxtxe/zod-envkit/blob/6e3aface48044ce84679d1792e0960fa78d3a7d8/src/env.ts#L20)
