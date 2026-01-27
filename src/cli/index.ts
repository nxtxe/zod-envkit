#!/usr/bin/env node
import { Command } from "commander";
import { resolveLang } from "../i18n.js";
import { injectDefaultCommandIfMissing } from "./lib/argv.js";
import { registerGenerate } from "./commands/generate.js";
import { registerShow } from "./commands/show.js";
import { registerCheck } from "./commands/check.js";

injectDefaultCommandIfMissing(process.argv, {
  known: new Set(["generate", "show", "check", "-h", "--help", "-V", "--version", "--lang"]),
  defaultCommand: "generate",
});

const program = new Command();

program
  .name("zod-envkit")
  .description("Env docs + runtime checks for Node.js projects")
  .showHelpAfterError()
  .showSuggestionAfterError()
  .option("--lang <lang>", "CLI language (en | ru)");

registerGenerate(program, () => resolveLang(program.opts().lang));
registerShow(program, () => resolveLang(program.opts().lang));
registerCheck(program, () => resolveLang(program.opts().lang));

program.parse(process.argv);
