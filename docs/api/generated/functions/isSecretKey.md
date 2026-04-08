[**zod-envkit**](../README.md)

***

> **isSecretKey**(`key`): `boolean`

Defined in: [env.ts:98](https://github.com/nxtxe/zod-envkit/blob/55043bddf5d1394d563da6917910e0b3da012713/src/env.ts#L98)

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
