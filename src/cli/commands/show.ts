// src/cli/commands/show.ts
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { loadDotEnv } from "../lib/dotenv.js";
import { loadMeta } from "../lib/meta.js";
import { maskValue, type MaskMode } from "../lib/mask.js";
import { printMarkdownTable } from "../lib/table.js";
import { sortKeys } from "../lib/sort.js";
import type { SortMode } from "../../generate.js";

export function registerShow(program: Command, getLang: () => Lang) {
  program
    .command("show")
    .description("Show current env status (loads dotenv, masks secrets)")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--dotenv <list>", "Comma-separated dotenv files (default: .env)", ".env")
    .option("--mask-mode <mode>", "Mask mode (partial | full | none)", "partial")
    .option("--no-mask", "Alias for --mask-mode none")
    .option("--sort <mode>", "Sort mode (alpha | required-first | none)", "none")
    .action((opts) => {
      const lang = getLang();

      loadDotEnv(opts.dotenv);
      const { meta } = loadMeta(lang, opts.config);

      const maskMode: MaskMode = opts.mask ? "partial" : "none";
      const mode: MaskMode = (opts.maskMode ? String(opts.maskMode) : maskMode) as MaskMode;
      const sort: SortMode = String(opts.sort) as SortMode;

      const keys = sortKeys(meta, sort);

      const rows = keys.map((key) => {
        const m = meta[key]!;
        const required = m.required === false ? "no" : "yes";
        const raw = process.env[key];
        const present = raw && raw.length > 0 ? "yes" : "no";
        const value = raw ? maskValue(key, raw, mode) : "";

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
