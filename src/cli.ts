#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import { generateEnvDocs, generateEnvExample, type EnvMeta } from "./generate.js";

const program = new Command();

program
  .name("smart-env")
  .description("Generate .env.example and ENV.md from env.meta.json")
  .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
  .option("--out-example <file>", "Output file for .env.example", ".env.example")
  .option("--out-docs <file>", "Output file for docs", "ENV.md")
  .action((opts) => {
    const configPath = path.resolve(process.cwd(), opts.config);
    const raw = fs.readFileSync(configPath, "utf8");
    const meta: EnvMeta = JSON.parse(raw);

    fs.writeFileSync(opts.outExample, generateEnvExample(meta), "utf8");
    fs.writeFileSync(opts.outDocs, generateEnvDocs(meta), "utf8");

    console.log(`Generated: ${opts.outExample}, ${opts.outDocs}`);
  });

program.parse();
