# Changelog

All notable changes to this project will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/).

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
- Automatic type inference for validated environment variables
- Support for ESM and CommonJS builds
- TypeScript declaration files (`.d.ts`) included
- Basic test suite using Vitest
- Clear and documented API surface
- MIT license

### Design Decisions
- Explicit configuration over magic
- No automatic schema introspection for documentation generation
- Environment variables treated as an explicit runtime contract
- Small, framework-agnostic core

---

[1.0.0]: https://www.npmjs.com/package/zod-envkit/v/1.0.0


## [1.0.1] – 2026-01-26

### Changed
- Documentation and packaging improvements
- Minor CLI/docs adjustments

[1.0.1]: https://www.npmjs.com/package/zod-envkit/v/1.0.1
