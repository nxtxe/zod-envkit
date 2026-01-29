[**zod-envkit**](../README.md)

***

> **sortMetaEntries**(`meta`, `sort`): \[`string`, [`EnvMetaEntry`](../type-aliases/EnvMetaEntry.md)\][]

Defined in: [generate.ts:164](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L164)

Sort meta entries.

- `none`: keep insertion order
- `alpha`: by key (A-Z)
- `required-first`: required first, then A-Z

## Parameters

### meta

[`EnvMeta`](../type-aliases/EnvMeta.md)

### sort

[`SortMode`](../type-aliases/SortMode.md) = `"none"`

## Returns

\[`string`, [`EnvMetaEntry`](../type-aliases/EnvMetaEntry.md)\][]

## Since

1.1.0
