// src/cli/lib/meta.ts
import fs from "node:fs";
import path from "node:path";
import { t, type Lang } from "../../i18n.js";
import { fail } from "./fail.js";
import type { EnvMeta } from "../../generate.js";

/**
 * Resolve possible locations of `env.meta.json`.
 *
 * Search order:
 * 1. <cwd>/<configFile>
 * 2. <cwd>/examples/<configFile>
 * 3. <cwd>/examples/env.meta.json
 *
 * This function does not throw. It only reports candidates and the first match.
 *
 * @internal
 * @since 1.1.0
 */
export function resolveMetaPath(configFile: string): { candidates: string[]; found?: string } {
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, configFile),
    path.resolve(cwd, "examples", configFile),
    path.resolve(cwd, "examples", "env.meta.json"),
  ];

  const found = candidates.find((p) => fs.existsSync(p));
  return { candidates, found };
}

/**
 * Load and parse `env.meta.json`.
 *
 * CONTRACT (stable in 1.x):
 * - Resolves path using {@link resolveMetaPath}
 * - On missing file → calls {@link fail} with META_NOT_FOUND
 * - On invalid JSON → calls {@link fail} with META_PARSE_FAILED
 * - Never throws raw errors
 *
 * Returns parsed meta and the resolved config path.
 *
 * @internal
 * @since 1.1.0
 */
export function loadMeta(lang: Lang, configFile: string): { meta: EnvMeta; configPath: string } {
  const { candidates, found } = resolveMetaPath(configFile);

  if (!found) {
    fail(lang, "META_NOT_FOUND", [
      t(lang, "META_TRIED"),
      ...candidates.map((p) => `- ${p}`),
      "",
      t(lang, "META_TIP"),
      "  npx zod-envkit show -c examples/env.meta.json",
    ]);
  }

  const configPath = found;

  try {
    const raw = fs.readFileSync(configPath, "utf8");
    return { meta: JSON.parse(raw) as EnvMeta, configPath };
  } catch {
    fail(lang, "META_PARSE_FAILED", [`- ${configPath}`]);
  }
}
