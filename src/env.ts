// src/env.ts
import type { EnvMeta } from "./generate.js";

/**
 * Result of validating an env object against {@link EnvMeta}.
 *
 * - `missing`: required keys that are missing or empty
 * - `unknown`: keys present in env but not described in meta
 *
 * @public
 * @since 1.1.0
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
 * @since 1.1.0
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
 * Return keys present in `env` that are not defined in `meta`.
 *
 * Note: the result is returned in stable alphabetical order.
 *
 * @public
 * @since 1.1.0
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

/**
 * @internal
 */
const SECRET_PATTERNS: ReadonlyArray<(k: string) => boolean> = [
  (k) => k.includes("TOKEN"),
  (k) => k.includes("SECRET"),
  (k) => k.includes("PASSWORD"),
  (k) => k.includes("PRIVATE"),
  (k) => k.includes("API_KEY"),
  (k) => k.endsWith("_KEY"),
];

/**
 * Detect whether an env key name looks like a secret.
 *
 * Used by the CLI to mask values (TOKEN/SECRET/PASSWORD/*_KEY/PRIVATE).
 *
 * @public
 * @since 1.1.0
 */
export function isSecretKey(key: string): boolean {
  const k = key.toUpperCase();
  return SECRET_PATTERNS.some((fn) => fn(k));
}

/**
 * Validate `env` against `meta`.
 *
 * This is a pure helper used by the CLI (and can be used in apps/CI too).
 *
 * Note: `ok` here means:
 * - no missing required vars
 * - no unknown vars (because this function is strict by definition)
 *
 * If you want "missing only" checks, use {@link getMissingEnv}.
 *
 * @public
 * @since 1.1.0
 */
export function checkEnv(
  meta: EnvMeta,
  env: NodeJS.ProcessEnv = process.env
): EnvCheckResult {
  const missing = getMissingEnv(meta, env);
  const unknown = getUnknownEnv(meta, env);
  return { ok: missing.length === 0 && unknown.length === 0, missing, unknown };
}
