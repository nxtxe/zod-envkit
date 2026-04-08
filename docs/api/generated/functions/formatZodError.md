[**zod-envkit**](../README.md)

***

> **formatZodError**(`err`): `string`

Defined in: [index.ts:128](https://github.com/nxtxe/zod-envkit/blob/8bdd27d86193664bc2350889cf738c47edf89023/src/index.ts#L128)

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
