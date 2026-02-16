[**zod-envkit**](../README.md)

***

> **formatZodError**(`err`): `string`

Defined in: [index.ts:119](https://github.com/nxtxe/zod-envkit/blob/6c41bff89886d09e0c1d98bc8e291ebaae776eca/src/index.ts#L119)

Format `ZodError` into a human-friendly multi-line message (one issue per line).

## Parameters

### err

`ZodError`

## Returns

`string`

## Example

```ts
console.error("Invalid environment:\n" + formatZodError(err));
```

## Since

1.0.0
