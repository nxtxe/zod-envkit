[**zod-envkit**](../README.md)

***

> **formatZodError**(`err`): `string`

Defined in: [index.ts:119](https://github.com/nxtxe/zod-envkit/blob/f9251023c99fa2967e45b88607b7f767d7248872/src/index.ts#L119)

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
