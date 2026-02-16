[**zod-envkit**](../README.md)

***

> **checkEnv**(`meta`, `env?`): [`EnvCheckResult`](../type-aliases/EnvCheckResult.md)

Defined in: [env.ts:104](https://github.com/nxtxe/zod-envkit/blob/19d243b411f03c2044fae7f59e0c66676d1d1e90/src/env.ts#L104)

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
