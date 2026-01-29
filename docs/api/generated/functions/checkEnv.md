[**zod-envkit**](../README.md)

***

> **checkEnv**(`meta`, `env`): [`EnvCheckResult`](../type-aliases/EnvCheckResult.md)

Defined in: [env.ts:104](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/env.ts#L104)

Validate `env` against `meta`.

This is a pure helper used by the CLI (and can be used in apps/CI too).

Note: `ok` here means:
- no missing required vars
- no unknown vars (because this function is strict by definition)

If you want "missing only" checks, use [getMissingEnv](getMissingEnv.md).

## Parameters

### meta

[`EnvMeta`](../type-aliases/EnvMeta.md)

### env

`ProcessEnv` = `process.env`

## Returns

[`EnvCheckResult`](../type-aliases/EnvCheckResult.md)

## Since

1.1.0
