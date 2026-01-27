// src/cli/commands/init.ts
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { fail } from "../lib/fail.js";
import type { EnvMeta } from "../../generate.js";
import { generateEnvExample } from "../../generate.js";
import { loadMeta } from "../lib/meta.js";

function readEnvFile(file: string): Record<string, string> {
  const abs = path.resolve(process.cwd(), file);
  if (!fs.existsSync(abs)) return {};
  const raw = fs.readFileSync(abs, "utf8");
  return dotenv.parse(raw);
}

function metaFromEnv(env: Record<string, string>, defaultGroup?: string): EnvMeta {
  const meta: EnvMeta = {};
  const keys = Object.keys(env).sort((a, b) => a.localeCompare(b));

  for (const k of keys) {
    meta[k] = {
      example: env[k] ?? "",
      required: true,
      group: defaultGroup || undefined,
      description: "",
    };
  }

  return meta;
}

export function registerInit(program: Command, getLang: () => Lang) {
  program
    .command("init")
    .description("Initialize env.meta.json from .env.example (or generate .env.example from meta)")
    .option("--input <file>", "Input file (default: .env.example)", ".env.example")
    .option("--output <file>", "Output file (default: env.meta.json)", "env.meta.json")
    .option("--from-meta", "Generate .env.example from env.meta.json instead")
    .option("--group <name>", "Default group for all vars (when generating meta)")
    .action((opts) => {
      const lang = getLang();

      if (opts.fromMeta) {
        // meta -> .env.example
        const { meta } = loadMeta(lang, String(opts.input || "env.meta.json"));
        fs.writeFileSync(String(opts.output || ".env.example"), generateEnvExample(meta), "utf8");
        process.exit(0);
      }

      // .env.example -> meta
      const env = readEnvFile(String(opts.input));
      if (Object.keys(env).length === 0) {
        fail(lang, "META_PARSE_FAILED", [
          `- ${t(lang, "INIT_INPUT_EMPTY")} ${String(opts.input)}`
        ]);
      }

      const meta = metaFromEnv(env, opts.group ? String(opts.group) : undefined);
      fs.writeFileSync(String(opts.output), JSON.stringify(meta, null, 2) + "\n", "utf8");
      process.exit(0);
    });
}
