[**zod-envkit**](../README.md)

***

> **GenerateDocsOptions** = `object`

Defined in: [generate.ts:101](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/generate.ts#L101)

Options for [generateEnvDocs](../functions/generateEnvDocs.md).

## Since

1.1.0

## Properties

### format?

> `optional` **format**: [`DocsFormat`](DocsFormat.md)

Defined in: [generate.ts:107](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/generate.ts#L107)

Output format.

#### Default Value

```ts
"md"
```

***

### group?

> `optional` **group**: `boolean`

Defined in: [generate.ts:124](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/generate.ts#L124)

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

Defined in: [generate.ts:114](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/generate.ts#L114)

Sort mode.

#### Default Value

```ts
"none"
```
