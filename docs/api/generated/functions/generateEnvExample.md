[**zod-envkit**](../README.md)

***

> **generateEnvExample**(`meta`): `string`

Defined in: [generate.ts:224](https://github.com/nxtxe/zod-envkit/blob/0c9a53271099c245d2ca4ef19568ad5b8dec23a3/src/generate.ts#L224)

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
