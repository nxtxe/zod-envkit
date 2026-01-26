# Changelog

All notable changes to this project will be documented in this file.  
This project follows [Semantic Versioning](https://semver.org/).

---

## [1.0.2] – 2026-01-26

### Added
- `zod-envkit show` command to display environment status in a readable table (with secret masking)
- `zod-envkit check` command to validate required variables with CI-friendly exit codes

### Changed
- CLI now also searches for `env.meta.json` in `./examples/` by default
- CLI output and documentation updated accordingly

[1.0.2]: https://www.npmjs.com/package/zod-envkit/v/1.0.2

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
