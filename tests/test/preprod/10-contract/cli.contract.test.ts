/**
 * CONTRACT / CLI behavior
 *
 * Проверяет:
 * - help вывод содержит основные команды
 * - exit codes стабильны
 * - маскинг работает корректно
 */

import { describe, it, expect } from "vitest";
import { execa } from "execa";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CLI = path.resolve("dist/cli/index.js");

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "zod-envkit-test-"));
}

describe("CONTRACT / CLI", () => {
  it("help contains core commands", async () => {
    const { stdout, exitCode } = await execa("node", [CLI, "--help"]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain("generate");
    expect(stdout).toContain("show");
    expect(stdout).toContain("check");
    expect(stdout).toContain("init");
  });

  it("check exits with 1 on missing env", async () => {
    const dir = tmpDir();
    fs.writeFileSync(
      path.join(dir, "env.meta.json"),
      JSON.stringify({
        SECRET_TOKEN: { required: true }
      }, null, 2)
    );

    const result = await execa("node", [CLI, "check"], {
      cwd: dir,
      reject: false
    });

    expect(result.exitCode).toBe(1);
  });

  it("masking modes behave correctly", async () => {
    const dir = tmpDir();

    // create env.meta.json
    fs.writeFileSync(
      path.join(dir, "env.meta.json"),
      JSON.stringify({
        SECRET_TOKEN: {
          required: true,
          description: "Secret token"
        }
      }, null, 2)
    );

    // create .env
    fs.writeFileSync(
      path.join(dir, ".env"),
      `SECRET_TOKEN=abcdef123456\n`
    );

    // full mask
    const full = await execa("node", [CLI, "show", "--mask-mode", "full"], {
      cwd: dir
    });

    expect(full.stdout).toContain("********");

    // partial mask
    const partial = await execa("node", [CLI, "show", "--mask-mode", "partial"], {
      cwd: dir
    });

    expect(partial.stdout).toContain("ab");
    expect(partial.stdout).not.toContain("abcdef123456");

    // no mask
    const none = await execa("node", [CLI, "show", "--no-mask"], {
      cwd: dir
    });

    expect(none.stdout).toContain("abcdef123456");
  });
});