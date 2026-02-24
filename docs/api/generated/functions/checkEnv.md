[**zod-envkit**](../README.md)

***

> **checkEnv**(`meta`, `env?`): [`EnvCheckResult`](../type-aliases/EnvCheckResult.md)

Defined in: [env.ts:108](https://github.com/nxtxe/zod-envkit/blob/27a915fe7190596f2a29ee8a5373191ee171382a/src/env.ts#L108)

Validate `env` against `meta`.

This is a pure helper used by the CLI (and can be used in apps/CI too).

Note: `ok` here means:
- no missing required vars
- no unknown vars

The CLI may choose to ignore `unknown` unless `--strict` is enabled.

If you want "missing only" checks, use [getMissingEnv](getMissingEnv.md).

## Parameters

### meta

[`EnvMeta`](../type-aliases/EnvMeta.md)

### env?

`ProcessEnv` = `process.env`

## Returns

[`EnvCheckResult`](../type-aliases/EnvCheckResult.md)

## Since

1.2.0
