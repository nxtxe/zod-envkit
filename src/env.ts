// src/env.ts
import type { EnvMeta } from "./generate.js";

export type EnvCheckResult = {
  ok: boolean;
  missing: string[];
  unknown: string[];
};

export function getMissingEnv(meta: EnvMeta, env: NodeJS.ProcessEnv = process.env): string[] {
  const missing: string[] = [];
  for (const [key, m] of Object.entries(meta)) {
    const required = m.required !== false;
    if (!required) continue;
    const raw = env[key];
    if (!raw || raw.length === 0) missing.push(key);
  }
  return missing;
}

export function getUnknownEnv(meta: EnvMeta, env: NodeJS.ProcessEnv = process.env): string[] {
  const known = new Set(Object.keys(meta));
  const unknown: string[] = [];
  for (const k of Object.keys(env)) {
    if (!known.has(k)) unknown.push(k);
  }
  // часто полезно стабильно сортировать
  unknown.sort((a, b) => a.localeCompare(b));
  return unknown;
}

const SECRET_PATTERNS: ReadonlyArray<(k: string) => boolean> = [
  (k) => k.includes("TOKEN"),
  (k) => k.includes("SECRET"),
  (k) => k.includes("PASSWORD"),
  (k) => k.includes("PRIVATE"),
  (k) => k.includes("API_KEY"),
  (k) => k.endsWith("_KEY"),
];

export function isSecretKey(key: string): boolean {
  const k = key.toUpperCase();
  return SECRET_PATTERNS.some((fn) => fn(k));
}

export function checkEnv(meta: EnvMeta, env: NodeJS.ProcessEnv = process.env): EnvCheckResult {
  const missing = getMissingEnv(meta, env);
  const unknown = getUnknownEnv(meta, env);
  return { ok: missing.length === 0 && unknown.length === 0, missing, unknown };
}
