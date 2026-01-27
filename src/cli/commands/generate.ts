// src/cli/commands/generate.ts
import fs from "node:fs";
import type { Command } from "commander";
import type { Lang } from "../../i18n.js";
import { t } from "../../i18n.js";
import { loadMeta } from "../lib/meta.js";
import { generateEnvDocs, generateEnvExample } from "../../generate.js";

export function registerGenerate(program: Command, getLang: () => Lang) {
  program
    .command("generate")
    .description("Generate .env.example and ENV.md from env.meta.json")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--out-example <file>", "Output file for .env.example", ".env.example")
    .option("--out-docs <file>", "Output file for docs", "ENV.md")
    .action((opts) => {
      const lang = getLang();
      const { meta } = loadMeta(lang, opts.config);

      fs.writeFileSync(opts.outExample, generateEnvExample(meta), "utf8");
      fs.writeFileSync(opts.outDocs, generateEnvDocs(meta), "utf8");

      console.log(t(lang, "GENERATED", { example: opts.outExample, docs: opts.outDocs }));
      process.exit(0);
    });
}
