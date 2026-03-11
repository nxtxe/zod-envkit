[**zod-envkit**](../README.md)

***

> **sortMetaEntries**(`meta`, `sort?`): \[`string`, [`EnvMetaEntry`](../type-aliases/EnvMetaEntry.md)\][]

Defined in: [generate.ts:167](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/generate.ts#L167)

Sort meta entries.

- `none`: keep insertion order
- `alpha`: by key (A-Z)
- `required-first`: required first, then A-Z

## Parameters

### meta

[`EnvMeta`](../type-aliases/EnvMeta.md)

### sort?

[`SortMode`](../type-aliases/SortMode.md) = `"none"`

## Returns

\[`string`, [`EnvMetaEntry`](../type-aliases/EnvMetaEntry.md)\][]

## Since

1.1.0
