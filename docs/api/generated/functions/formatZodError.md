[**zod-envkit**](../README.md)

***

> **formatZodError**(`err`): `string`

Defined in: [index.ts:119](https://github.com/nxtxe/zod-envkit/blob/73ec75f40db0e0caf6dc091774017654bdfb18f9/src/index.ts#L119)

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
