[**zod-envkit**](../README.md)

***

> **generateEnvExample**(`meta`): `string`

Defined in: [generate.ts:221](https://github.com/nxtxe/zod-envkit/blob/91c6bf2a79a3cf9935ee9696b4fc1871424b95ca/src/generate.ts#L221)

Generate `.env.example` from [EnvMeta](../type-aliases/EnvMeta.md).

Rules:
- outputs `# description` comment if present
- outputs `KEY=example`

## Parameters

### meta

[`EnvMeta`](../type-aliases/EnvMeta.md)

## Returns

`string`

## Since

1.0.0
