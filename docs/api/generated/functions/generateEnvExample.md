[**zod-envkit**](../README.md)

***

> **generateEnvExample**(`meta`): `string`

Defined in: [generate.ts:224](https://github.com/nxtxe/zod-envkit/blob/6e3aface48044ce84679d1792e0960fa78d3a7d8/src/generate.ts#L224)

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
