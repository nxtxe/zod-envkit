// src/env.ts
import type { EnvMeta } from "./generate.js";

/**
 * Env validation helpers. Stable in 1.2.
 */

/**
 * Result of validating an env object against {@link EnvMeta}.
 *
 * - `missing`: required keys that are missing or empty
 * - `unknown`: keys present in env but not described in meta
 *
 * @public
 * @since 1.2.0
 */
export type EnvCheckResult = {
  ok: boolean;
  missing: string[];
  unknown: string[];
};

/**
 * Return required keys from `meta` that are missing (or empty) in `env`.
 *
 * @public
 * @since 1.2.0
 */
export function getMissingEnv(
  meta: EnvMeta,
  env: NodeJS.ProcessEnv = process.env
): string[] {
  const missing: string[] = [];

  for (const [key, m] of Object.entries(meta)) {
    const required = m.required !== false;
    if (!required) continue;

    const raw = env[key];
    if (!raw || raw.length === 0) missing.push(key);
  }

  return missing;
}

/**
 * Return required keys from `meta` that are present in `env` but empty after trim.
 *
 * Used by the CLI in `--production` mode to catch dotenv entries like `PORT=` or `PORT="   "`
 * without changing default `check` behavior for whitespace-only values.
 *
 * @public
 * @since 1.5.1
 */
export function getEmptyRequiredEnv(
  meta: EnvMeta,
  env: Record<string, string>
): string[] {
  const empty: string[] = [];

  for (const [key, m] of Object.entries(meta)) {
    const required = m.required !== false;
    if (!required) continue;
    if (!Object.prototype.hasOwnProperty.call(env, key)) continue;
    if (env[key].trim() === "") empty.push(key);
  }

  empty.sort((a, b) => a.localeCompare(b));
  return empty;
}

/**
 * Return keys present in `env` that are not defined in `meta`.
 *
 * Note: the result is returned in stable alphabetical order.
 *
 * @public
 * @since 1.2.0
 */
export function getUnknownEnv(
  meta: EnvMeta,
  env: NodeJS.ProcessEnv = process.env
): string[] {
  const known = new Set(Object.keys(meta));
  const unknown: string[] = [];

  for (const k of Object.keys(env)) {
    if (!known.has(k)) unknown.push(k);
  }

  unknown.sort((a, b) => a.localeCompare(b));
  return unknown;
}

/** @internal — patterns expect normalized key (use one list; key is uppercased so matching is case-insensitive) */
const SECRET_PATTERNS: ReadonlyArray<(k: string) => boolean> = [
  (k) => k.includes("SECRET"),
  (k) => k.includes("PASSWORD"),
  (k) => k.includes("PASS"),
  (k) => k.includes("PWD"),
  (k) => k.includes("PRIVATE"),
  (k) => k.includes("API_KEY"),
  (k) => k.endsWith("_KEY"),
  (k) => k === "KEY",
  (k) => k === "API",
  (k) => k.includes("TOKEN"),
  (k) => k.includes("JWT"),
  (k) => k.includes("SESSION"),
  (k) => k.includes("CREDENTIAL"),
  (k) => k.includes("CREDS"),
  (k) => k.includes("DATABASE_URL") || k === "DB_URL" || k === "POSTGRES_URL" || k === "MYSQL_URL" || k === "DATABASE",
  (k) => k.includes("CONNECTION_STRING"),
];

/**
 * Detect whether an env key name looks like a secret.
 *
 * Used by the CLI to mask values (e.g. SECRET, PASSWORD, TOKEN, *_KEY, connection strings).
 * Matching is case-insensitive (key is normalized to uppercase).
 *
 * @public
 * @since 1.2.0
 */
export function isSecretKey(key: string): boolean {
  return SECRET_PATTERNS.some((fn) => fn(key.toUpperCase()));
}

/**
 * Validate `env` against `meta`.
 *
 * This is a pure helper used by the CLI (and can be used in apps/CI too).
 *
 * Note: `ok` here means:
 * - no missing required vars
 * - no unknown vars
 *
 * The CLI may choose to ignore `unknown` unless `--strict` is enabled.
 *
 * If you want "missing only" checks, use {@link getMissingEnv}.
 *
 * @public
 * @since 1.2.0
 */
export function checkEnv(
  meta: EnvMeta,
  env: NodeJS.ProcessEnv = process.env
): EnvCheckResult {
  const missing = getMissingEnv(meta, env);
  const unknown = getUnknownEnv(meta, env);
  return { ok: missing.length === 0 && unknown.length === 0, missing, unknown };
}