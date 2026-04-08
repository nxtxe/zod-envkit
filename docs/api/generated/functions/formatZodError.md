[**zod-envkit**](../README.md)

***

> **formatZodError**(`err`): `string`

Defined in: [index.ts:128](https://github.com/nxtxe/zod-envkit/blob/6c2f8286529e7462dcfae414b9bd59c59e3ae54c/src/index.ts#L128)

Format `ZodError` into a human-friendly multi-line message (one issue per line).

Output format (stable in 1.x): `path: message`

## Parameters

### err

`ZodError`

## Returns

`string`

## Example

```ts
const result = loadEnv(EnvSchema);
if (!result.ok) console.error(formatZodError(result.error));
```

## Since

1.0.0
