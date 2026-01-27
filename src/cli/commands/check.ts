// src/cli/commands/check.ts
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { loadDotEnv } from "../lib/dotenv.js";
import { loadMeta } from "../lib/meta.js";
import { getMissingEnv, getUnknownEnv } from "../../env.js";

export function registerCheck(program: Command, getLang: () => Lang) {
  program
    .command("check")
    .description("Exit with code 1 if env is invalid (loads dotenv)")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--dotenv <list>", "Comma-separated dotenv files (default: .env)", ".env")
    .option("--strict", "Fail if unknown env vars are present")
    .action((opts) => {
      const lang = getLang();

      loadDotEnv(opts.dotenv);
      const { meta } = loadMeta(lang, opts.config);

      const missing = getMissingEnv(meta, process.env);

      if (missing.length) {
        console.error(`❌ ${t(lang, "MISSING_ENV")}`);
        for (const k of missing) console.error(`- ${k}`);
        process.exit(1);
      }

      if (opts.strict) {
        const unknown = getUnknownEnv(meta, process.env);
        if (unknown.length) {
          console.error(`❌ ${t(lang, "UNKNOWN_ENV")}`);
          for (const k of unknown) console.error(`- ${k}`);
          process.exit(1);
        }
      }

      console.log(`✅ ${t(lang, "ENV_OK")}`);
      process.exit(0);
    });
}
