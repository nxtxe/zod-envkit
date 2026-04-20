/**
 * CLI E2E / dotenv priority sanity
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";
import { makeMeta } from "../../helpers/meta";

describe("CLI E2E / dotenv priority", () => {
  it("later file in --dotenv list wins (sanity check via output)", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      await writeFile(path.join(dir, ".env"), "PORT=3000\n");
      await writeFile(path.join(dir, ".env.local"), "PORT=4000\n");

      const r = await runZodEnvkit({ cwd: dir, args: ["show", "--dotenv", ".env,.env.local"], reject: false });
      expect(r.exitCode).toBe(0);
      expect(r.all).toContain("4000");
    }, { unsafeCleanup: true });
  });

  it("three files: last in --dotenv list wins", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\n");
      await writeFile(path.join(dir, ".env.override"), "PORT=4000\n");
      await writeFile(path.join(dir, ".env.local"), "PORT=5000\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--dotenv", ".env,.env.override,.env.local", "--mask-mode", "none"],
        reject: false,
        inheritProcessEnv: false,
      });
      expect(r.exitCode).toBe(0);
      expect(r.all).toContain("5000");
      expect(r.all).not.toContain("4000");
      expect(r.all).not.toContain("3000");
    }, { unsafeCleanup: true });
  });

  it("dotenv parser handles BOM, trailing spaces, and duplicate keys predictably", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      // First file includes BOM + duplicate key; dotenv.parse keeps the last one.
      await writeFile(path.join(dir, ".env"), "\uFEFFPORT=3000\nPORT=3100\n");
      // Second file overrides with a value that has spaces around "=".
      await writeFile(path.join(dir, ".env.local"), "PORT =  4200  \n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--dotenv", ".env,.env.local", "--mask-mode", "none"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(0);
      expect(r.all).toContain("4200");
      expect(r.all).not.toContain("3100");
      expect(r.all).not.toContain("3000");
    }, { unsafeCleanup: true });
  });

  it("--dotenv empty string falls back to default .env", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=4300\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--dotenv", "", "--mask-mode", "none"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(0);
      expect(r.all).toContain("4300");
    }, { unsafeCleanup: true });
  });

  it("--dotenv with extra commas/spaces is normalized", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3100\n");
      await writeFile(path.join(dir, ".env.local"), "PORT=5100\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--dotenv", ",, .env, , .env.local ,", "--mask-mode", "none"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(0);
      expect(r.all).toContain("5100");
      expect(r.all).not.toContain("3100");
    }, { unsafeCleanup: true });
  });

  it("repeated files in --dotenv list keep deterministic override result", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3200\n");
      await writeFile(path.join(dir, ".env.local"), "PORT=6200\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--dotenv", ".env,.env,.env.local,.env.local", "--mask-mode", "none"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(0);
      expect(r.all).toContain("6200");
      expect(r.all).not.toContain("3200");
    }, { unsafeCleanup: true });
  });

  it("only missing dotenv files do not crash and check reports missing required vars", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env.missing,.env.also-missing"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(1);
      expect(r.all).toMatch(/Missing|required|Отсутствуют|обязател/i);
      expect(r.all).toContain("PORT");
    }, { unsafeCleanup: true });
  });
});