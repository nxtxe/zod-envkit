## [1.0.5](https://github.com/nxtxe/zod-envkit/compare/v1.0.4...v1.0.5) (2026-01-26)


### Bug Fixes

* release 1.0.5 ([4d48479](https://github.com/nxtxe/zod-envkit/commit/4d48479b62819d4c17cc05eb14c64f387806cbec))

## [1.0.4](https://github.com/nxtxe/zod-envkit/compare/v1.0.3...v1.0.4) (2026-01-26)


### Bug Fixes

* **ci:** retry install to avoid rollup optional deps issue ([356e2c2](https://github.com/nxtxe/zod-envkit/commit/356e2c2b8980484767be29062d5f8eb4cdb4fde4))
* **ci:** retry install to avoid rollup optional deps issue ([7063e29](https://github.com/nxtxe/zod-envkit/commit/7063e29bb5cc3c7a8151a2afade035300ac5cff0))
* **cli:** stabilize release and execution behavior ([13f9b4f](https://github.com/nxtxe/zod-envkit/commit/13f9b4fe9f8893ec0d0b5b0f2373ef24cad76108))
* **release:** publish fix ([6811915](https://github.com/nxtxe/zod-envkit/commit/681191593e681d48b2e6490fcdd49f2b06a6bda5))
* **release:** publish repair ([a7f6557](https://github.com/nxtxe/zod-envkit/commit/a7f655758b3c214bb977f1e34cbb10246b39234a))
* **release:** publish retry ([1c55df0](https://github.com/nxtxe/zod-envkit/commit/1c55df00cf48623178d0a7cc81dfc68fc7b8dac0))
* **release:** retry with granular npm token ([c851824](https://github.com/nxtxe/zod-envkit/commit/c851824ba1777d31e14f7ea5306dc92adcab4de7))
* trigger patch release ([2c978e5](https://github.com/nxtxe/zod-envkit/commit/2c978e5b93b159117ca52eeed84e07063e9ecfea))

## [1.0.4](https://github.com/nxtxe/zod-envkit/compare/v1.0.3...v1.0.4) (2026-01-26)


### Bug Fixes

* **ci:** retry install to avoid rollup optional deps issue ([356e2c2](https://github.com/nxtxe/zod-envkit/commit/356e2c2b8980484767be29062d5f8eb4cdb4fde4))
* **ci:** retry install to avoid rollup optional deps issue ([7063e29](https://github.com/nxtxe/zod-envkit/commit/7063e29bb5cc3c7a8151a2afade035300ac5cff0))
* **cli:** stabilize release and execution behavior ([13f9b4f](https://github.com/nxtxe/zod-envkit/commit/13f9b4fe9f8893ec0d0b5b0f2373ef24cad76108))
* **release:** publish fix ([6811915](https://github.com/nxtxe/zod-envkit/commit/681191593e681d48b2e6490fcdd49f2b06a6bda5))
* **release:** publish repair ([a7f6557](https://github.com/nxtxe/zod-envkit/commit/a7f655758b3c214bb977f1e34cbb10246b39234a))
* **release:** publish retry ([1c55df0](https://github.com/nxtxe/zod-envkit/commit/1c55df00cf48623178d0a7cc81dfc68fc7b8dac0))
* **release:** retry with granular npm token ([c851824](https://github.com/nxtxe/zod-envkit/commit/c851824ba1777d31e14f7ea5306dc92adcab4de7))

# Changelog

All notable changes to this project will be documented in this file.  
This project follows [Semantic Versioning](https://semver.org/).

---

## [1.0.5] – 2026-01-26

### Added
- `mustLoadEnv` helper for fail-fast env loading (throws on invalid env)
- Default CLI behavior: running `zod-envkit` without subcommand now behaves like `zod-envkit generate`
- Better secret masking in `zod-envkit show` (TOKEN / SECRET / PASSWORD / *_KEY / PRIVATE)

### Changed
- Public API (`loadEnv`, `mustLoadEnv`, `formatZodError`) stabilized and separated from CLI/generators
- CLI error handling improved:
  - no stack traces for user errors
  - consistent human-readable messages
  - strict exit codes (`0` success, `1` error)
- `ENV.md` generation now produces fully centered, width-aware Markdown tables
- CLI now reliably resolves `env.meta.json` from:
  - project root
  - `./examples/`
  - explicit `-c/--config` path

### Fixed
- TypeScript type narrowing issues in CLI (`fs.readFileSync` with undefined paths)
- Potential double execution when running CLI without subcommands
- Inconsistent env loading behavior across CLI commands

[1.0.5]: https://www.npmjs.com/package/zod-envkit/v/1.0.5

---

## [1.0.4] – 2026-01-26

### Added
- `zod-envkit show` command to display env status in a readable table (with secret masking)
- `zod-envkit check` command to validate required variables (CI-friendly exit codes)

### Changed
- CLI now also searches for `env.meta.json` in `./examples/` by default

[1.0.4]: https://www.npmjs.com/package/zod-envkit/v/1.0.4

---

## [1.0.3] – 2026-01-26
- Git tag only (not published to npm)

---

## [1.0.2] – 2026-01-26
- Git tag only (not published to npm)

---

## [1.0.1] – 2026-01-26

### Changed
- Packaging improvements for npm (ship only compiled output and docs)
- Documentation updates

[1.0.1]: https://www.npmjs.com/package/zod-envkit/v/1.0.1

---

## [1.0.0] – 2026-01-26

### Added
- Initial release of **zod-envkit**
- Type-safe environment variable validation using Zod
- `loadEnv` helper for safe runtime parsing of `process.env`
- `formatZodError` for human-readable error output
- CLI tool to generate:
  - `.env.example`
  - `ENV.md` documentation
- Support for ESM and CommonJS builds
- TypeScript declaration files (`.d.ts`) included
- Basic test suite using Vitest
- MIT license

### Design Decisions
- Explicit configuration over magic
- No automatic schema introspection for documentation generation
- Environment variables treated as an explicit runtime contract
- Small, framework-agnostic core

[1.0.0]: https://www.npmjs.com/package/zod-envkit/v/1.0.0
