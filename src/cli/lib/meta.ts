// src/cli/lib/meta.ts
import fs from "node:fs";
import path from "node:path";
import { t, type Lang } from "../../i18n.js";
import { fail } from "./fail.js";
import type { EnvMeta } from "../../generate.js";

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
