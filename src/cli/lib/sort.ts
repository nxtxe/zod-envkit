// src/cli/lib/sort.ts
import type { EnvMeta } from "../../generate.js";
import type { SortMode } from "../../generate.js";

export function sortKeys(meta: EnvMeta, sort: SortMode): string[] {
  const keys = Object.keys(meta);

  if (sort === "none") return keys;

  if (sort === "alpha") return keys.sort((a, b) => a.localeCompare(b));

  // required-first
  return keys.sort((a, b) => {
    const ar = meta[a]?.required === false ? 1 : 0;
    const br = meta[b]?.required === false ? 1 : 0;
    if (ar !== br) return ar - br;
    return a.localeCompare(b);
  });
}
