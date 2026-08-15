// src/cli/lib/production-placeholder.ts
import type { EnvMeta } from "../../generate.js";
import { isSecretKey } from "../../env.js";

/**
 * Why a dotenv value is treated as a production placeholder (v1 rules).
 *
 * @internal
 */
export type PlaceholderReason =
  | "matches-example"
  | "literal"
  | "angle-bracket"
  | "your-here";

/**
 * One placeholder finding for CLI reporting.
 *
 * @internal
 */
export type PlaceholderHit = {
  key: string;
  reason: PlaceholderReason;
  /** Optional literal token when reason is `literal` (safe to show for non-secrets). */
  literal?: string;
};

const LITERAL_PLACEHOLDERS = new Set(["changeme", "todo", "xxx"]);

/** Whole-value angle-bracket template, e.g. `<YOUR_API_KEY>` — not URLs. */
const ANGLE_BRACKET_RE = /^<[^<>\s]+>$/;

/** Whole-value YOUR_*_HERE template, e.g. `YOUR_SECRET_HERE`. */
const YOUR_HERE_RE = /^YOUR_[A-Z0-9]+(?:_[A-Z0-9]+)*_HERE$/i;

function classifyPlaceholder(
  value: string,
  example: string | undefined
): Omit<PlaceholderHit, "key"> | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const exampleTrimmed = (example ?? "").trim();
  if (exampleTrimmed && trimmed === exampleTrimmed) {
    return { reason: "matches-example" };
  }

  const lower = trimmed.toLowerCase();
  if (LITERAL_PLACEHOLDERS.has(lower)) {
    return { reason: "literal", literal: lower };
  }

  if (ANGLE_BRACKET_RE.test(trimmed)) {
    return { reason: "angle-bracket" };
  }

  if (YOUR_HERE_RE.test(trimmed)) {
    return { reason: "your-here" };
  }

  return null;
}

/**
 * Find dotenv keys whose values look like production placeholders (v1).
 *
 * Rules (documented in CLI guide):
 * - value equals non-empty meta `example`
 * - lowercase exact match: `changeme`, `todo`, `xxx`
 * - whole-value templates: `<...>`, `YOUR_*_HERE`
 *
 * Only keys present in both `meta` and `env` are checked. Empty values are skipped
 * (handled by empty-required checks). Results are sorted by key.
 *
 * @internal
 */
export function findProductionPlaceholders(
  meta: EnvMeta,
  env: Record<string, string>
): PlaceholderHit[] {
  const hits: PlaceholderHit[] = [];

  for (const key of Object.keys(meta).sort((a, b) => a.localeCompare(b))) {
    if (!Object.prototype.hasOwnProperty.call(env, key)) continue;
    const value = env[key];
    if (value.trim() === "") continue;

    const classified = classifyPlaceholder(value, meta[key]?.example);
    if (!classified) continue;

    hits.push({ key, ...classified });
  }

  return hits;
}

function reasonLabel(hit: PlaceholderHit, secret: boolean): string {
  switch (hit.reason) {
    case "matches-example":
      return "matches meta example";
    case "literal":
      // For secrets do not echo the placeholder token (same as the env value).
      return secret ? "literal placeholder" : `literal: ${hit.literal ?? ""}`;
    case "angle-bracket":
      return "angle-bracket template";
    case "your-here":
      return "YOUR_*_HERE template";
  }
}

/**
 * Format a placeholder hit for CLI output (key + reason).
 *
 * Never prints the raw env value. For {@link isSecretKey} keys, literal tokens
 * are also suppressed so the secret-looking placeholder is not echoed.
 *
 * @internal
 */
export function formatPlaceholderHit(hit: PlaceholderHit): string {
  const secret = isSecretKey(hit.key);
  return `- ${hit.key} (${reasonLabel(hit, secret)})`;
}
