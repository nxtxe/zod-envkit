// src/cli/commands/check.ts
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { loadDotEnv } from "../lib/dotenv.js";
import { loadMeta } from "../lib/meta.js";
import { fail } from "../lib/fail.js";
import { getMissingEnv, getUnknownEnv } from "../../env.js";

/**
 * Register `zod-envkit check`.
 *
 * CONTRACT (stable in 1.x):
 * - exit 0 when env is OK
 * - exit 1 on user errors (missing/unknown/invalid config)
 * - in --strict mode unknown vars are checked against dotenv-only keys
 */
export function registerCheck(program: Command, getLang: () => Lang) {
  program
    .command("check")
    .description("Exit with code 1 if env is invalid (loads dotenv)")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--dotenv <list>", "Comma-separated dotenv files (default: .env)", ".env")
    .option("--strict", "Fail if unknown env vars are present (dotenv-only)")
    .action((opts) => {
      const lang = getLang();

      const loaded = loadDotEnv(opts.dotenv);
      const { meta } = loadMeta(lang, opts.config);

      // Missing is checked against actual runtime env (dotenv merged into process.env)
      const missing = getMissingEnv(meta, process.env);
      if (missing.length) {
        fail(lang, "MISSING_ENV", missing.map((k) => `- ${k}`));
      }

      if (opts.strict) {
        // Strict checks unknown only in dotenv-provided keys (avoid OS/CI noise)
        const unknown = getUnknownEnv(meta, loaded.env as unknown as NodeJS.ProcessEnv);
        if (unknown.length) {
          fail(lang, "UNKNOWN_ENV", unknown.map((k) => `- ${k}`));
        }
      }

      console.log(`✅ ${t(lang, "ENV_OK")}`);
      process.exit(0);
    });
}