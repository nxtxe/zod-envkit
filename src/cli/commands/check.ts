// src/cli/commands/check.ts
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { loadDotEnv } from "../lib/dotenv.js";
import { loadMeta } from "../lib/meta.js";

export function registerCheck(program: Command, getLang: () => Lang) {
  program
    .command("check")
    .description("Exit with code 1 if any required env var is missing (loads .env)")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--env-file <file>", "Path to .env file", ".env")
    .action((opts) => {
      const lang = getLang();

      loadDotEnv(opts.envFile);
      const { meta } = loadMeta(lang, opts.config);

      const missing: string[] = [];
      for (const [key, m] of Object.entries(meta)) {
        const required = m.required !== false;
        if (!required) continue;

        const raw = process.env[key];
        if (!raw || raw.length === 0) missing.push(key);
      }

      if (missing.length) {
        console.error(`❌ ${t(lang, "MISSING_ENV")}`);
        for (const k of missing) console.error(`- ${k}`);
        process.exit(1);
      }

      console.log(`✅ ${t(lang, "ENV_OK")}`);
      process.exit(0);
    });
}
