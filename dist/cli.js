#!/usr/bin/env node

// src/cli.ts
import fs from "fs";
import path from "path";
import { Command } from "commander";

// src/generate.ts
function generateEnvExample(meta) {
  const lines = [];
  for (const [key, m] of Object.entries(meta)) {
    if (m.description) lines.push(`# ${m.description}`);
    lines.push(`${key}=${m.example ?? ""}`);
    lines.push("");
  }
  return lines.join("\n").trim() + "\n";
}
function generateEnvDocs(meta) {
  const rows = Object.entries(meta).map(([key, m]) => {
    const req = m.required === false ? "no" : "yes";
    return `| ${key} | ${req} | ${m.example ?? ""} | ${m.description ?? ""} |`;
  });
  return [
    `# Environment variables`,
    ``,
    `| Key | Required | Example | Description |`,
    `|---|---:|---|---|`,
    ...rows,
    ``
  ].join("\n");
}

// src/cli.ts
var program = new Command();
program.name("smart-env").description("Generate .env.example and ENV.md from env.meta.json").option("-c, --config <file>", "Path to env meta json", "env.meta.json").option("--out-example <file>", "Output file for .env.example", ".env.example").option("--out-docs <file>", "Output file for docs", "ENV.md").action((opts) => {
  const configPath = path.resolve(process.cwd(), opts.config);
  const raw = fs.readFileSync(configPath, "utf8");
  const meta = JSON.parse(raw);
  fs.writeFileSync(opts.outExample, generateEnvExample(meta), "utf8");
  fs.writeFileSync(opts.outDocs, generateEnvDocs(meta), "utf8");
  console.log(`Generated: ${opts.outExample}, ${opts.outDocs}`);
});
program.parse();
