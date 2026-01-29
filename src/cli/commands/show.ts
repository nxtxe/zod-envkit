// src/cli/commands/show.ts
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { loadDotEnv } from "../lib/dotenv.js";
import { loadMeta } from "../lib/meta.js";
import { maskValue, type MaskMode } from "../lib/mask.js";
import { printMarkdownTable } from "../lib/table.js";
import { sortKeys } from "../lib/sort.js";
import type { SortMode } from "../../generate.js";

function isMaskMode(v: string): v is MaskMode {
  return v === "partial" || v === "full" || v === "none";
}

function isSortMode(v: string): v is SortMode {
  return v === "alpha" || v === "required-first" || v === "none";
}

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

      loadDotEnv(String(opts.dotenv ?? ".env"));
      const { meta } = loadMeta(lang, opts.config);

      // commander: --no-mask => opts.mask === false
      const fallbackMode: MaskMode = opts.mask === false ? "none" : "partial";

      const modeRaw = String(opts.maskMode ?? fallbackMode);
      if (!isMaskMode(modeRaw)) {
        console.error(`❌ ${t(lang, "INVALID_MASK_MODE")}: ${modeRaw}`);
        console.error(`- partial | full | none`);
        process.exit(1);
      }

      const sortRaw = String(opts.sort ?? "none");
      if (!isSortMode(sortRaw)) {
        console.error(`❌ ${t(lang, "INVALID_SORT")}: ${sortRaw}`);
        console.error(`- alpha | required-first | none`);
        process.exit(1);
      }

      const keys = sortKeys(meta, sortRaw);

      const rows = keys.map((key) => {
        const m = meta[key]!;
        const required = m.required === false ? "no" : "yes";
        const raw = process.env[key];
        const present = raw && raw.length > 0 ? "yes" : "no";
        const value = raw ? maskValue(key, raw, modeRaw) : "";

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
