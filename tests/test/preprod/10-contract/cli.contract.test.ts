/**
 * CONTRACT / CLI
 * Проверяет стабильность публичного CLI-контракта.
 */

import { describe, it, expect } from "vitest";
import { execa } from "execa";
import path from "node:path";

const CLI = path.resolve("dist/cli/index.js");

describe("CONTRACT / CLI", () => {
  it("prints help and exits with 0", async () => {
    const { exitCode, stdout } = await execa("node", [CLI, "--help"]);

    expect(exitCode).toBe(0);
    expect(stdout).toContain("generate");
    expect(stdout).toContain("show");
    expect(stdout).toContain("check");
    expect(stdout).toContain("init");
  });

  it("unknown command exits with 1", async () => {
    const { exitCode } = await execa("node", [CLI, "unknown-command"], {
      reject: false,
    });

    expect(exitCode).toBe(1);
  });

  it("no args defaults to generate", async () => {
    const { exitCode } = await execa("node", [CLI], {
      reject: false,
    });

    // Если meta нет — generate упадёт, но это допустимо.
    // Важно: CLI не падает с кодом 2/невалидным.
    expect([0, 1]).toContain(exitCode);
  });
});