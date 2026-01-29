// src/cli/lib/fail.ts
import { t, type Lang } from "../../i18n.js";

/**
 * Message key accepted by {@link fail}.
 *
 * Derived from available i18n keys to ensure type safety.
 *
 * @internal
 */
export type MsgKey = Parameters<typeof t>[1];

/**
 * Print a user-facing CLI error and exit the process.
 *
 * CONTRACT (stable in 1.x):
 * - Prints a single-line main error message prefixed with ❌
 * - Optionally prints detail lines (one per line)
 * - NEVER prints stack traces
 * - ALWAYS exits with code 1
 *
 * This function is the only allowed way to terminate the CLI on user errors.
 *
 * @param lang - Resolved CLI language
 * @param key - i18n message key
 * @param details - Optional detail lines
 *
 * @since 1.0.4
 */
export function fail(lang: Lang, key: MsgKey, details?: string[]): never {
  console.error(`❌ ${t(lang, key)}`);

  if (details?.length) {
    for (const line of details) {
      console.error(line);
    }
  }

  process.exit(1);
}
