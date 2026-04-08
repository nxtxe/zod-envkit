/**
 * CLI E2E / check (CI gate)
 */
import { describe, it, expect } from "vitest";
import { withDir } from "tmp-promise";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runZodEnvkit } from "@test/helpers/cli";
import { writeFile } from "@test/helpers/fs";
import { makeMeta } from "@test/helpers/meta";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_FIXTURE = path.resolve(__dirname, "../../fixtures/schema.env.cjs");

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
      expect(r.all).toMatch(/dotenv-loaded|dotenv|dotenv-файл/i);
      expect(r.all).toContain("EXTRA");
    }, { unsafeCleanup: true });
  });

  it("check --strict groups missing and unknown sections in one failure", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "EXTRA=1\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--strict", "--dotenv", ".env"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(1);
      expect(r.all).toMatch(/Environment is invalid|некорректно/i);
      expect(r.all).toMatch(/Missing|required|Отсутствуют|обязател/i);
      expect(r.all).toMatch(/Unknown|неизвест/i);
      expect(r.all).toContain("PORT");
      expect(r.all).toContain("EXTRA");
    }, { unsafeCleanup: true });
  });

  it("check --strict output stays deterministic across repeated runs", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "EXTRA=1\n");

      const run1 = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--strict", "--dotenv", ".env", "--lang", "en"],
        reject: false,
        inheritProcessEnv: false,
      });
      const run2 = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--strict", "--dotenv", ".env", "--lang", "en"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(run1.exitCode).toBe(1);
      expect(run2.exitCode).toBe(1);

      // Exact string lock to prevent accidental formatting drift.
      expect(run2.all).toBe(run1.all);
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

  it("check without --strict passes when unknown vars present in dotenv", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\nEXTRA=1\n");

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

  it("check --schema with matching meta passes", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([
          { key: "PORT", required: true, example: "3000" },
          { key: "NODE_ENV", required: true, example: "development" },
        ])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\nNODE_ENV=test\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env", "--schema", SCHEMA_FIXTURE],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(0);
      expect(r.all).toMatch(/ok|в порядке/i);
    }, { unsafeCleanup: true });
  });

  it("check --schema with schema key not in meta fails in strict mode", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\nNODE_ENV=test\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env", "--schema", SCHEMA_FIXTURE, "--schema-mode", "strict"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(1);
      expect(r.all).toMatch(/not listed in env\.meta|not in meta|SCHEMA_VARS_NOT_IN_META|отсутствуют/i);
      expect(r.all).toContain("NODE_ENV");
    }, { unsafeCleanup: true });
  });

  it("check --schema with meta key not in schema fails in strict mode", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([
          { key: "PORT", required: true, example: "3000" },
          { key: "NODE_ENV", required: true, example: "development" },
          { key: "EXTRA_IN_META", required: false, example: "x" },
        ])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\nNODE_ENV=test\nEXTRA_IN_META=x\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env", "--schema", SCHEMA_FIXTURE, "--schema-mode", "strict"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(1);
      expect(r.all).toMatch(/not in schema|META_VARS_NOT_IN_SCHEMA|отсутствуют в схеме/i);
      expect(r.all).toContain("EXTRA_IN_META");
    }, { unsafeCleanup: true });
  });

  it("check --schema --schema-mode warn exits 0 but prints mismatch", async () => {
    await withDir(async ({ path: dir }) => {
      await writeFile(
        path.join(dir, "env.meta.json"),
        makeMeta([{ key: "PORT", required: true, example: "3000" }])
      );
      await writeFile(path.join(dir, ".env"), "PORT=3000\nNODE_ENV=test\n");

      const r = await runZodEnvkit({
        cwd: dir,
        args: ["check", "--dotenv", ".env", "--schema", SCHEMA_FIXTURE, "--schema-mode", "warn"],
        reject: false,
        inheritProcessEnv: false,
      });

      expect(r.exitCode).toBe(0);
      expect(r.all).toMatch(/NODE_ENV|not listed|not in meta/i);
      expect(r.all).toMatch(/ok|в порядке/i);
    }, { unsafeCleanup: true });
  });
});