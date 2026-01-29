# API Stability Contract

This project follows **Semantic Versioning (SemVer)**.

The goal of this contract is to clearly define what is considered **stable public API** and what types of changes are allowed in each release category.

---

## Public API Definition

The **public API** of `zod-envkit` includes:

### Library API

Everything exported from the main package entrypoint (`zod-envkit`):

* Core functions:

  * `loadEnv`
  * `mustLoadEnv`
  * `formatZodError`

* Env metadata & generation:

  * `EnvMeta`
  * `EnvMetaEntry`
  * `generateEnvDocs`
  * `generateEnvExample`
  * `sortMetaEntries`
  * all related public option and result types

* Env inspection utilities:

  * `checkEnv`
  * `getMissingEnv`
  * `getUnknownEnv`
  * `isSecretKey`

Any symbol exported from the package entrypoint is considered **stable public API** unless explicitly marked as `@internal`.

### CLI API

The CLI interface is also part of the public API, including:

* Commands: `generate`, `show`, `check`, `init`
* Documented CLI flags and options
* Default behaviors
* Exit codes
* Output formats (including masking behavior)

Anything documented in the README or official docs is considered **contractual CLI API**.

---

## What Is Considered **BREAKING** (Major Version)

The following changes **require a major version bump**:

* Removing or renaming any exported public symbol
* Changing function signatures or return shapes
* Changing the runtime behavior of existing APIs
* Changing the meaning or default behavior of existing CLI flags
* Changing the `env.meta.json` format in a way that makes existing configs invalid or incompatible

---

## What Is Allowed in **MINOR** Releases (1.x)

The following changes are allowed in minor releases as long as they are backwards compatible:

* Adding new exported functions or types
* Adding new CLI flags or options
* Adding new optional fields to `env.meta.json` entries
* Extending documentation output with additional columns or metadata
* Introducing new features that do not alter existing behavior

---

## What Is Allowed in **PATCH** Releases

Patch releases are limited to non-breaking improvements:

* Bug fixes
* Error message and UX improvements
* Performance optimizations
* Internal refactors with no observable behavior change

---

## Stability Guarantee

As long as the major version remains `1.x`:

* Existing valid code will continue to work
* Existing `env.meta.json` files will remain compatible
* CLI usage documented for 1.x will not break