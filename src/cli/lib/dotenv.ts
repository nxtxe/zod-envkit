// src/cli/lib/dotenv.ts
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

export type DotenvLoadResult = {
  loaded: string[];
  skipped: string[];
  /**
   * Merged env from dotenv files only (last file wins).
   * Use this for strict checks to avoid OS/CI noise from process.env.
   */
  env: Record<string, string>;
};

function resolvePath(p: string): string {
  return path.resolve(process.cwd(), p);
}

/**
 * Loads one or multiple dotenv files in order.
 * Later files override earlier ones.
 *
 * Also:
 * - returns merged dotenv-only env object
 * - still writes keys into process.env for existing behavior
 */
export function loadDotEnv(files: string | undefined): DotenvLoadResult {
  const list = (files?.split(",").map((s) => s.trim()).filter(Boolean) ?? [".env"]);

  const loaded: string[] = [];
  const skipped: string[] = [];
  const merged: Record<string, string> = {};

  for (const f of list) {
    const abs = resolvePath(f);
    if (!fs.existsSync(abs)) {
      skipped.push(f);
      continue;
    }

    const raw = fs.readFileSync(abs, "utf8");
    const parsed = dotenv.parse(raw);

    // merge dotenv-only env (override in order)
    for (const [k, v] of Object.entries(parsed)) merged[k] = v;

    // keep previous behavior: write to process.env (override in order)
    for (const [k, v] of Object.entries(parsed)) process.env[k] = v;

    loaded.push(f);
  }

  return { loaded, skipped, env: merged };
}
