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
    "-h",
    "--help",
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

program.parse(process.argv);
