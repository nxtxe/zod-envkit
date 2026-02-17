// src/cli/lib/meta.ts
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
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
 * Build minimal {@link EnvMeta} from `.env.example`.
 *
 * All variables:
 * - required = true
 * - description = ""
 * - example = value from file
 *
 * @internal
 */
function buildMetaFromEnvExample(examplePath: string): EnvMeta {
  const raw = fs.readFileSync(examplePath, "utf8");
  const parsed = dotenv.parse(raw);

  const meta: EnvMeta = {};
  const keys = Object.keys(parsed).sort((a, b) => a.localeCompare(b));

  for (const key of keys) {
    meta[key] = {
      example: parsed[key] ?? "",
      required: true,
      description: "",
    };
  }

  return meta;
}

/**
 * Load env metadata.
 *
 * CONTRACT (stable in 1.x):
 * - Resolves path using {@link resolveMetaPath}
 * - If meta exists → loads and parses it
 * - If meta not found but `.env.example` exists → builds minimal meta from it
 * - On invalid JSON → calls {@link fail} with META_PARSE_FAILED
 * - If neither meta nor example exists → calls {@link fail} with META_NOT_FOUND
 * - Never throws raw errors
 *
 * @internal
 * @since 1.1.0
 */
export function loadMeta(lang: Lang, configFile: string): { meta: EnvMeta; configPath: string } {
  const { candidates, found } = resolveMetaPath(configFile);

  if (found) {
    try {
      const raw = fs.readFileSync(found, "utf8");
      return { meta: JSON.parse(raw) as EnvMeta, configPath: found };
    } catch {
      fail(lang, "META_PARSE_FAILED", [`- ${found}`]);
    }
  }

  // fallback: .env.example
  const examplePath = path.resolve(process.cwd(), ".env.example");
  if (fs.existsSync(examplePath)) {
    // предупреждение — ОК, но это не ошибка (exit 0)
    console.warn(`⚠️ ${t(lang, "META_FALLBACK_EXAMPLE")}`);
    console.warn(`   ${t(lang, "META_FALLBACK_TIP")}`);
    console.warn("");

    return { meta: buildMetaFromEnvExample(examplePath), configPath: examplePath };
  }

  fail(lang, "META_NOT_FOUND", [
    t(lang, "META_TRIED"),
    ...candidates.map((p) => `- ${p}`),
    "",
    t(lang, "META_TIP"),
    "  npx zod-envkit show -c examples/env.meta.json",
  ]);
}