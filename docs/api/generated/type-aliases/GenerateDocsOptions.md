[**zod-envkit**](../README.md)

***

> **GenerateDocsOptions** = `object`

Defined in: [generate.ts:101](https://github.com/nxtxe/zod-envkit/blob/6c2f8286529e7462dcfae414b9bd59c59e3ae54c/src/generate.ts#L101)

Options for [generateEnvDocs](../functions/generateEnvDocs.md).

## Since

1.1.0

## Properties

### format?

> `optional` **format**: [`DocsFormat`](DocsFormat.md)

Defined in: [generate.ts:107](https://github.com/nxtxe/zod-envkit/blob/6c2f8286529e7462dcfae414b9bd59c59e3ae54c/src/generate.ts#L107)

Output format.

#### Default Value

```ts
"md"
```

***

### group?

> `optional` **group**: `boolean`

Defined in: [generate.ts:124](https://github.com/nxtxe/zod-envkit/blob/6c2f8286529e7462dcfae414b9bd59c59e3ae54c/src/generate.ts#L124)

Group Markdown output by `meta[*].group`.

- default: `true`
- ignored for `json` / `yaml`

#### Default Value

```ts
true
```

***

### sort?

> `optional` **sort**: [`SortMode`](SortMode.md)

Defined in: [generate.ts:114](https://github.com/nxtxe/zod-envkit/blob/6c2f8286529e7462dcfae414b9bd59c59e3ae54c/src/generate.ts#L114)

Sort mode.

#### Default Value

```ts
"none"
```
