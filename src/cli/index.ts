#!/usr/bin/env node
import { Command } from "commander";
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

program
  .name("zod-envkit")
  .description("Env docs + runtime checks for Node.js projects")
  .showHelpAfterError()
  .showSuggestionAfterError()
  .option("--lang <lang>", "CLI language (en | ru)");

const getLang = () => resolveLang(program.opts().lang);

registerGenerate(program, getLang);
registerShow(program, getLang);
registerCheck(program, getLang);
registerInit(program, getLang);

program.parse(process.argv);
