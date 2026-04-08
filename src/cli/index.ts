#!/usr/bin/env node
/** CLI entry. Stable in 1.2. */
import { Command } from "commander";
import fs from "node:fs";
import path from "node:path";
import { resolveLang } from "../i18n.js";
import { injectDefaultCommandIfMissing } from "./lib/argv.js";

import { registerGenerate } from "./commands/generate.js";
import { registerShow } from "./commands/show.js";
import { registerCheck } from "./commands/check.js";
import { registerInit } from "./commands/init.js";

// default behavior: no subcommand -> generate
injectDefaultCommandIfMissing(process.argv, {
  known: new Set([
    "generate",
    "show",
    "check",
    "init",
    "help",
    "-h",
    "--help",
    "--all",
    "-V",
    "--version",
    "--lang",
  ]),
  defaultCommand: "generate",
});

const program = new Command();
const scriptPath = process.argv[1] ? path.resolve(process.argv[1]) : path.resolve("dist/cli/index.js");
const packageJsonPath = path.resolve(path.dirname(scriptPath), "../../package.json");
const pkgVersion = (() => {
  try {
    const raw = fs.readFileSync(packageJsonPath, "utf8");
    const parsed = JSON.parse(raw) as { version?: string };
    return parsed.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
})();

program
  .name("zod-envkit")
  .description("Env docs + runtime checks for Node.js projects")
  .version(pkgVersion, "-V, --version", "output the current version")
  .showHelpAfterError()
  .showSuggestionAfterError()
  .option("--lang <lang>", "CLI language (en | ru)");

const getLang = () => resolveLang(program.opts().lang);

registerGenerate(program, getLang);
registerShow(program, getLang);
registerCheck(program, getLang);
registerInit(program, getLang);

function resolveCliLangArg(argv: string[]): string | undefined {
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i] ?? "";
    if (token === "--lang") return argv[i + 1];
    if (token.startsWith("--lang=")) return token.slice("--lang=".length);
  }
  return undefined;
}

function renderDeepHelp(lang: "en" | "ru"): string {
  const commandNames = program.commands.map((cmd) => cmd.name()).join(", ");
  const blocks = lang === "ru"
    ? [
        "=== zod-envkit подробная справка ===",
        "",
        "Базовая идея:",
        "  env.meta.json — источник правды для документации, проверок и онбординга.",
        "",
        "Быстрый старт:",
        "  1) npx zod-envkit init",
        "  2) npx zod-envkit generate",
        "  3) npx zod-envkit show",
        "  4) npx zod-envkit check --strict",
        "",
        "Доступные команды:",
        `  ${commandNames}`,
        "",
        "Рекомендуемые workflow:",
        "  - старт из существующего env example:",
        "      npx zod-envkit init --input .env.example --output env.meta.json",
        "  - детерминированная документация в CI:",
        "      npx zod-envkit generate --format md --sort required-first",
        "      npx zod-envkit check --strict --dotenv .env,.env.local",
        "  - проверка контракта schema ↔ meta:",
        "      npx zod-envkit check --schema ./schema/env.mjs --schema-mode strict",
        "",
        "Детальная справка по командам:",
        "",
      ]
    : [
        "=== zod-envkit deep help ===",
        "",
        "Core idea:",
        "  env.meta.json is the source of truth for docs, checks and onboarding.",
        "",
        "Quick start:",
        "  1) npx zod-envkit init",
        "  2) npx zod-envkit generate",
        "  3) npx zod-envkit show",
        "  4) npx zod-envkit check --strict",
        "",
        "Available commands:",
        `  ${commandNames}`,
        "",
        "Recommended workflows:",
        "  - bootstrap from existing env example:",
        "      npx zod-envkit init --input .env.example --output env.meta.json",
        "  - keep docs deterministic in CI:",
        "      npx zod-envkit generate --format md --sort required-first",
        "      npx zod-envkit check --strict --dotenv .env,.env.local",
        "  - validate schema contract against meta:",
        "      npx zod-envkit check --schema ./schema/env.mjs --schema-mode strict",
        "",
        "Detailed command reference:",
        "",
      ];

  for (const cmd of program.commands) {
    blocks.push(cmd.helpInformation().trim(), "");
  }

  if (lang === "ru") {
    blocks.push(
      "Подсказки:",
      "  - язык CLI: --lang en|ru",
      "  - справка по команде: npx zod-envkit help <command>",
      "  - полный гайд: npx zod-envkit help --all"
    );
  } else {
    blocks.push(
      "Tips:",
      "  - global language: --lang en|ru",
      "  - command help: npx zod-envkit help <command>",
      "  - full handbook: npx zod-envkit help --all"
    );
  }

  return `${blocks.join("\n").trimEnd()}\n`;
}

program.addHelpText("after", () => {
  const lang = resolveLang(resolveCliLangArg(process.argv.slice(2)));
  return lang === "ru"
    ? "\nДополнительно: `npx zod-envkit help --all` выводит расширенную справку с workflow и полной сводкой команд.\n"
    : "\nTip: `npx zod-envkit help --all` prints an extended handbook with workflows and full command reference.\n";
});

const cliArgs = process.argv.slice(2);
if (cliArgs[0] === "help" && cliArgs.includes("--all")) {
  const lang = resolveLang(resolveCliLangArg(cliArgs));
  process.stdout.write(renderDeepHelp(lang));
  process.exit(0);
}

program.parse(process.argv);
