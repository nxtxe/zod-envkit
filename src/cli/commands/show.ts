// src/cli/commands/show.ts
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { loadDotEnv } from "../lib/dotenv.js";
import { loadMeta } from "../lib/meta.js";
import { maskValue } from "../lib/mask.js";
import { printMarkdownTable } from "../lib/table.js";

export function registerShow(program: Command, getLang: () => Lang) {
  program
    .command("show")
    .description("Show current env status (loads .env, masks secrets)")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--env-file <file>", "Path to .env file", ".env")
    .action((opts) => {
      const lang = getLang();

      loadDotEnv(opts.envFile);
      const { meta } = loadMeta(lang, opts.config);

      const rows = Object.entries(meta).map(([key, m]) => {
        const required = m.required === false ? "no" : "yes";
        const raw = process.env[key];
        const present = raw && raw.length > 0 ? "yes" : "no";
        const value = raw ? maskValue(key, raw) : "";

        return {
          Key: key,
          Required: required,
          Present: present,
          Value: value,
          Description: m.description ?? "",
        };
      });

      printMarkdownTable(rows, ["Key", "Required", "Present", "Value", "Description"]);
      process.exit(0);
    });
}
