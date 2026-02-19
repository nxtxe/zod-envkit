[**zod-envkit**](../README.md)

***

> **generateEnvExample**(`meta`): `string`

Defined in: [generate.ts:221](https://github.com/nxtxe/zod-envkit/blob/a439230ccd06f7c7dbd70963cdfe33ed9fae9c57/src/generate.ts#L221)

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
