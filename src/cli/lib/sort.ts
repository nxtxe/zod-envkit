// src/cli/lib/sort.ts
import type { EnvMeta, SortMode } from "../../generate.js";

/**
 * Sort environment variable keys according to {@link SortMode}.
 *
 * CONTRACT (stable in 1.x):
 * - "none" → preserves insertion order
 * - "alpha" → sorts keys A–Z
 * - "required-first" → required vars first, then A–Z
 *
 * This helper is CLI-internal but its behavior affects
 * visible CLI output, therefore its semantics are treated
 * as stable within 1.x.
 *
 * @internal
 * @since 1.1.0
 */
export function sortKeys(meta: EnvMeta, sort: SortMode): string[] {
  const keys = Object.keys(meta);

  if (sort === "none") {
    // preserve original insertion order
    return [...keys];
  }

  if (sort === "alpha") {
    return [...keys].sort((a, b) => a.localeCompare(b));
  }

  // required-first
  return [...keys].sort((a, b) => {
    const ar = meta[a]?.required === false ? 1 : 0;
    const br = meta[b]?.required === false ? 1 : 0;

    if (ar !== br) return ar - br;
    return a.localeCompare(b);
  });
}