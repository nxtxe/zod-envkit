#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { Command } from "commander";
import dotenv from "dotenv";
import { generateEnvDocs, generateEnvExample, type EnvMeta } from "./generate.js";

function maskValue(key: string, value: string): string {
    const k = key.toUpperCase();

    // считаем "секретами" по названию
    const isSecret =
        k.includes("TOKEN") ||
        k.includes("SECRET") ||
        k.includes("PASSWORD") ||
        k.includes("API_KEY") ||
        k.includes("KEY");

    if (!isSecret) return value;

    if (value.length <= 4) return "*".repeat(value.length);
    return value.slice(0, 2) + "*".repeat(Math.max(1, value.length - 4)) + value.slice(-2);
}

function padCenter(text: string, width: number): string {
    const t = text ?? "";
    const diff = width - t.length;
    if (diff <= 0) return t;
    const left = Math.floor(diff / 2);
    const right = diff - left;
    return " ".repeat(left) + t + " ".repeat(right);
}

function printTable(rows: Array<Record<string, string>>, headers: string[]) {
    const widths: Record<string, number> = {};
    for (const h of headers) widths[h] = h.length;

    for (const row of rows) {
        for (const h of headers) {
            widths[h] = Math.max(widths[h], (row[h] ?? "").length);
        }
    }

    // чуть воздуха
    for (const h of headers) widths[h] += 2;

    const line =
        "|" + headers.map((h) => " " + padCenter(h, widths[h]) + " ").join("|") + "|";
    const sep =
        "|" + headers.map((h) => ":" + "-".repeat(Math.max(3, widths[h])) + ":").join("|") + "|";

    console.log(line);
    console.log(sep);

    for (const row of rows) {
        const rowLine =
            "|" +
            headers
                .map((h) => " " + padCenter(row[h] ?? "", widths[h]) + " ")
                .join("|") +
            "|";
        console.log(rowLine);
    }
}

function loadMeta(configFile: string): EnvMeta {
    const cwd = process.cwd();

    const candidates = [
        path.resolve(cwd, configFile),                 // ./env.meta.json (по умолчанию)
        path.resolve(cwd, "examples", configFile),     // ./examples/env.meta.json
        path.resolve(cwd, "examples", "env.meta.json") // явный fallback
    ];

    const configPath = candidates.find((p) => fs.existsSync(p));

    if (!configPath) {
        console.error("❌ env meta file not found.");
        console.error("Tried:");
        for (const p of candidates) console.error(`- ${p}`);
        console.error("\nTip:");
        console.error("  zod-envkit show -c examples/env.meta.json");
        process.exit(1);
    }

    const raw = fs.readFileSync(configPath, "utf8");
    return JSON.parse(raw) as EnvMeta;
}



const program = new Command();

program.name("zod-envkit").description("Env docs + runtime checks for Node.js projects");

program
    .command("generate")
    .description("Generate .env.example and ENV.md from env.meta.json")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--out-example <file>", "Output file for .env.example", ".env.example")
    .option("--out-docs <file>", "Output file for docs", "ENV.md")
    .action((opts) => {
        const meta = loadMeta(opts.config);

        fs.writeFileSync(opts.outExample, generateEnvExample(meta), "utf8");
        fs.writeFileSync(opts.outDocs, generateEnvDocs(meta), "utf8");

        console.log(`Generated: ${opts.outExample}, ${opts.outDocs}`);
    });

// чтобы старое поведение не ломать: если вызвать без команды — делаем generate
program
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--out-example <file>", "Output file for .env.example", ".env.example")
    .option("--out-docs <file>", "Output file for docs", "ENV.md");

program
    .command("show")
    .description("Show current env status (loads .env, masks secrets)")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--env-file <file>", "Path to .env file", ".env")
    .action((opts) => {
        dotenv.config({ path: path.resolve(process.cwd(), opts.envFile), quiet: true });
        const meta = loadMeta(opts.config);

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
    });

program
    .command("check")
    .description("Exit with code 1 if any required env var is missing (loads .env)")
    .option("-c, --config <file>", "Path to env meta json", "env.meta.json")
    .option("--env-file <file>", "Path to .env file", ".env")
    .action((opts) => {
        dotenv.config({ path: path.resolve(process.cwd(), opts.envFile) });
        const meta = loadMeta(opts.config);

        const missing: string[] = [];
        for (const [key, m] of Object.entries(meta)) {
            const required = m.required !== false;
            if (!required) continue;
            const raw = process.env[key];
            if (!raw || raw.length === 0) missing.push(key);
        }

        if (missing.length) {
            console.error("❌ Missing required environment variables:");
            for (const k of missing) console.error(`- ${k}`);
            process.exit(1);
        }

        console.log("✅ Environment looks good.");
    });

program.parse(process.argv);

// default: если вызвали без подкоманды — работаем как generate
// commander не даёт это “прямо красиво”, поэтому делаем простую проверку:
const hasSubcommand = process.argv.slice(2).some((a) => ["generate", "show", "check"].includes(a));
if (!hasSubcommand) {
    const opts = program.opts();
    const meta = loadMeta(opts.config ?? "env.meta.json");
    fs.writeFileSync(opts.outExample ?? ".env.example", generateEnvExample(meta), "utf8");
    fs.writeFileSync(opts.outDocs ?? "ENV.md", generateEnvDocs(meta), "utf8");
    console.log(`Generated: ${opts.outExample ?? ".env.example"}, ${opts.outDocs ?? "ENV.md"}`);
}
