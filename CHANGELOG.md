# Changelog

All notable changes to this project will be documented in this file.
This project follows [Semantic Versioning](https://semver.org/).

## [1.1.2](https://github.com/nxtxe/zod-envkit/compare/v1.1.1...v1.1.2) (2026-01-29)

### Bug Fixes

* **cli:** fix strict mode to validate only dotenv-loaded variables
* **cli:** stabilize option validation and documentation links
* **ci:** ensure CLI smoke tests and docs build in CI
* internal cleanup to align behavior with documented API contract


## [1.1.1](https://github.com/nxtxe/zod-envkit/compare/v1.1.0...v1.1.1) (2026-01-29)


### Bug Fixes

* **cli:** stabilize options validation and docs links ([640b12b](https://github.com/nxtxe/zod-envkit/commit/640b12bf95304da40c998374ba7ed08b7400e88d))
* stabilize public API, CLI behavior, and documentation ([4604298](https://github.com/nxtxe/zod-envkit/commit/46042981f146f021919da8a4a713b2d251c542d9))

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
