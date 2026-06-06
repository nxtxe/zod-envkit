[**zod-envkit**](../README.md)

***

> **isSecretKey**(`key`): `boolean`

Defined in: [env.ts:98](https://github.com/nxtxe/zod-envkit/blob/e40a655270798157a2afc4388f9a490576efd12b/src/env.ts#L98)

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
