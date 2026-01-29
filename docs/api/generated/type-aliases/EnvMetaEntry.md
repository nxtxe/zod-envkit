[**zod-envkit**](../README.md)

***

> **EnvMetaEntry** = `object`

Defined in: [generate.ts:12](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L12)

Metadata entry for a single environment variable.

This file is part of the stable public API: it powers the CLI generators,
and is intended to be reusable by consumers.

## Since

1.0.0

## Properties

### default?

> `optional` **default**: `string`

Defined in: [generate.ts:44](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L44)

Default value (documentation only).

#### Since

1.1.0

***

### deprecated?

> `optional` **deprecated**: `boolean`

Defined in: [generate.ts:51](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L51)

Mark variable as deprecated in docs.

#### Since

1.1.0

***

### description?

> `optional` **description**: `string`

Defined in: [generate.ts:16](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L16)

Human-readable description.

***

### example?

> `optional` **example**: `string`

Defined in: [generate.ts:23](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L23)

Example value used for `.env.example` and documentation.

Tip: do NOT put real secrets here.

***

### group?

> `optional` **group**: `string`

Defined in: [generate.ts:37](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L37)

Optional group/section for docs (primarily for Markdown format).

#### Since

1.1.0

***

### link?

> `optional` **link**: `string`

Defined in: [generate.ts:65](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L65)

Optional link to further documentation.

#### Since

1.1.0

***

### required?

> `optional` **required**: `boolean`

Defined in: [generate.ts:30](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L30)

Whether the variable is required.

#### Default Value

```ts
true
```

***

### since?

> `optional` **since**: `string`

Defined in: [generate.ts:58](https://github.com/nxtxe/zod-envkit/blob/e4062c1b035945e95890920af80f16276513426d/src/generate.ts#L58)

Version when the variable was introduced (documentation only).

#### Since

1.1.0
