#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli.ts
var import_node_fs = __toESM(require("fs"), 1);
var import_node_path = __toESM(require("path"), 1);
var import_commander = require("commander");

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
var program = new import_commander.Command();
program.name("smart-env").description("Generate .env.example and ENV.md from env.meta.json").option("-c, --config <file>", "Path to env meta json", "env.meta.json").option("--out-example <file>", "Output file for .env.example", ".env.example").option("--out-docs <file>", "Output file for docs", "ENV.md").action((opts) => {
  const configPath = import_node_path.default.resolve(process.cwd(), opts.config);
  const raw = import_node_fs.default.readFileSync(configPath, "utf8");
  const meta = JSON.parse(raw);
  import_node_fs.default.writeFileSync(opts.outExample, generateEnvExample(meta), "utf8");
  import_node_fs.default.writeFileSync(opts.outDocs, generateEnvDocs(meta), "utf8");
  console.log(`Generated: ${opts.outExample}, ${opts.outDocs}`);
});
program.parse();
