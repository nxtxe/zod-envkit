[**zod-envkit**](../README.md)

***

> **isSecretKey**(`key`): `boolean`

Defined in: [env.ts:124](https://github.com/nxtxe/zod-envkit/blob/0c9a53271099c245d2ca4ef19568ad5b8dec23a3/src/env.ts#L124)

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
