# env.meta.json

The CLI uses `env.meta.json` as an explicit contract for:

* generating `.env.example`
* generating documentation (`ENV.md`, `ENV.json`, `ENV.yaml`)
* checking required variables in CI

By default, the CLI searches:

* `./env.meta.json`
* `./examples/env.meta.json`

## Example

```json
{
  "NODE_ENV": {
    "description": "Runtime mode",
    "example": "development",
    "required": true,
    "group": "Core"
  },
  "DATABASE_URL": {
    "description": "Postgres connection string",
    "example": "postgres://user:pass@localhost:5432/db",
    "required": true,
    "group": "Database"
  },
  "JWT_SECRET": {
    "description": "JWT signing key",
    "example": "change-me",
    "required": true,
    "group": "Auth",
    "since": "1.1.0",
    "link": "https://example.com/docs/auth#jwt"
  }
}
```

## Supported fields

Each key is an environment variable name. Value is metadata:

* `description?: string` — human-readable description
* `example?: string` — example value for `.env.example` and docs
* `required?: boolean` — defaults to `true`
* `group?: string` — section name in generated docs
* `default?: string` — default value (if any)
* `deprecated?: boolean | string` — mark as deprecated (use string to explain)
* `since?: string` — version when introduced
* `link?: string` — reference URL

## Groups

If `group` is present, generators can render grouped sections (e.g. “Database”, “Auth”).
If omitted, the variable is placed into a default group.

## Tips

* Keep secrets out of `example` values.
* Use `group` to keep docs readable for larger projects.
* Add `since` and `deprecated` to support long-lived services with evolving config.