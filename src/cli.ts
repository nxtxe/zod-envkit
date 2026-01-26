#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import dotenv from "dotenv";
import { resolveLang, t, type Lang } from "./i18n.js";
import { generateEnvDocs, generateEnvExample, type EnvMeta } from "./generate.js";

type MsgKey = Parameters<typeof t>[1];

function fail(lang: Lang, key: MsgKey, details?: string[]): never {
  console.error(`❌ ${t(lang, key)}`);
  if (details?.length) for (const d of details) console.error(d);
  process.exit(1);
}

function maskValue(key: string, value: string): string {
  const k = key.toUpperCase();
  const isSecret =
    k.includes("TOKEN") ||
    k.includes("SECRET") ||
    k.includes("PASSWORD") ||
    k.includes("API_KEY") ||
    k.endsWith("_KEY") ||
    k.includes("PRIVATE");

  if (!isSecret) return value;
  if (value.length <= 4) return "*".repeat(value.length);
  return value.slice(0, 2) + "*".repeat(Math.max(1, value.length - 4)) + value.slice(-2);
}

function padCenter(text: string, width: number): string {
  const v = text ?? "";
  const diff = width - v.length;
  if (diff <= 0) return v;
  const left = Math.floor(diff / 2);
  const right = diff - left;
  return " ".repeat(left) + v + " ".repeat(right);
}

function printTable(rows: Array<Record<string, string>>, headers: string[]) {
  const widths: Record<string, number> = {};
  for (const h of headers) widths[h] = h.length;

  for (const row of rows) {
    for (const h of headers) widths[h] = Math.max(widths[h], (row[h] ?? "").length);
  }

  for (const h of headers) widths[h] += 2;

  const headerLine = "|" + headers.map((h) => " " + padCenter(h, widths[h]) + " ").join("|") + "|";
  const sepLine = "|" + headers.map((h) => ":" + "-".repeat(Math.max(3, widths[h])) + ":").join("|") + "|";

  console.log(headerLine);
  console.log(sepLine);

  for (const row of rows) {
    console.log("|" + headers.map((h) => " " + padCenter(row[h] ?? "", widths[h]) + " ").join("|") + "|");
  }
}

function loadDotEnv(envFile: string) {
  dotenv.config({ path: path.resolve(process.cwd(), envFile), quiet: true });
}

function loadMeta(lang: Lang, configFile: string): { meta: EnvMeta; configPath: string } {
  const cwd = process.cwd();

  const candidates = [
    path.resolve(cwd, configFile),
    path.resolve(cwd, "examples", configFile),
    path.resolve(cwd, "examples", "env.meta.json"),
  ];

  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) {
    fail(lang, "META_NOT_FOUND", [
      t(lang, "META_TRIED"),
      ...candidates.map((p) => `- ${p}`),
      "",
      t(lang, "META_TIP"),
      "  npx zod-envkit show -c examples/env.meta.json",
    ]);
  }

  // ✅ found гарантированно string, потому что fail() = never
  const configPath = found;

  try {
    const raw = fs.readFileSync(configPath, "utf8");
    return { meta: JSON.parse(raw) as EnvMeta, configPath };
  } catch {
    fail(lang, "META_PARSE_FAILED", [`- ${configPath}`]);
  }
}

const program = new Command();

program
  .name("zod-envkit")
  .description("Env docs + runtime checks for Node.js projects")
  .showHelpAfterError()
  .showSuggestionAfterError()
  .option("--lang <lang>", "CLI language (en | ru)");

program
  .command("generate")
  .description("Generate .env.example and ENV.md from env.meta.json")
  .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
  .option("--out-example <file>", "Output file for .env.example", ".env.example")
  .option("--out-docs <file>", "Output file for docs", "ENV.md")
  .action((opts) => {
    const lang = resolveLang(program.opts().lang);

    const { meta } = loadMeta(lang, opts.config);

    fs.writeFileSync(opts.outExample, generateEnvExample(meta), "utf8");
    fs.writeFileSync(opts.outDocs, generateEnvDocs(meta), "utf8");

    console.log(t(lang, "GENERATED", { example: opts.outExample, docs: opts.outDocs }));
    process.exit(0);
  });

program
  .command("show")
  .description("Show current env status (loads .env, masks secrets)")
  .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
  .option("--env-file <file>", "Path to .env file", ".env")
  .action((opts) => {
    const lang = resolveLang(program.opts().lang);

    loadDotEnv(opts.envFile);
    const { meta } = loadMeta(lang, opts.config);

    const rows = Object.entries(meta).map(([key, m]) => {
      const required = m.required === false ? "no" : "yes";
      const raw = process.env[key];
      const present = raw && raw.length > 0 ? "yes" : "no";
      const value = raw ? maskValue(key, raw) : "";

      return {
        Key: key,
        Required: required,
        Present: present,
        Value: value,
        Description: m.description ?? "",
      };
    });

    printTable(rows, ["Key", "Required", "Present", "Value", "Description"]);
    process.exit(0);
  });

program
  .command("check")
  .description("Exit with code 1 if any required env var is missing (loads .env)")
  .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
  .option("--env-file <file>", "Path to .env file", ".env")
  .action((opts) => {
    const lang = resolveLang(program.opts().lang);

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

// default behavior: no subcommand -> generate
const known = new Set(["generate", "show", "check", "-h", "--help", "-V", "--version", "--lang"]);
const hasCommand = process.argv.slice(2).some((a) => known.has(a));

if (!hasCommand) process.argv.splice(2, 0, "generate");

program.parse(process.argv);
