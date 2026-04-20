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

  it("version flag works and prints semver", async () => {
    const { stdout, exitCode } = await execa("node", [CLI, "--version"]);
    expect(exitCode).toBe(0);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
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

  it("show table headers stay stable", async () => {
    const dir = tmpDir();
    fs.writeFileSync(
      path.join(dir, "env.meta.json"),
      JSON.stringify(
        {
          PORT: { required: true, description: "HTTP port", example: "3000" },
        },
        null,
        2
      )
    );
    fs.writeFileSync(path.join(dir, ".env"), "PORT=3000\n");

    const res = await execa("node", [CLI, "show", "--mask-mode", "none"], {
      cwd: dir,
      reject: false,
    });

    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain("Key");
    expect(res.stdout).toContain("Required");
    expect(res.stdout).toContain("Present");
    expect(res.stdout).toContain("Value");
    expect(res.stdout).toContain("Description");
  });

  it("help --all keeps stable section shape in en and ru", async () => {
    const en = await execa("node", [CLI, "help", "--all", "--lang", "en"], { reject: false });
    const ru = await execa("node", [CLI, "help", "--all", "--lang", "ru"], { reject: false });

    expect(en.exitCode).toBe(0);
    expect(ru.exitCode).toBe(0);

    expect(en.stdout).toContain("=== zod-envkit deep help ===");
    expect(en.stdout).toContain("Quick start:");
    expect(en.stdout).toContain("Recommended workflows:");
    expect(en.stdout).toContain("Detailed command reference:");

    expect(ru.stdout).toContain("=== zod-envkit подробная справка ===");
    expect(ru.stdout).toContain("Быстрый старт:");
    expect(ru.stdout).toContain("Рекомендуемые workflow:");
    expect(ru.stdout).toContain("Детальная справка по командам:");
  });
});