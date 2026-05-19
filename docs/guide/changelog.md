---
title: What's new
---

> **Generated from [CHANGELOG.md](https://github.com/nxtxe/zod-envkit/blob/main/CHANGELOG.md).** Edit only the repo file.

## [1.3.5](https://github.com/nxtxe/zod-envkit/compare/v1.3.4...v1.3.5) (2026-05-04)


### Bug Fixes

* **cli:** harden 1.3.5 stability checks and release hygiene ([74381b9](https://github.com/nxtxe/zod-envkit/commit/74381b97785a469bf5465d8839702f206acb4c2e))

## [1.3.4](https://github.com/nxtxe/zod-envkit/compare/v1.3.3...v1.3.4) (2026-04-20)


### Bug Fixes

* **cli:** harden 1.3.4 output stability and edge robustness ([e3f52d7](https://github.com/nxtxe/zod-envkit/commit/e3f52d78917f726f08f7213fd31c00a52ca39deb))

## [1.3.4](https://github.com/nxtxe/zod-envkit/compare/v1.3.3...v1.3.4) (2026-03-xx)


### Bug Fixes

* deterministic output polish:
  * lock stable ordering and formatting of grouped `check --strict` errors across repeated runs
* masking edge hardening:
  * add coverage for short secret values (`1-2` chars) in `partial/full` modes
  * keep case-insensitive secret detection stable (`Api_Key`, `my_password`)
* dotenv parsing robustness:
  * add coverage for BOM, trailing spaces, and duplicate keys with deterministic override behavior
* fallback clarity hardening:
  * extend tests for empty/comment-only `.env.example` fallback path
* CLI smoke hardening:
  * repeated `--help`, `--version`, `show`, and `check` invocations across locales
* docs consistency patch:
  * keep EN/RU CLI contract sections aligned (no behavior changes)

## [1.3.3](https://github.com/nxtxe/zod-envkit/compare/v1.3.2...v1.3.3) (2026-03-xx)


### Bug Fixes

* output stability lock for CLI contract:
  * harden tests that lock `--help` command list, `--version` behavior, and exit-code semantics
  * lock stable `show` table headers (`Key`, `Required`, `Present`, `Value`, `Description`)
* document CLI stability policy in docs (EN + RU) without changing runtime behavior

## [1.3.2](https://github.com/nxtxe/zod-envkit/compare/v1.3.1...v1.3.2) (2026-03-23)


### Bug Fixes

* handle meta fallback edge case ([f54596e](https://github.com/nxtxe/zod-envkit/commit/f54596e9835f47076c079029f2c926228329d990))

## [1.3.1](https://github.com/nxtxe/zod-envkit/compare/v1.3.0...v1.3.1) (2026-03-19)


### Bug Fixes

* **cli:** improve env error grouping and hints ([d098a70](https://github.com/nxtxe/zod-envkit/commit/d098a70683f8028b7be275bd16a580f4fccb4938))

## [1.3.0](https://github.com/nxtxe/zod-envkit/compare/v1.2.3...v1.3.0) (2026-03-04)


### Features

* polish examples and install docs for 1.3.0 ([182ed34](https://github.com/nxtxe/zod-envkit/commit/182ed349f60c2e7cacb002f12c3a3642001eb19e))

## [1.2.3](https://github.com/nxtxe/zod-envkit/compare/v1.2.2...v1.2.3) (2026-02-19)


### Bug Fixes

* reliability polish (meta fallback, strict isolation, deterministic errors) ([a439230](https://github.com/nxtxe/zod-envkit/commit/a439230ccd06f7c7dbd70963cdfe33ed9fae9c57))

## [1.2.2](https://github.com/nxtxe/zod-envkit/compare/v1.2.1...v1.2.2) (2026-02-16)


### Bug Fixes

* regenerate lockfile (remove stale link: specifier) ([19d243b](https://github.com/nxtxe/zod-envkit/commit/19d243b411f03c2044fae7f59e0c66676d1d1e90))
* remove self link dependency from optionalDependencies ([3fd0568](https://github.com/nxtxe/zod-envkit/commit/3fd0568f327d112f496e357962810efdb06deaee))

## [1.2.1](https://github.com/nxtxe/zod-envkit/compare/v1.2.0...v1.2.1) (2026-02-16)


### Bug Fixes

* strengthen CLI + env contract guarantees ([d516fbb](https://github.com/nxtxe/zod-envkit/commit/d516fbb4c8248745f7d74c1f07defaf4529c33ec))


## [1.2.0] – 2026-02-16

### Added

* Preprod test suite (smoke, contract, CLI E2E, robustness)
* Strict CLI isolation for CI (no host env leakage)
* Robust helpers for CLI E2E testing
* Internal contract tests for public exports and exit codes

### Changed

* `init --from-meta` now generates `.env.example` from `env.meta.json`
* Test architecture restructured under `tests/test/preprod`
* CI workflow aligned with pnpm-only setup
* Improved stability of strict mode behavior

### Stability

* Public API (`loadEnv`, `mustLoadEnv`, CLI flags) treated as stable contract
* CLI exit codes verified by contract tests
* Documentation build enforced in CI

[1.2.0]: https://www.npmjs.com/package/zod-envkit/v/1.2.0

---

## [1.1.2] – 2026-01-29

### Fixed

* Strict mode now validates only dotenv-loaded variables (prevents host env leakage)
* Options validation and docs links stabilized
* CI updated to include CLI smoke tests and docs build
* Internal cleanup to align behavior with documented API contract

[1.1.2]: https://www.npmjs.com/package/zod-envkit/v/1.1.2

---

## [1.1.1] – 2026-01-29

### Fixed

* Options validation and docs links stabilized
* Public API, CLI behavior, and documentation hardened

[1.1.1]: https://www.npmjs.com/package/zod-envkit/v/1.1.1

---

## [1.1.0] – 2026-01-27

### Added

* New `zod-envkit init` command to bootstrap configuration:
  * generate `env.meta.json` from `.env.example`
  * generate `.env.example` from existing `env.meta.json`
* Support for loading multiple dotenv files via `--dotenv`
  * example: `.env,.env.local,.env.production`
  * files are loaded in order with override semantics
* Documentation generation in multiple formats:
  * `md` (default)
  * `json`
  * `yaml`
* Sorting options for docs and CLI output via `--sort`:
  * `alpha`
  * `required-first`
  * `none`
* Strict CI validation via `zod-envkit check --strict`
  * fails on missing **and** unknown environment variables
* Configurable secret masking in `zod-envkit show`:
  * `--mask-mode partial | full | none`
  * `--no-mask` alias
* Grouping support for environment variables via `meta.group`
* Extended env metadata fields:
  * `default`
  * `deprecated`
  * `since`
  * `link`
* New public core utilities:
  * `getMissingEnv`
  * `getUnknownEnv`
  * `checkEnv`
  * `isSecretKey`

### Changed

* CLI architecture refactored into a modular structure (`src/cli/*`)
  * no breaking behavior changes
* Documentation generator improved:
  * grouped sections
  * width-aware, centered markdown tables
  * extended metadata columns
* Public API explicitly documented and treated as a stable contract
* CLI default behavior preserved:
  * running `zod-envkit` without subcommand defaults to `generate`

### Fixed

* Inconsistent env resolution across CLI commands when using multiple dotenv files
* Edge cases in env validation with extra or empty variables
* Ordering and duplication issues in generated documentation
* Minor UX issues in CLI output and error handling

[1.1.0]: https://www.npmjs.com/package/zod-envkit/v/1.1.0

---

## [1.0.5] – 2026-01-26

### Added

* `mustLoadEnv` helper for fail-fast env loading
* Default CLI behavior: `zod-envkit` → `zod-envkit generate`
* Improved secret masking in `zod-envkit show`

### Changed

* Public API stabilized and separated from CLI internals
* CLI error handling improved:
  * no stack traces for user errors
  * consistent human-readable messages
  * strict exit codes
* `ENV.md` generation now produces centered, width-aware tables
* CLI now reliably resolves `env.meta.json` from:
  * project root
  * `./examples/`
  * explicit `-c/--config`

### Fixed

* TypeScript narrowing issues in CLI
* Potential double execution when running CLI without subcommands
* Inconsistent env loading behavior

[1.0.5]: https://www.npmjs.com/package/zod-envkit/v/1.0.5

---

## [1.0.4] – 2026-01-26

### Added

* `zod-envkit show` command
* `zod-envkit check` command (CI-friendly)

### Changed

* CLI now also searches for `env.meta.json` in `./examples/`

[1.0.4]: https://www.npmjs.com/package/zod-envkit/v/1.0.4

---

## [1.0.3] – 2026-01-26

* Git tag only (not published)

## [1.0.2] – 2026-01-26

* Git tag only (not published)

---

## [1.0.1] – 2026-01-26

### Changed

* npm packaging improvements (ship only compiled output and docs)
* Documentation updates

[1.0.1]: https://www.npmjs.com/package/zod-envkit/v/1.0.1

---

## [1.0.0] – 2026-01-26

### Added

* Initial release of **zod-envkit**
* Type-safe env validation with Zod
* `loadEnv` and `formatZodError`
* CLI to generate:
  * `.env.example`
  * `ENV.md`
* ESM and CommonJS builds
* TypeScript declarations
* Basic test suite (Vitest)
* MIT license

### Design decisions

* Explicit configuration over magic
* No schema introspection for docs
* Environment variables as a runtime contract
* Small, framework-agnostic core

[1.0.0]: https://www.npmjs.com/package/zod-envkit/v/1.0.0


# Changelog

All notable changes to this project will be documented in this file.
This project follows [Semantic Versioning](https://semver.org/).
