[**zod-envkit**](../README.md)

***

> **EnvMetaEntry** = `object`

Defined in: [generate.ts:14](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L14)

Metadata entry for a single environment variable.

This file is part of the stable public API: it powers the CLI generators,
and is intended to be reusable by consumers.

Stable in 1.2.

## Since

1.0.0

## Properties

### default?

> `optional` **default**: `string`

Defined in: [generate.ts:46](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L46)

Default value (documentation only).

#### Since

1.1.0

***

### deprecated?

> `optional` **deprecated**: `boolean` \| `string`

Defined in: [generate.ts:54](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L54)

Mark variable as deprecated in docs.
Use `true` for a generic warning (⚠️) or a string to show an explanation (e.g. "Use FOO instead").

#### Since

1.1.0

***

### description?

> `optional` **description**: `string`

Defined in: [generate.ts:18](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L18)

Human-readable description.

***

### example?

> `optional` **example**: `string`

Defined in: [generate.ts:25](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L25)

Example value used for `.env.example` and documentation.

Tip: do NOT put real secrets here.

***

### group?

> `optional` **group**: `string`

Defined in: [generate.ts:39](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L39)

Optional group/section for docs (primarily for Markdown format).

#### Since

1.1.0

***

### link?

> `optional` **link**: `string`

Defined in: [generate.ts:68](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L68)

Optional link to further documentation.

#### Since

1.1.0

***

### required?

> `optional` **required**: `boolean`

Defined in: [generate.ts:32](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L32)

Whether the variable is required.

#### Default Value

```ts
true
```

***

### since?

> `optional` **since**: `string`

Defined in: [generate.ts:61](https://github.com/nxtxe/zod-envkit/blob/5f56fca0f9994c65565b1d8eb35835c05b8d2352/src/generate.ts#L61)

Version when the variable was introduced (documentation only).

#### Since

1.1.0
