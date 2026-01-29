[**zod-envkit**](../README.md)

***

> **sortMetaEntries**(`meta`, `sort`): \[`string`, [`EnvMetaEntry`](../type-aliases/EnvMetaEntry.md)\][]

Defined in: [generate.ts:164](https://github.com/nxtxe/zod-envkit/blob/91c6bf2a79a3cf9935ee9696b4fc1871424b95ca/src/generate.ts#L164)

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
