// src/cli/commands/check.ts
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { loadDotEnv } from "../lib/dotenv.js";
import { loadMeta } from "../lib/meta.js";
import { loadSchemaFile } from "../lib/schema.js";
import { fail } from "../lib/fail.js";
import { getMissingEnv, getUnknownEnv } from "../../env.js";

/**
 * Register `zod-envkit check`.
 *
 * CONTRACT (stable in 1.x):
 * - exit 0 when env is OK
 * - exit 1 on user errors (missing/unknown/invalid config)
 * - in --strict mode unknown vars are checked against dotenv-only keys
 * - with --schema: compare schema keys vs meta keys; --schema-mode warn|strict
 */
export function registerCheck(program: Command, getLang: () => Lang) {
  program
    .command("check")
    .description("Exit with code 1 if env is invalid (loads dotenv)")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--dotenv <list>", "Comma-separated dotenv files (default: .env)", ".env")
    .option("--strict", "Fail if unknown env vars are present (dotenv-only)")
    .option(
      "--schema <file>",
      "Path to JS file exporting Zod object; run schema↔meta consistency check"
    )
    .option(
      "--schema-mode <mode>",
      "Schema↔meta consistency: warn (report, exit 0) or strict (report, exit 1)",
      "strict"
    )
    .action(async (opts) => {
      const lang = getLang();

      const loaded = loadDotEnv(opts.dotenv);
      const { meta } = loadMeta(lang, opts.config);

      const sections: string[] = [];

      const missing = getMissingEnv(meta, process.env);
      if (missing.length) {
        sections.push(t(lang, "MISSING_ENV"));
        missing.forEach((k) => sections.push(`- ${k}`));
        sections.push("");
      }

      if (opts.strict) {
        const unknown = getUnknownEnv(meta, loaded.env as unknown as NodeJS.ProcessEnv);
        if (unknown.length) {
          sections.push(t(lang, "UNKNOWN_ENV"));
          unknown.forEach((k) => sections.push(`- ${k}`));
          sections.push("");
        }
      }

      if (sections.length) {
        fail(lang, "ENV_INVALID", sections);
      }

      if (opts.schema) {
        const schemaMode = String(opts.schemaMode ?? "strict").toLowerCase();
        if (schemaMode !== "warn" && schemaMode !== "strict") {
          fail(lang, "INVALID_SCHEMA_MODE", ["- warn | strict"]);
        }

        const { keys: schemaKeys } = await loadSchemaFile(opts.schema, lang);
        const metaKeys = new Set(Object.keys(meta));

        const inSchemaNotMeta = schemaKeys.filter((k) => !metaKeys.has(k));
        const inMetaNotSchema = [...metaKeys].filter((k) => !schemaKeys.includes(k));

        const hasMismatch = inSchemaNotMeta.length > 0 || inMetaNotSchema.length > 0;

        if (hasMismatch) {
          const lines: string[] = [];
          if (inSchemaNotMeta.length) {
            lines.push(`❌ ${t(lang, "SCHEMA_VARS_NOT_IN_META")}`);
            inSchemaNotMeta.sort((a, b) => a.localeCompare(b)).forEach((k) => lines.push(`- ${k}`));
            lines.push(`   ${t(lang, "SCHEMA_HINT_ADD_TO_META")}`);
            lines.push("");
          }
          if (inMetaNotSchema.length) {
            lines.push(`❌ ${t(lang, "META_VARS_NOT_IN_SCHEMA")}`);
            inMetaNotSchema.sort((a, b) => a.localeCompare(b)).forEach((k) => lines.push(`- ${k}`));
            lines.push(`   ${t(lang, "META_HINT_SYNC_SCHEMA")}`);
          }
          const out = lines.join("\n");
          if (schemaMode === "strict") {
            console.error(out);
            process.exit(1);
          }
          console.warn(out);
        }
      }

      console.log(`✅ ${t(lang, "ENV_OK")}`);
      process.exit(0);
    });
}