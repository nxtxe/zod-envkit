[**zod-envkit**](../README.md)

***

> **formatZodError**(`err`): `string`

Defined in: [index.ts:119](https://github.com/nxtxe/zod-envkit/blob/d516fbb4c8248745f7d74c1f07defaf4529c33ec/src/index.ts#L119)

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
