// src/cli/commands/generate.ts
import fs from "node:fs";
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { loadMeta } from "../lib/meta.js";
import {
  generateEnvDocs,
  generateEnvExample,
  type DocsFormat,
  type SortMode,
} from "../../generate.js";

function defaultDocsOut(format: DocsFormat): string {
  if (format === "json") return "ENV.json";
  if (format === "yaml") return "ENV.yaml";
  return "ENV.md";
}

function isDocsFormat(v: string): v is DocsFormat {
  return v === "md" || v === "json" || v === "yaml";
}

function isSortMode(v: string): v is SortMode {
  return v === "alpha" || v === "required-first" || v === "none";
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

      const formatRaw = String(opts.format ?? "md");
      if (!isDocsFormat(formatRaw)) {
        console.error(`❌ ${t(lang, "INVALID_FORMAT")}: ${formatRaw}`);
        console.error(`- md | json | yaml`);
        process.exit(1);
      }

      const sortRaw = String(opts.sort ?? "none");
      if (!isSortMode(sortRaw)) {
        console.error(`❌ ${t(lang, "INVALID_SORT")}: ${sortRaw}`);
        console.error(`- alpha | required-first | none`);
        process.exit(1);
      }

      const outExample = String(opts.outExample ?? ".env.example");
      const outDocs = opts.outDocs ? String(opts.outDocs) : defaultDocsOut(formatRaw);

      fs.writeFileSync(outExample, generateEnvExample(meta), "utf8");

      fs.writeFileSync(
        outDocs,
        generateEnvDocs(meta, { format: formatRaw, sort: sortRaw, group: Boolean(opts.group) }),
        "utf8"
      );

      console.log(t(lang, "GENERATED", { example: outExample, docs: outDocs }));
      process.exit(0);
    });
}
