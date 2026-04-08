[**zod-envkit**](../README.md)

***

> **formatZodError**(`err`): `string`

Defined in: [index.ts:128](https://github.com/nxtxe/zod-envkit/blob/55043bddf5d1394d563da6917910e0b3da012713/src/index.ts#L128)

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
