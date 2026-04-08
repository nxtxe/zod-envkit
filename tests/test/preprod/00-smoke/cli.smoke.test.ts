/**
 * SMOKE / CLI
 * Проверка: бинарь существует и отвечает на базовую команду.
 */

import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "../../helpers/cli";
import { writeFile } from "../../helpers/fs";
import { makeMeta } from "../../helpers/meta";

describe("SMOKE / CLI", () => {
  it("generate runs (exit 0) with minimal env.meta.json", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      const r = await runZodEnvkit({ cwd: dir, args: ["generate"], reject: false });
      expect(r.exitCode).toBe(0);
    }, { unsafeCleanup: true });
  });

  it("repeated invocations stay stable across locales", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\n");

      for (const lang of ["en", "ru"] as const) {
        const help = await runZodEnvkit({
          cwd: dir,
          args: ["--help", "--lang", lang],
          reject: false,
          inheritProcessEnv: false,
        });
        expect(help.exitCode).toBe(0);
        expect(help.all).toMatch(/generate|show|check|init/i);

        const version = await runZodEnvkit({
          cwd: dir,
          args: ["--version", "--lang", lang],
          reject: false,
          inheritProcessEnv: false,
        });
        expect(version.exitCode).toBe(0);
        expect((version.all ?? "").trim()).toMatch(/^\d+\.\d+\.\d+$/);

        const show = await runZodEnvkit({
          cwd: dir,
          args: ["show", "--lang", lang],
          reject: false,
          inheritProcessEnv: false,
        });
        expect(show.exitCode).toBe(0);

        const check = await runZodEnvkit({
          cwd: dir,
          args: ["check", "--lang", lang],
          reject: false,
          inheritProcessEnv: false,
        });
        expect(check.exitCode).toBe(0);
      }
    }, { unsafeCleanup: true });
  });

  it("help --all shows extended handbook for deep usage", async () => {
    await withDir(async ({ path: dir }) => {
      const outEn = await runZodEnvkit({
        cwd: dir,
        args: ["help", "--all", "--lang", "en"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(outEn.exitCode).toBe(0);
      expect(outEn.all).toContain("zod-envkit deep help");
      expect(outEn.all).toContain("Recommended workflows");
      expect(outEn.all).toMatch(/generate|show|check|init/i);

      const outRu = await runZodEnvkit({
        cwd: dir,
        args: ["help", "--all", "--lang", "ru"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(outRu.exitCode).toBe(0);
      expect(outRu.all).toContain("подробная справка");
      expect(outRu.all).toContain("Рекомендуемые workflow");
      expect(outRu.all).toMatch(/generate|show|check|init/i);
    }, { unsafeCleanup: true });
  });

  it("--help shows localized tip about help --all", async () => {
    await withDir(async ({ path: dir }) => {
      const en = await runZodEnvkit({
        cwd: dir,
        args: ["--help", "--lang", "en"],
        reject: false,
        inheritProcessEnv: false,
      });
      expect(en.exitCode).toBe(0);
      expect(en.all).toContain("help --all");
      expect(en.all).toContain("extended handbook");

      const ru = await runZodEnvkit({
        cwd: dir,
        args: ["--help", "--lang", "ru"],
        reject: false,
        inheritProcessEnv: false,
      });
      expect(ru.exitCode).toBe(0);
      expect(ru.all).toContain("help --all");
      expect(ru.all).toContain("расширенную справку");
    }, { unsafeCleanup: true });
  });
});