[**zod-envkit**](../README.md)

***

> **EnvCheckResult** = `object`

Defined in: [env.ts:17](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/env.ts#L17)

Result of validating an env object against [EnvMeta](EnvMeta.md).

- `missing`: required keys that are missing or empty
- `unknown`: keys present in env but not described in meta

## Since

1.2.0

## Properties

### missing

> **missing**: `string`[]

Defined in: [env.ts:19](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/env.ts#L19)

***

### ok

> **ok**: `boolean`

Defined in: [env.ts:18](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/env.ts#L18)

***

### unknown

> **unknown**: `string`[]

Defined in: [env.ts:20](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/env.ts#L20)
