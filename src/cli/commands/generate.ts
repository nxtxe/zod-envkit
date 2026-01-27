// src/cli/commands/generate.ts
import fs from "node:fs";
import path from "node:path";
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { loadMeta } from "../lib/meta.js";
import { generateEnvDocs, generateEnvExample, type DocsFormat, type SortMode } from "../../generate.js";

function defaultDocsOut(format: DocsFormat): string {
  if (format === "json") return "ENV.json";
  if (format === "yaml") return "ENV.yaml";
  return "ENV.md";
}

export function registerGenerate(program: Command, getLang: () => Lang) {
  program
    .command("generate")
    .description("Generate .env.example and ENV docs from env.meta.json")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--out-example <file>", "Output file for .env.example", ".env.example")
    .option("--out-docs <file>", "Output file for docs (default depends on --format)")
    .option("--format <format>", "Docs format (md | json | yaml)", "md")
    .option("--sort <mode>", "Sort mode (alpha | required-first | none)", "none")
    .option("--no-group", "Disable grouping by meta.group in markdown")
    .action((opts) => {
      const lang = getLang();
      const { meta } = loadMeta(lang, opts.config);

      const format = String(opts.format) as DocsFormat;
      const sort = String(opts.sort) as SortMode;
      const outDocs = opts.outDocs ? String(opts.outDocs) : defaultDocsOut(format);

      fs.writeFileSync(opts.outExample, generateEnvExample(meta), "utf8");
      fs.writeFileSync(outDocs, generateEnvDocs(meta, { format, sort, group: Boolean(opts.group) }), "utf8");

      console.log(
        t(lang, "GENERATED", { example: opts.outExample, docs: outDocs })
      );
      process.exit(0);
    });
}
