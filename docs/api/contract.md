# Public API contract (1.x)

## Public API (stable)

### Library exports
Stable in `1.x`:
- loadEnv
- mustLoadEnv
- formatZodError
- checkEnv
- getMissingEnv
- getUnknownEnv
- isSecretKey
- generateEnvExample
- generateEnvDocs
- sortMetaEntries

### CLI
Commands and flags are part of the public API:
- generate, show, check, init
- documented flags and exit codes

## What is considered breaking

Breaking changes include:
- changing function signatures or return types
- removing/renaming public exports
- removing/renaming CLI commands or flags
- changing exit code semantics
- changing default CLI behavior

Non-breaking:
- adding new optional exports
- adding new flags
- improving error messages or formatting (without changing meaning)
