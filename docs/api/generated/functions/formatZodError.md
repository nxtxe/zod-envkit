[**zod-envkit**](../README.md)

***

> **formatZodError**(`err`): `string`

Defined in: [index.ts:119](https://github.com/nxtxe/zod-envkit/blob/137bf7d90d4933c7973970d7b5ac8687b11d6835/src/index.ts#L119)

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
