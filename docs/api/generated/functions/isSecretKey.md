[**zod-envkit**](../README.md)

***

> **isSecretKey**(`key`): `boolean`

Defined in: [env.ts:98](https://github.com/nxtxe/zod-envkit/blob/36fecf8e73cd15af5cfbbf0f36b45a49b4fc0096/src/env.ts#L98)

Detect whether an env key name looks like a secret.

Used by the CLI to mask values (e.g. SECRET, PASSWORD, TOKEN, *_KEY, connection strings).
Matching is case-insensitive (key is normalized to uppercase).

## Parameters

### key

`string`

## Returns

`boolean`

## Since

1.2.0
