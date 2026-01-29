[**zod-envkit**](../README.md)

***

> **GenerateDocsOptions** = `object`

Defined in: [generate.ts:98](https://github.com/nxtxe/zod-envkit/blob/91c6bf2a79a3cf9935ee9696b4fc1871424b95ca/src/generate.ts#L98)

Options for [generateEnvDocs](../functions/generateEnvDocs.md).

## Since

1.1.0

## Properties

### format?

> `optional` **format**: [`DocsFormat`](DocsFormat.md)

Defined in: [generate.ts:104](https://github.com/nxtxe/zod-envkit/blob/91c6bf2a79a3cf9935ee9696b4fc1871424b95ca/src/generate.ts#L104)

Output format.

#### Default Value

```ts
"md"
```

***

### group?

> `optional` **group**: `boolean`

Defined in: [generate.ts:121](https://github.com/nxtxe/zod-envkit/blob/91c6bf2a79a3cf9935ee9696b4fc1871424b95ca/src/generate.ts#L121)

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

Defined in: [generate.ts:111](https://github.com/nxtxe/zod-envkit/blob/91c6bf2a79a3cf9935ee9696b4fc1871424b95ca/src/generate.ts#L111)

Sort mode.

#### Default Value

```ts
"none"
```
