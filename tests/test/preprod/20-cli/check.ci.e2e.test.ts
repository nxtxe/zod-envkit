/**
 * CLI E2E / check (CI gate)
 */
import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { runZodEnvkit } from "@test/helpers/cli";
import { writeFile } from "@test/helpers/fs";
import { makeMeta } from "@test/helpers/meta";

describe("CLI E2E / check", () => {
  it("check passes when env ok", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(0);
      expect(r.all).toMatch(/ok|в порядке/i);
    }, { unsafeCleanup: true });
  });

  it("check fails on missing required vars", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      // no .env written

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(1);
      expect((r.all ?? "")).toMatch(/Missing|required|Отсутствуют|обязател/i);
      expect((r.all ?? "")).toContain("PORT");
    }, { unsafeCleanup: true });
  });

  it("check --strict fails on unknown env vars from dotenv", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\nEXTRA=1\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--strict", "--dotenv", ".env"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(1);
      expect(r.all).toMatch(/Unknown|неизвест/i);
      expect(r.all).toContain("EXTRA");
    }, { unsafeCleanup: true });
  });

  it("check --strict ignores host env noise (dotenv-only unknown check)", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--strict", "--dotenv", ".env"],
        reject: false,
        // важно: разрешаем host env, но strict должен смотреть только на dotenv env
        inheritProcessEnv: true,
        env: { EXTRA_HOST_NOISE: "1" },
      });

      expect(r.exitCode).toBe(0);
      expect(r.all).not.toMatch(/EXTRA_HOST_NOISE/i);
    }, { unsafeCleanup: true });
  });

  it("dotenv priority: later files override earlier ones", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );

      await writeFile(path.join(dir, ".env"), "PORT=3000\n");
      await writeFile(path.join(dir, ".env.local"), "PORT=4000\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env,.env.local"],
        reject: false,
        inheritProcessEnv: false,
      });

      // check не выводит значение, но должен пройти (PORT присутствует)
      expect(r.exitCode).toBe(0);

      // Доп. проверка через show чтобы гарантировать override семантику (не ломает контракт check)
      const s = await runZodEnvkit({
        cwd: dir,
        args: ["show", "--dotenv", ".env,.env.local", "--mask-mode", "none"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(s.exitCode).toBe(0);
      expect(s.all).toContain("4000");
      expect(s.all).not.toContain("3000");
    }, { unsafeCleanup: true });
  });
});